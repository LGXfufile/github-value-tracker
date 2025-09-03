'use client';

import { useState } from 'react';
import { SearchIcon, FilterIcon, TrendingUpIcon, XIcon } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface AdvancedSearchProps {
  onSearch: (results: any[]) => void;
  onClear: () => void;
}

export function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 搜索状态
  const [searchForm, setSearchForm] = useState({
    query: '',
    language: '',
    minStars: '',
    topics: '',
    sortBy: 'value_score'
  });

  const popularLanguages = [
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 
    'Java', 'C++', 'Swift', 'Kotlin', 'PHP'
  ];

  const popularTopics = [
    'ai', 'automation', 'saas', 'productivity', 'developer-tools',
    'framework', 'library', 'api', 'database', 'security'
  ];

  const handleSearch = async () => {
    if (!searchForm.query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchForm.query,
        limit: '50'
      });
      
      if (searchForm.language) params.append('language', searchForm.language);
      if (searchForm.minStars) params.append('minStars', searchForm.minStars);
      if (searchForm.topics) params.append('topics', searchForm.topics);

      const response = await fetch(`/api/github?action=search&${params}`);
      const data = await response.json();

      if (response.ok) {
        onSearch(data.projects || []);
      } else {
        console.error('Search failed:', data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchForm({
      query: '',
      language: '',
      minStars: '',
      topics: '',
      sortBy: 'value_score'
    });
    onClear();
  };

  const handleTopicClick = (topic: string) => {
    const currentTopics = searchForm.topics.split(',').filter(Boolean);
    if (currentTopics.includes(topic)) {
      setSearchForm({
        ...searchForm,
        topics: currentTopics.filter(t => t !== topic).join(',')
      });
    } else {
      setSearchForm({
        ...searchForm,
        topics: [...currentTopics, topic].join(',')
      });
    }
  };

  const selectedTopics = searchForm.topics.split(',').filter(Boolean);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-4">
      {/* 基础搜索 */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchForm.query}
            onChange={(e) => setSearchForm({ ...searchForm, query: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg transition-colors"
        >
          <FilterIcon className="w-5 h-5 text-slate-300" />
        </button>
        
        <button
          onClick={handleSearch}
          disabled={loading || !searchForm.query.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <SearchIcon className="w-4 h-4" />
          )}
          <span>{loading ? t('search.searching') : t('search.search')}</span>
        </button>
      </div>

      {/* 高级筛选 */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-700/50">
          {/* 编程语言 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">{t('search.language')}</label>
            <div className="flex flex-wrap gap-2">
              {popularLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSearchForm({
                    ...searchForm,
                    language: searchForm.language === lang ? '' : lang
                  })}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    searchForm.language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* 最小星标数 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">{t('search.minStars')}</label>
              <input
                type="number"
                value={searchForm.minStars}
                onChange={(e) => setSearchForm({ ...searchForm, minStars: e.target.value })}
                placeholder="100"
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">{t('search.sortBy')}</label>
              <select
                value={searchForm.sortBy}
                onChange={(e) => setSearchForm({ ...searchForm, sortBy: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="value_score">{t('search.sortByValue')}</option>
                <option value="stars">{t('search.sortByStars')}</option>
                <option value="growth">{t('search.sortByGrowth')}</option>
                <option value="recent">{t('search.sortByRecent')}</option>
              </select>
            </div>
          </div>

          {/* 热门话题 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">{t('search.topics')}</label>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    selectedTopics.includes(topic)
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {topic}
                  {selectedTopics.includes(topic) && (
                    <XIcon className="w-3 h-3 ml-1 inline" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
            >
              {t('search.clear')}
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <TrendingUpIcon className="w-4 h-4" />
              <span>{t('search.hint')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}