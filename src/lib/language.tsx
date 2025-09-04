// Language context and provider
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Header
    'app.title': 'GitHub Value Tracker',
    'app.tagline': 'Discover unicorn projects before they go mainstream',
    'header.refresh': 'Refresh Data',
    'header.lastUpdate': 'Last Update: {time}',
    'header.advancedSearch': 'Advanced Search',

    // Advanced Search
    'search.placeholder': 'Search projects by name, description, or topic...',
    'search.searching': 'Searching...',
    'search.search': 'Search',
    'search.language': 'Programming Language',
    'search.minStars': 'Minimum Stars',
    'search.topics': 'Topics',
    'search.sortBy': 'Sort By',
    'search.sortByValue': 'Value Score',
    'search.sortByStars': 'Stars',
    'search.sortByGrowth': 'Growth',
    'search.sortByRecent': 'Recently Updated',
    'search.clear': 'Clear Filters',
    'search.hint': 'Search across 100k+ repositories',
    'search.results': 'Search Results ({count})',
    'search.noResults': 'No projects found matching your criteria',

    // Stats Overview
    'stats.monitoredProjects': 'Monitored Projects',
    'stats.totalStars': 'Total Stars',
    'stats.totalForks': 'Total Forks', 
    'stats.highValueProjects': 'High Value Projects',
    'stats.newDiscoveries': 'New Discoveries',
    'stats.averageScore': 'Average Score',
    'stats.discovering': 'Discovering new projects...',

    // Filter Panel
    'filter.title': 'Filter & Sort',
    'filter.searchPlaceholder': 'Search projects...',
    'filter.search': 'Search',
    'filter.category.all': 'All Projects',
    'filter.category.highValue': 'High Value (≥65 pts)',
    'filter.category.growing': 'Growing (≥50k stars)',
    'filter.category.new': 'New Projects',
    'filter.sort.valueDesc': 'Value Score (High to Low)',
    'filter.sort.valueAsc': 'Value Score (Low to High)',
    'filter.sort.starsDesc': 'Stars (High to Low)',
    'filter.sort.recentUpdate': 'Recently Updated',

    // Project List
    'projects.title': 'Monitored Projects ({count})',
    'projects.noResults': 'No projects found matching your criteria.',
    'projects.loading': 'Loading projects...',

    // Project Card
    'project.openProject': 'Open Project',
    'project.forkStarRatio': 'Fork/Star Ratio',
    'project.commitFreq30d': '30-Day Commits',
    'project.issueCloseRate': 'Issue Close Rate',
    'project.lastUpdate': 'Updated {time} ago',
    'project.languages': 'Languages',

    // AI Analysis
    'analysis.title': 'AI Analysis',
    'analysis.marketProblem': 'Market Problem & Solution Fit',
    'analysis.userCatalyst': 'User Acquisition Catalyst', 
    'analysis.developerRetention': 'Developer Retention Strategy',
    'analysis.revenueGeneration': 'Revenue Generation Potential',
    'analysis.competitiveMoat': 'Competitive Moat Strength',
    'analysis.globalReadiness': 'Global Market Readiness',
    'analysis.enterpriseScore': 'Enterprise Adoption Score',
    'analysis.riskAssessment': 'Investment Risk Assessment',

    // Monetization
    'monetization.difficulty.low': 'Low Difficulty',
    'monetization.difficulty.medium': 'Medium Difficulty', 
    'monetization.difficulty.high': 'High Difficulty',
    'monetization.challenges': 'Challenges & Pathways',

    // Discovery Panel  
    'discovery.title': 'New Discoveries',
    'discovery.empty': 'No new discoveries yet.',
    'discovery.loading': 'Discovering...',

    // Value Score Tooltips
    'tooltip.growthPotential': 'Growth Potential (30%): Star growth rate and community expansion',
    'tooltip.technicalMaturity': 'Technical Maturity (25%): Code quality, documentation, and stability',
    'tooltip.commercialization': 'Commercialization (25%): Business model potential and market fit',
    'tooltip.communityActivity': 'Community Activity (20%): Developer engagement and contribution quality'
  },
  zh: {
    // Header
    'app.title': 'GitHub价值追踪器',
    'app.tagline': '在独角兽项目成为主流之前发现它们',
    'header.refresh': '刷新数据',
    'header.lastUpdate': '更新于: {time}',
    'header.advancedSearch': '高级搜索',

    // Advanced Search
    'search.placeholder': '搜索项目名称、描述或话题...',
    'search.searching': '搜索中...',
    'search.search': '搜索',
    'search.language': '编程语言',
    'search.minStars': '最少星标数',
    'search.topics': '话题标签',
    'search.sortBy': '排序方式',
    'search.sortByValue': '价值评分',
    'search.sortByStars': '星标数量',
    'search.sortByGrowth': '增长速度',
    'search.sortByRecent': '最近更新',
    'search.clear': '清除筛选',
    'search.hint': '搜索10万+开源项目',
    'search.results': '搜索结果 ({count})',
    'search.noResults': '未找到符合条件的项目',

    // Stats Overview
    'stats.monitoredProjects': '监控项目',
    'stats.totalStars': '总Star数',
    'stats.totalForks': '总Fork数',
    'stats.highValueProjects': '高价值项目', 
    'stats.newDiscoveries': '新发现',
    'stats.averageScore': '平均评分',
    'stats.discovering': '正在发现新项目...',

    // Filter Panel
    'filter.title': '筛选和排序',
    'filter.searchPlaceholder': '搜索项目...',
    'filter.search': '搜索',
    'filter.category.all': '所有项目',
    'filter.category.highValue': '高价值 (≥65分)',
    'filter.category.growing': '增长中 (≥5万星)',
    'filter.category.new': '新项目',
    'filter.sort.valueDesc': '价值评分 (高到低)',
    'filter.sort.valueAsc': '价值评分 (低到高)', 
    'filter.sort.starsDesc': 'Star数 (高到低)',
    'filter.sort.recentUpdate': '最近更新',

    // Project List
    'projects.title': '监控项目 ({count})',
    'projects.noResults': '未找到符合条件的项目。',
    'projects.loading': '加载项目中...',

    // Project Card
    'project.openProject': '打开项目',
    'project.forkStarRatio': 'Fork/Star比例',
    'project.commitFreq30d': '30天提交',
    'project.issueCloseRate': 'Issue解决率',
    'project.lastUpdate': '{time}前更新',
    'project.languages': '编程语言',

    // AI Analysis
    'analysis.title': '智能分析',
    'analysis.marketProblem': '市场问题解决匹配度',
    'analysis.userCatalyst': '用户获取催化剂',
    'analysis.developerRetention': '开发者留存策略', 
    'analysis.revenueGeneration': '收入变现潜力',
    'analysis.competitiveMoat': '竞争护城河强度',
    'analysis.globalReadiness': '全球市场就绪度',
    'analysis.enterpriseScore': '企业采用评分',
    'analysis.riskAssessment': '投资风险评估',

    // Monetization
    'monetization.difficulty.low': '低难度',
    'monetization.difficulty.medium': '中等难度',
    'monetization.difficulty.high': '高难度', 
    'monetization.challenges': '挑战与路径',

    // Discovery Panel
    'discovery.title': '新发现',
    'discovery.empty': '暂无新发现。',
    'discovery.loading': '发现中...',

    // Value Score Tooltips
    'tooltip.growthPotential': '增长潜力 (30%): Star增长率和社区扩张',
    'tooltip.technicalMaturity': '技术成熟度 (25%): 代码质量、文档和稳定性',
    'tooltip.commercialization': '商业化可能 (25%): 商业模式潜力和市场匹配度',
    'tooltip.communityActivity': '社区活跃度 (20%): 开发者参与和贡献质量'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Auto-detect browser language
    const browserLang = navigator.language;
    const detectedLang = browserLang.startsWith('zh') ? 'zh' : 'en';
    setLanguage(detectedLang);
  }, []);

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language] as Record<string, string>;
    let text = translation[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}