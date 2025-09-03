import { GitHubProject, ProjectMetrics } from '@/types/github';

// GHArchive事件类型
interface GHArchiveEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  public: boolean;
  created_at: string;
}

// 热门项目统计接口
interface TrendingProject {
  repo_name: string;
  stars_added: number;
  forks_added: number;
  total_events: number;
  unique_contributors: number;
  languages: string[];
  topics: string[];
  description?: string;
  homepage?: string;
  license?: string;
  created_at: string;
  pushed_at: string;
  size: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export class GHArchiveClient {
  private static readonly BASE_URL = 'https://data.gharchive.org';
  private static readonly GITHUB_API_BASE = 'https://api.github.com';
  
  // 获取指定时间范围内的热门项目
  static async getTrendingProjects(
    days: number = 7,
    minStars: number = 10,
    limit: number = 100
  ): Promise<TrendingProject[]> {
    const projects: Map<string, any> = new Map();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // 分析最近几天的GitHub事件
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      try {
        // 获取当天的GitHub事件数据
        const events = await this.fetchDayEvents(dateStr);
        this.processEventsForTrending(events, projects);
      } catch (error) {
        console.warn(`Failed to fetch events for ${dateStr}:`, error);
      }
    }

    // 转换为数组并排序
    const trendingList = Array.from(projects.values())
      .filter((p: any) => p.stars_added >= minStars)
      .sort((a: any, b: any) => b.stars_added - a.stars_added)
      .slice(0, limit);

    // 增强项目信息
    return await this.enhanceProjectsWithGitHubAPI(trendingList);
  }

  // 获取特定日期的GitHub事件数据
  private static async fetchDayEvents(date: string): Promise<GHArchiveEvent[]> {
    // GHArchive按小时存储数据，我们获取当天所有小时的数据
    const events: GHArchiveEvent[] = [];
    
    // 只获取几个关键小时的数据以避免过载
    const keyHours = [0, 6, 12, 18]; // UTC时间的关键时段
    
    for (const hour of keyHours) {
      const hourStr = hour.toString().padStart(2, '0');
      const url = `${this.BASE_URL}/${date}-${hourStr}.json.gz`;
      
      try {
        // 在实际生产环境中，这里需要处理gzip压缩的JSON数据
        // 由于浏览器限制，我们使用GitHub API的trending搜索作为替代
        const trendingData = await this.fetchGitHubTrending(date);
        events.push(...trendingData);
      } catch (error) {
        console.warn(`Failed to fetch hour ${hourStr} for ${date}:`, error);
      }
    }

    return events;
  }

