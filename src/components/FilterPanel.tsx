import { useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface FilterPanelProps {
  filter: string;
  setFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onSearch?: (term: string) => void;
}

export function FilterPanel({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  searchTerm, 
  setSearchTerm,
  onSearch
}: FilterPanelProps) {
  const { t } = useLanguage();
  const [searchLoading, setSearchLoading] = useState(false);
  
  const filterOptions = [
    { value: 'all', label: t('filter.category.all') },
    { value: 'high_value', label: t('filter.category.highValue') },
    { value: 'growing', label: t('filter.category.growing') },
    { value: 'active', label: t('filter.category.new') }
  ];

  const sortOptions = [
    { value: 'value_score', label: t('filter.sort.valueDesc') },
    { value: 'stars', label: t('filter.sort.starsDesc') },
    { value: 'growth', label: t('filter.sort.valueAsc') },
    { value: 'recent', label: t('filter.sort.recentUpdate') }
  ];

  const handleSearch = async () => {
    if (!onSearch || !searchTerm.trim()) return;
    
    setSearchLoading(true);
    try {
      await onSearch(searchTerm);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center space-x-2 mb-4">
        <FilterIcon className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-white">{t('filter.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 搜索 */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('filter.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-20 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white text-sm rounded transition-colors"
            >
              {searchLoading ? '搜索中...' : '搜索'}
            </button>
          )}
        </div>

        {/* 筛选 */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-700">
              {option.label}
            </option>
          ))}
        </select>

        {/* 排序 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-700">
              按{option.label}排序
            </option>
          ))}
        </select>
      </div>
      
      {onSearch && (
        <p className="text-xs text-slate-400 mt-2">
          按Enter或点击搜索按钮在GitHub海量项目中搜索
        </p>
      )}
    </div>
  );
}