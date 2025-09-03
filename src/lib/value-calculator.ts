import { GitHubProject, ProjectMetrics } from '@/types/github';
import { GitHubAPI } from './github-api';

export class ValueCalculator {
  
  static calculateValueScore(project: GitHubProject, metrics: Partial<ProjectMetrics>): number {
    let score = 0;
    
    // 1. 增长潜力 (30%)
    const growthScore = this.calculateGrowthScore(project, metrics);
    score += growthScore * 0.3;
    
    // 2. 技术成熟度 (25%)
    const maturityScore = this.calculateMaturityScore(project);
    score += maturityScore * 0.25;
    
    // 3. 商业化可能性 (25%)
    const commercialScore = this.calculateCommercialScore(project);
    score += commercialScore * 0.25;
    
    // 4. 社区活跃度 (20%)
    const communityScore = this.calculateCommunityScore(project, metrics);
    score += communityScore * 0.2;
    
    return Math.round(score);
  }
  
  private static calculateGrowthScore(project: GitHubProject, metrics: Partial<ProjectMetrics>): number {
    let score = 0;
    
    // Star增长率
    if (metrics.stars_growth_30d !== undefined) {
      const growthRate = metrics.stars_growth_30d / Math.max(project.stargazers_count, 1);
      score += Math.min(growthRate * 100, 40); // 最高40分
    }
    
    // Fork/Star比例 (表示实际使用)
    const forkRatio = project.forks_count / Math.max(project.stargazers_count, 1);
    score += Math.min(forkRatio * 200, 30); // 最高30分
    
    // 项目年龄调整 (新项目有更多增长潜力)
    const ageInDays = (Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays < 365) {
      score += 30; // 新项目加分
    } else if (ageInDays < 365 * 2) {
      score += 15;
    }
    
    return Math.min(score, 100);
  }
  
  private static calculateMaturityScore(project: GitHubProject): number {
    let score = 0;
    
    // 描述完整性
    if (project.description && project.description.length > 20) {
      score += 20;
    }
    
    // 有主页链接
    if (project.homepage) {
      score += 15;
    }
    
    // 有许可证
    if (project.license) {
      score += 15;
    }
    
    // 有主题标签
    if (project.topics && project.topics.length > 0) {
      score += 10;
    }
    
    // 最近更新频率
    const daysSinceUpdate = (Date.now() - new Date(project.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) {
      score += 25;
    } else if (daysSinceUpdate < 30) {
      score += 15;
    } else if (daysSinceUpdate < 90) {
      score += 10;
    }
    
    // 编程语言 (某些语言更适合商业化)
    const businessLanguages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'C#'];
    if (project.language && businessLanguages.includes(project.language)) {
      score += 15;
    }
    
    return Math.min(score, 100);
  }
  
  private static calculateCommercialScore(project: GitHubProject): number {
    let score = 0;
    
    // 项目名称和描述中的商业关键词
    const commercialKeywords = [
      'saas', 'b2b', 'enterprise', 'commercial', 'business', 'revenue', 
      'monetization', 'platform', 'dashboard', 'analytics', 'api', 
      'workflow', 'automation', 'management', 'crm', 'cms'
    ];
    
    const text = `${project.name} ${project.description || ''}`.toLowerCase();
    const matchCount = commercialKeywords.filter(keyword => text.includes(keyword)).length;
    score += Math.min(matchCount * 10, 40);
    
    // 主题标签中的商业相关性
    if (project.topics) {
      const businessTopics = project.topics.filter(topic => 
        commercialKeywords.some(keyword => topic.toLowerCase().includes(keyword))
      );
      score += Math.min(businessTopics.length * 15, 30);
    }
    
    // Star数量 (受欢迎程度)
    if (project.stargazers_count > 10000) {
      score += 30;
    } else if (project.stargazers_count > 1000) {
      score += 20;
    } else if (project.stargazers_count > 100) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }
  
  private static calculateCommunityScore(project: GitHubProject, metrics: Partial<ProjectMetrics>): number {
    let score = 0;
    
    // Contributors数量
    if (metrics.contributors_count !== undefined) {
      if (metrics.contributors_count > 50) {
        score += 30;
      } else if (metrics.contributors_count > 10) {
        score += 20;
      } else if (metrics.contributors_count > 3) {
        score += 10;
      }
    }
    
    // Issue处理情况
    if (metrics.issue_close_rate !== undefined) {
      score += metrics.issue_close_rate * 25; // 最高25分
    }
    
    // Watchers vs Stars (社区参与度)
    const watcherRatio = project.watchers_count / Math.max(project.stargazers_count, 1);
    score += Math.min(watcherRatio * 100, 20);
    
    // 开放Issues数量 (活跃讨论)
    if (project.open_issues_count > 0 && project.open_issues_count < 100) {
      score += 15; // 有讨论但不过多
    } else if (project.open_issues_count >= 100) {
      score += 5; // 太多未解决issue扣分
    }
    
    // Release频率
    if (metrics.release_frequency !== undefined) {
      score += Math.min(metrics.release_frequency * 10, 10);
    }
    
    return Math.min(score, 100);
  }
  
  static async calculateDetailedMetrics(project: GitHubProject): Promise<ProjectMetrics> {
    const [owner, repo] = project.full_name.split('/');
    
    try {
      // 获取详细数据
      const [contributors, commits, releases, issues] = await Promise.all([
        GitHubAPI.getContributors(owner, repo).catch(() => []),
        GitHubAPI.getCommits(owner, repo, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).catch(() => []),
        GitHubAPI.getReleases(owner, repo).catch(() => []),
        GitHubAPI.getIssues(owner, repo, 'closed').catch(() => [])
      ]);
      
      // 计算指标
      const contributors_count = contributors.length;
      const commit_frequency = commits.length; // 30天内的commit数
      const release_frequency = releases.filter((r: unknown) => 
        new Date((r as { published_at: string }).published_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      ).length; // 一年内的release数
      
      // Issue关闭率 (简化计算)
      const closedIssues = issues.filter((i: unknown) => (i as { state: string }).state === 'closed').length;
      const totalIssues = Math.max(project.open_issues_count + closedIssues, 1);
      const issue_close_rate = closedIssues / totalIssues;
      
      const metrics: ProjectMetrics = {
        project,
        stars_growth_7d: 0, // 需要历史数据，暂时设为0
        stars_growth_30d: 0, // 需要历史数据，暂时设为0
        fork_star_ratio: project.forks_count / Math.max(project.stargazers_count, 1),
        commit_frequency,
        contributors_count,
        release_frequency,
        issue_close_rate,
        value_score: 0, // 将在下面计算
        last_updated: new Date().toISOString()
      };
      
      // 计算价值评分
      metrics.value_score = this.calculateValueScore(project, metrics);
      
      return metrics;
      
    } catch (error) {
      console.error(`Error calculating metrics for ${project.full_name}:`, error);
      
      // 返回基础指标
      const basicMetrics: ProjectMetrics = {
        project,
        stars_growth_7d: 0,
        stars_growth_30d: 0,
        fork_star_ratio: project.forks_count / Math.max(project.stargazers_count, 1),
        commit_frequency: 0,
        contributors_count: 0,
        release_frequency: 0,
        issue_close_rate: 0,
        value_score: this.calculateValueScore(project, {}),
        last_updated: new Date().toISOString()
      };
      
      return basicMetrics;
    }
  }
}