  // 使用GitHub API获取趋势数据作为GHArchive的替代
  private static async fetchGitHubTrending(date: string): Promise<GHArchiveEvent[]> {
    const queries = [
      `created:>${date} stars:>10 sort:stars`,
      `pushed:>${date} stars:>50 sort:stars`,
      `language:typescript stars:>20 pushed:>${date}`,
      `language:javascript stars:>20 pushed:>${date}`,
      `language:python stars:>20 pushed:>${date}`,
      `topic:ai stars:>10 pushed:>${date}`,
      `topic:automation stars:>10 pushed:>${date}`,
      `topic:saas stars:>10 pushed:>${date}`,
      `topic:productivity stars:>10 pushed:>${date}`,
    ];

    const events: GHArchiveEvent[] = [];

    for (const query of queries) {
      try {
        const searchUrl = `${this.GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&per_page=30`;
        const response = await fetch(searchUrl, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          for (const repo of data.items) {
            events.push({
              id: `${repo.id}-star`,
              type: 'WatchEvent',
              actor: {
                id: repo.owner.id,
                login: repo.owner.login,
                display_login: repo.owner.login,
                gravatar_id: '',
                url: repo.owner.url,
                avatar_url: repo.owner.avatar_url
              },
              repo: {
                id: repo.id,
                name: repo.full_name,
                url: repo.url
              },
              payload: { repo },
              public: true,
              created_at: date + 'T12:00:00Z'
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to search with query "${query}":`, error);
      }
    }

    return events;
  }

  // 处理事件数据以提取趋势信息
  private static processEventsForTrending(events: GHArchiveEvent[], projects: Map<string, any>) {
    for (const event of events) {
      const repoName = event.repo.name;
      
      if (!projects.has(repoName)) {
        projects.set(repoName, {
          repo_name: repoName,
          stars_added: 0,
          forks_added: 0,
          total_events: 0,
          unique_contributors: new Set(),
          languages: new Set(),
          topics: new Set(),
        });
      }

      const project = projects.get(repoName);
      if (!project) continue; // 安全检查
      
      project.total_events++;
      
      // 安全检查Set是否存在
      if (project.unique_contributors && project.unique_contributors.add) {
        project.unique_contributors.add(event.actor.login);
      }

      // 根据事件类型更新统计
      switch (event.type) {
        case 'WatchEvent':
          project.stars_added++;
          break;
        case 'ForkEvent':
          project.forks_added++;
          break;
        case 'PushEvent':
          if (project.unique_contributors && project.unique_contributors.add) {
            project.unique_contributors.add(event.actor.login);
          }
          break;
      }

      // 提取项目信息
      if (event.payload?.repo) {
        const repo = event.payload.repo;
        project.description = repo.description;
        project.homepage = repo.homepage;
        project.license = repo.license?.name;
        project.created_at = repo.created_at;
        project.pushed_at = repo.pushed_at;
        project.size = repo.size;
        project.open_issues = repo.open_issues_count;
        project.watchers = repo.watchers_count;
        project.default_branch = repo.default_branch;
        
        if (repo.language && project.languages && project.languages.add) {
          project.languages.add(repo.language);
        }
        if (repo.topics && project.topics && project.topics.add) {
          repo.topics.forEach((topic: string) => project.topics.add(topic));
        }
      }
    }

    // 转换Set为Array，添加安全检查
    projects.forEach((project) => {
      project.unique_contributors = project.unique_contributors && project.unique_contributors.size 
        ? project.unique_contributors.size 
        : 0;
      project.languages = project.languages && project.languages.size 
        ? Array.from(project.languages) 
        : [];
      project.topics = project.topics && project.topics.size 
        ? Array.from(project.topics) 
        : [];
    });
  }

  // 使用GitHub API增强项目信息
  private static async enhanceProjectsWithGitHubAPI(projects: TrendingProject[]): Promise<TrendingProject[]> {
    const enhanced = [];

    for (const project of projects) {
      try {
        const [owner, repo] = project.repo_name.split('/');
        const response = await fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}`, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        });

        if (response.ok) {
          const repoData = await response.json();
          enhanced.push({
            ...project,
            description: repoData.description || project.description,
            homepage: repoData.homepage || project.homepage,
            license: repoData.license?.name || project.license,
            languages: repoData.language ? [repoData.language] : project.languages,
            topics: repoData.topics || project.topics,
            created_at: repoData.created_at,
            pushed_at: repoData.pushed_at,
            size: repoData.size,
            open_issues: repoData.open_issues_count,
            watchers: repoData.watchers_count,
            default_branch: repoData.default_branch,
          });
        } else {
          enhanced.push(project);
        }
      } catch (error) {
        console.warn(`Failed to enhance project ${project.repo_name}:`, error);
        enhanced.push(project);
      }
    }

    return enhanced;
  }

  // 搜索项目（支持关键词、语言、topic等）
  static async searchProjects(
    query: string,
    filters: {
      language?: string;
      minStars?: number;
      maxAge?: number; // 天数
      topics?: string[];
    } = {},
    limit: number = 50
  ): Promise<GitHubProject[]> {
    let searchQuery = query;

    // 构建搜索查询
    if (filters.language) {
      searchQuery += ` language:${filters.language}`;
    }
    
    if (filters.minStars) {
      searchQuery += ` stars:>${filters.minStars}`;
    }

    if (filters.maxAge) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.maxAge);
      searchQuery += ` created:>${cutoffDate.toISOString().split('T')[0]}`;
    }

    if (filters.topics?.length) {
      filters.topics.forEach(topic => {
        searchQuery += ` topic:${topic}`;
      });
    }

    try {
      const response = await fetch(
        `${this.GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.items;
      } else {
        throw new Error(`Search failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // 获取项目的详细分析数据
  static async getProjectAnalytics(owner: string, repo: string) {
    try {
      const [repoData, contributors, releases, issues] = await Promise.all([
        fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}`, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }).then(r => r.json()),
        
        fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=100`, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }).then(r => r.json()),
        
        fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=10`, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }).then(r => r.json()),
        
        fetch(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=100`, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        }).then(r => r.json())
      ]);

      return {
        repository: repoData,
        contributors: contributors || [],
        releases: releases || [],
        issues: issues || [],
        analytics: {
          contributor_growth: this.calculateContributorGrowth(contributors),
          release_frequency: this.calculateReleaseFrequency(releases),
          issue_resolution_rate: this.calculateIssueResolutionRate(issues),
          community_health_score: this.calculateCommunityHealthScore(repoData, contributors, issues)
        }
      };
    } catch (error) {
      console.error(`Failed to get analytics for ${owner}/${repo}:`, error);
      return null;
    }
  }

  // 计算贡献者增长率
  private static calculateContributorGrowth(contributors: any[]): number {
    if (!contributors?.length) return 0;
    // 简化计算：基于贡献者数量的对数增长
    return Math.min(contributors.length / 10, 100);
  }

  // 计算发版频率
  private static calculateReleaseFrequency(releases: any[]): number {
    if (!releases?.length) return 0;
    
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    
    const recentReleases = releases.filter(release => 
      new Date(release.published_at) >= oneYearAgo
    );
    
    return recentReleases.length;
  }

  // 计算issue解决率
  private static calculateIssueResolutionRate(issues: any[]): number {
    if (!issues?.length) return 100;
    
    const closedIssues = issues.filter(issue => issue.state === 'closed').length;
    return (closedIssues / issues.length) * 100;
  }

  // 计算社区健康评分
  private static calculateCommunityHealthScore(repo: any, contributors: any[], issues: any[]): number {
    let score = 0;
    
    // 基础分：项目活跃度
    if (repo.pushed_at) {
      const daysSinceLastPush = (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
      score += daysSinceLastPush < 7 ? 25 : daysSinceLastPush < 30 ? 15 : 5;
    }
    
    // 贡献者多样性
    score += Math.min(contributors?.length || 0, 25);
    
    // 文档质量
    score += repo.has_wiki ? 10 : 0;
    score += repo.description ? 10 : 0;
    score += repo.homepage ? 10 : 0;
    
    // issue管理
    const issueResolutionRate = this.calculateIssueResolutionRate(issues);
    score += issueResolutionRate > 80 ? 20 : issueResolutionRate > 60 ? 15 : 10;
    
    return Math.min(score, 100);
  }
}