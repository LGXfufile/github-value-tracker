export interface GitHubProject {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  topics: string[];
  license: {
    key: string;
    name: string;
  } | null;
}

export interface ProjectAnalysis {
  marketProblem: {
    en: string;
    zh: string;
  };
  userCatalyst: {
    en: string; 
    zh: string;
  };
  developerRetention: {
    en: string;
    zh: string;
  };
  revenueGeneration: {
    level: 'low' | 'medium' | 'high';
    pathways: {
      en: string[];
      zh: string[];
    };
    challenges: {
      en: string;
      zh: string;
    };
  };
  competitiveMoat?: {
    en: string;
    zh: string;
  };
  globalReadiness?: {
    en: string;
    zh: string;
  };
  enterpriseScore?: {
    en: string;
    zh: string;
  };
  riskAssessment?: {
    en: string;
    zh: string;
  };
}

export interface ProjectMetrics {
  project: GitHubProject;
  stars_growth_7d: number;
  stars_growth_30d: number;
  fork_star_ratio: number;
  commit_frequency: number;
  contributors_count: number;
  release_frequency: number;
  issue_close_rate: number;
  value_score: number;
  last_updated: string;
  ai_analysis?: ProjectAnalysis;
}

export interface TrendingProject {
  repo: GitHubProject;
  reason: 'trending' | 'keyword_match' | 'related_discovery';
  discovered_at: string;
}

export interface Discovery {
  project: ProjectMetrics;
  reason: string;
  discovered_at: string;
}