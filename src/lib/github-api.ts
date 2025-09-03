import { GitHubProject, ProjectMetrics } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  'Authorization': `Bearer ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

export class GitHubAPI {
  
  static async getRepository(owner: string, repo: string): Promise<GitHubProject> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async searchRepositories(query: string, sort: string = 'stars', per_page: number = 30): Promise<GitHubProject[]> {
    const params = new URLSearchParams({
      q: query,
      sort,
      order: 'desc',
      per_page: per_page.toString()
    });
    
    const response = await fetch(`${GITHUB_API_BASE}/search/repositories?${params}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items;
  }

  static async getContributors(owner: string, repo: string): Promise<any[]> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=100`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch contributors: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getCommits(owner: string, repo: string, since?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (since) params.append('since', since);
    params.append('per_page', '100');
    
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?${params}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch commits: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getReleases(owner: string, repo: string): Promise<any[]> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=10`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch releases: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getIssues(owner: string, repo: string, state: 'open' | 'closed' = 'all'): Promise<any[]> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=100`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch issues: ${response.statusText}`);
    }
    
    return response.json();
  }

  // 获取趋势项目
  static async getTrendingRepositories(): Promise<GitHubProject[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateStr = oneWeekAgo.toISOString().split('T')[0];
    
    const queries = [
      `created:>${dateStr} stars:>10`,
      `pushed:>${dateStr} stars:>50`,
      'SaaS OR B2B OR enterprise language:typescript stars:>100',
      'revenue OR monetization OR commercial stars:>50'
    ];
    
    const allProjects: GitHubProject[] = [];
    
    for (const query of queries) {
      try {
        const projects = await this.searchRepositories(query, 'stars', 20);
        allProjects.push(...projects);
      } catch (error) {
        console.error(`Failed to search with query "${query}":`, error);
      }
    }
    
    // 去重
    const uniqueProjects = allProjects.filter((project, index, self) => 
      index === self.findIndex(p => p.id === project.id)
    );
    
    return uniqueProjects;
  }
}