import { SearchIcon, FilterIcon } from 'lucide-react';

interface FilterPanelProps {
  filter: string;
  setFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export function FilterPanel({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  searchTerm, 
  setSearchTerm 
}: FilterPanelProps) {
  const filterOptions = [
    { value: 'all', label: '所有项目' },
    { value: 'high_value', label: '高价值 (≥80分)' },
    { value: 'growing', label: '快速增长' },
    { value: 'active', label: '活跃项目' }
  ];

  const sortOptions = [
    { value: 'value_score', label: '价值评分' },
    { value: 'stars', label: 'Star数量' },
    { value: 'growth', label: '增长速度' },
    { value: 'recent', label: '最近更新' }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center space-x-2 mb-4">
        <FilterIcon className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-white">筛选和排序</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 搜索 */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
    </div>
  );
}