'use client';

import { useState, useEffect } from 'react';
import { ProjectMetrics, Discovery } from '@/types/github';
import { ProjectCard } from '@/components/ProjectCard';
import { StatsOverview } from '@/components/StatsOverview';
import { FilterPanel } from '@/components/FilterPanel';
import { DiscoveryPanel } from '@/components/DiscoveryPanel';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/language';
import { TrendingUpIcon, GitBranchIcon, SearchIcon } from 'lucide-react';

interface DashboardData {
  projects: ProjectMetrics[];
  discoveries?: Discovery[];
  trending?: unknown[];
  total: number;
  last_updated: string;
}

export default function Home() {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value_score');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProjectMetrics[] | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, discoveriesRes] = await Promise.all([
        fetch('/api/github?action=projects'),
        fetch('/api/github?action=discover')
      ]);
      
      const projectsData = await projectsRes.json();
      const discoveriesData = await discoveriesRes.json();
      
      setData({
        projects: projectsData.projects || [],
        discoveries: discoveriesData.discoveries || [],
        total: projectsData.total || 0,
        last_updated: projectsData.last_updated || new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = searchResults || data?.projects?.filter(project => {
    if (!searchTerm) {
      // 如果没有搜索词，按筛选器过滤
      if (filter === 'high_value') return project.value_score >= 65;
      if (filter === 'growing') return project.project.stargazers_count >= 50000;
      if (filter === 'active') return project.commit_frequency > 10;
      return true;
    }

    // 更全面的搜索：项目名、描述、topics、所有者
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      project.project.name.toLowerCase().includes(searchLower) ||
      project.project.description?.toLowerCase().includes(searchLower) ||
      project.project.full_name.toLowerCase().includes(searchLower) ||
      project.project.topics?.some(topic => topic.toLowerCase().includes(searchLower)) ||
      // 搜索AI分析内容
      (project.ai_analysis && (
        project.ai_analysis.marketProblem?.en?.toLowerCase().includes(searchLower) ||
        project.ai_analysis.marketProblem?.zh?.toLowerCase().includes(searchLower) ||
        project.ai_analysis.userCatalyst?.en?.toLowerCase().includes(searchLower) ||
        project.ai_analysis.userCatalyst?.zh?.toLowerCase().includes(searchLower)
      ));
    
    if (!matchesSearch) return false;

    // 应用筛选器
    if (filter === 'high_value') return project.value_score >= 65;
    if (filter === 'growing') return project.project.stargazers_count >= 50000;
    if (filter === 'active') return project.commit_frequency > 10;
    
    return true;
  }) || [];

  const handleSearchResults = (results: ProjectMetrics[]) => {
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setShowAdvancedSearch(false);
  };

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'value_score') return b.value_score - a.value_score;
    if (sortBy === 'stars') return b.project.stargazers_count - a.project.stargazers_count;
    if (sortBy === 'growth') return b.stars_growth_30d - a.stars_growth_30d;
    if (sortBy === 'recent') return new Date(b.project.pushed_at).getTime() - new Date(a.project.pushed_at).getTime();
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">{t('projects.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUpIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t('app.title')}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">{t('app.tagline')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button 
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                  showAdvancedSearch
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                <SearchIcon className="w-4 h-4" />
                <span>{t('header.advancedSearch')}</span>
              </button>
              <button 
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                {t('header.refresh')}
              </button>
              <div className="text-sm text-slate-400">
                {t('header.lastUpdate').replace('{time}', new Date(data?.last_updated || '').toLocaleString())}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* 主内容区 */}
          <div className="xl:col-span-3 space-y-8">
            {/* 统计概览 */}
            <StatsOverview projects={data?.projects || []} />
            
            {/* 高级搜索 */}
            {showAdvancedSearch && (
              <AdvancedSearch 
                onSearch={handleSearchResults}
                onClear={handleClearSearch}
              />
            )}
            
            {/* 筛选面板 */}
            {!searchResults && (
              <FilterPanel 
                filter={filter}
                setFilter={setFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            
            {/* 项目列表 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {searchResults ? 
                    t('search.results').replace('{count}', sortedProjects.length.toString()) :
                    t('projects.title').replace('{count}', sortedProjects.length.toString())
                  }
                </h2>
                {searchResults && (
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-lg transition-colors"
                  >
                    {t('search.clear')}
                  </button>
                )}
              </div>
              
              {sortedProjects.length > 0 ? (
                <div className="grid gap-6">
                  {sortedProjects.map((metrics) => (
                    <ProjectCard key={metrics.project.id} metrics={metrics} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GitBranchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    {searchResults ? t('search.noResults') : t('projects.noResults')}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="xl:col-span-1">
            <DiscoveryPanel discoveries={data?.discoveries || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
