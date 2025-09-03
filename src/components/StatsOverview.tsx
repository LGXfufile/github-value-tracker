import { ProjectMetrics } from '@/types/github';
import { TrendingUpIcon, StarIcon, GitForkIcon, ActivityIcon } from 'lucide-react';

interface StatsOverviewProps {
  projects: ProjectMetrics[];
}

export function StatsOverview({ projects }: StatsOverviewProps) {
  const totalStars = projects.reduce((sum, p) => sum + p.project.stargazers_count, 0);
  const totalForks = projects.reduce((sum, p) => sum + p.project.forks_count, 0);
  const avgValueScore = projects.length > 0 ? projects.reduce((sum, p) => sum + p.value_score, 0) / projects.length : 0;
  const highValueProjects = projects.filter(p => p.value_score >= 65).length;

  const stats = [
    {
      label: '监控项目',
      value: projects.length.toString(),
      icon: ActivityIcon,
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    },
    {
      label: '总Star数',
      value: totalStars.toLocaleString(),
      icon: StarIcon,
      color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    },
    {
      label: '总Fork数',
      value: totalForks.toLocaleString(),
      icon: GitForkIcon,
      color: 'text-green-400 bg-green-400/10 border-green-400/20'
    },
    {
      label: '高价值项目',
      value: `${highValueProjects}/${projects.length}`,
      icon: TrendingUpIcon,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl border ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          
          {stat.label === '高价值项目' && projects.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">平均评分</span>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-300 font-medium">{avgValueScore.toFixed(0)}分</span>
                  <div className="relative group">
                    <div className="w-3 h-3 rounded-full bg-slate-600 flex items-center justify-center cursor-help">
                      <span className="text-xs text-slate-400">?</span>
                    </div>
                    <div className="absolute right-0 top-4 w-56 p-3 bg-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-xs text-slate-200">
                      <div className="font-medium mb-2">评分维度:</div>
                      <div className="space-y-1">
                        <div>增长潜力 30%</div>
                        <div>技术成熟度 25%</div>
                        <div>商业化可能 25%</div>
                        <div>社区活跃度 20%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(avgValueScore, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}