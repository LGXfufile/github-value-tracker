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
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
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
    setDiscoveryError(null);
    
    try {
      const [projectsRes, discoveriesRes] = await Promise.all([
        fetch('/api/github?action=projects'),
        fetch('/api/github?action=discover')
      ]);
      
      const projectsData = await projectsRes.json();
      const discoveriesData = await discoveriesRes.json();
      
      // 检查发现数据是否有错误
      if (!discoveriesRes.ok) {
        setDiscoveryError(discoveriesData.error || '获取发现数据失败');
      }
      
      setData({
        projects: projectsData.projects || [],
        discoveries: discoveriesData.discoveries || [],
        total: projectsData.total || 0,
        last_updated: projectsData.last_updated || new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDiscoveryError('网络连接失败');
      // 在错误情况下显示模拟数据
      setData({
        projects: [],
        discoveries: [],
        total: 0,
        last_updated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // 独立刷新发现数据
  const refreshDiscoveries = async () => {
    setDiscoveryLoading(true);
    setDiscoveryError(null);
    
    try {
      const response = await fetch('/api/github?action=discover');
      const discoveriesData = await response.json();
      
      if (!response.ok) {
        setDiscoveryError(discoveriesData.error || '获取发现数据失败');
        return;
      }
      
      // 更新发现数据
      setData(prev => prev ? {
        ...prev,
        discoveries: discoveriesData.discoveries || []
      } : null);
    } catch (error) {
      console.error('Failed to refresh discoveries:', error);
      setDiscoveryError('网络连接失败');
    } finally {
      setDiscoveryLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(`/api/github?action=search&q=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data.projects || []);
      } else {
        console.error('Search failed:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const filteredProjects = searchResults || data?.projects?.filter(project => {
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
            
            {/* 筛选面板 - 搜索状态时只显示搜索框 */}
            {searchResults ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center space-x-2 mb-4">
                  <SearchIcon className="w-5 h-5 text-slate-400" />
                  <h3 className="text-lg font-semibold text-white">{t('filter.title')}</h3>
                </div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('filter.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchTerm.trim()) {
                        handleSearch(searchTerm);
                      }
                    }}
                    className="w-full pl-10 pr-20 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearch(searchTerm)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      {t('filter.search')}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  按Enter或点击搜索按钮在GitHub海量项目中搜索
                </p>
              </div>
            ) : (
              <FilterPanel 
                filter={filter}
                setFilter={setFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
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
            <DiscoveryPanel 
              discoveries={data?.discoveries || []}
              loading={discoveryLoading}
              error={discoveryError}
              onRefresh={refreshDiscoveries}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
