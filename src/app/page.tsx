'use client';

import { useState, useEffect } from 'react';
import { ProjectMetrics, Discovery } from '@/types/github';
import { ProjectCard } from '@/components/ProjectCard';
import { StatsOverview } from '@/components/StatsOverview';
import { FilterPanel } from '@/components/FilterPanel';
import { DiscoveryPanel } from '@/components/DiscoveryPanel';
import { TrendingUpIcon, GitBranchIcon } from 'lucide-react';

interface DashboardData {
  projects: ProjectMetrics[];
  discoveries?: Discovery[];
  trending?: unknown[];
  total: number;
  last_updated: string;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value_score');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProjects = data?.projects?.filter(project => {
    const matchesSearch = project.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'high_value') return project.value_score >= 80 && matchesSearch;
    if (filter === 'growing') return project.stars_growth_30d > 0 && matchesSearch;
    if (filter === 'active') return project.commit_frequency > 10 && matchesSearch;
    
    return matchesSearch;
  }) || [];

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
            <p className="text-slate-400 text-lg">加载项目数据中...</p>
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
              <h1 className="text-xl font-bold text-white">GitHub Value Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                刷新数据
              </button>
              <div className="text-sm text-slate-400">
                更新于: {new Date(data?.last_updated || '').toLocaleString()}
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
            
            {/* 筛选面板 */}
            <FilterPanel 
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            
            {/* 项目列表 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  监控项目 ({sortedProjects.length})
                </h2>
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
                  <p className="text-slate-400 text-lg">暂无符合条件的项目</p>
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
