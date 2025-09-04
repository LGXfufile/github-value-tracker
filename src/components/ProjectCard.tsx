import { ProjectMetrics } from '@/types/github';
import { StarIcon, GitForkIcon, EyeIcon, GitCommitIcon, ExternalLinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useLanguage } from '@/lib/language';
import { HighlightText } from './HighlightText';

interface ProjectCardProps {
  metrics: ProjectMetrics;
  searchTerm?: string;
}

export function ProjectCard({ metrics, searchTerm = '' }: ProjectCardProps) {
  const { language, t } = useLanguage();
  const { project } = metrics;
  
  const getValueScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (score >= 40) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      'TypeScript': 'bg-blue-500',
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-green-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-500',
      'Java': 'bg-red-500',
      'C#': 'bg-purple-500',
    };
    return colors[language || ''] || 'bg-gray-500';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-white truncate">
              <HighlightText 
                text={project.name} 
                searchTerm={searchTerm}
              />
            </h3>
            <a 
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-slate-400 mb-1">
            <HighlightText 
              text={project.full_name} 
              searchTerm={searchTerm}
            />
          </p>
          {project.description && (
            <p className="text-slate-300 text-sm line-clamp-2">
              <HighlightText 
                text={project.description} 
                searchTerm={searchTerm}
              />
            </p>
          )}
        </div>
        
        {/* Value Score */}
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getValueScoreColor(metrics.value_score)}`}>
            {metrics.value_score}分
          </div>
          <div className="relative group">
            <div className="w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center cursor-help">
              <span className="text-xs text-slate-300">?</span>
            </div>
            <div className="absolute right-0 top-6 w-64 p-3 bg-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-xs text-slate-200">
              <div className="font-medium mb-2">价值评分算法:</div>
              <div className="space-y-1">
                <div>• 增长潜力 (30%): Star增长率、Fork比例</div>
                <div>• 技术成熟度 (25%): 文档完整性、更新频率</div>
                <div>• 商业化可能 (25%): 商业关键词匹配</div>
                <div>• 社区活跃度 (20%): 贡献者、Issue处理</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-slate-300 font-medium">{project.stargazers_count.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <GitForkIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">{project.forks_count.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <EyeIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">{project.watchers_count.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <GitCommitIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">{metrics.contributors_count}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Fork/Star比例</div>
          <div className="text-sm font-medium text-slate-300">
            {(metrics.fork_star_ratio * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">30天提交</div>
          <div className="text-sm font-medium text-slate-300">
            {metrics.commit_frequency}次
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Issue解决率</div>
          <div className="text-sm font-medium text-slate-300">
            {(metrics.issue_close_rate * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3">
          {project.language && (
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
              <span className="text-slate-400">{project.language}</span>
            </div>
          )}
          
          {project.license && (
            <span className="text-slate-500">{project.license.name}</span>
          )}
        </div>
        
        <div className="text-slate-500">
          更新于 {formatDistanceToNow(new Date(project.pushed_at), { 
            addSuffix: true, 
            locale: zhCN 
          })}
        </div>
      </div>

      {/* Topics */}
      {project.topics && project.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {project.topics.slice(0, 5).map((topic) => (
            <span 
              key={topic}
              className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20"
            >
              <HighlightText 
                text={topic} 
                searchTerm={searchTerm}
              />
            </span>
          ))}
          {project.topics.length > 5 && (
            <span className="px-2 py-1 text-xs text-slate-500">
              +{project.topics.length - 5}
            </span>
          )}
        </div>
      )}

      {/* AI Analysis */}
      {metrics.ai_analysis && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
            <h4 className="text-sm font-semibold text-purple-300">{t('analysis.title')}</h4>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-blue-400 font-medium">🎯 {t('analysis.marketProblem')}：</span>
              <span className="text-slate-300 ml-1">{metrics.ai_analysis.marketProblem[language]}</span>
            </div>
            
            <div>
              <span className="text-green-400 font-medium">⭐ {t('analysis.userCatalyst')}：</span>
              <span className="text-slate-300 ml-1">{metrics.ai_analysis.userCatalyst[language]}</span>
            </div>
            
            <div>
              <span className="text-yellow-400 font-medium">🔄 {t('analysis.developerRetention')}：</span>
              <span className="text-slate-300 ml-1">{metrics.ai_analysis.developerRetention[language]}</span>
            </div>
            
            <div>
              <span className="text-orange-400 font-medium">💰 {t('analysis.revenueGeneration')}：</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                metrics.ai_analysis.revenueGeneration.level === 'low' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : metrics.ai_analysis.revenueGeneration.level === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {t(`monetization.difficulty.${metrics.ai_analysis.revenueGeneration.level}`)}
              </span>
              <div className="mt-2 text-xs text-slate-400">
                <div className="font-medium mb-1">{t('monetization.challenges')}:</div>
                <div>{metrics.ai_analysis.revenueGeneration.challenges[language]}</div>
                {metrics.ai_analysis.revenueGeneration.pathways[language].length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium mb-1">Revenue Pathways:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {metrics.ai_analysis.revenueGeneration.pathways[language].map((pathway, idx) => (
                        <li key={idx} className="text-slate-400">{pathway}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {metrics.ai_analysis.competitiveMoat && (
              <div>
                <span className="text-purple-400 font-medium">🛡️ {t('analysis.competitiveMoat')}：</span>
                <span className="text-slate-300 ml-1">{metrics.ai_analysis.competitiveMoat[language]}</span>
              </div>
            )}
            
            {metrics.ai_analysis.globalReadiness && (
              <div>
                <span className="text-cyan-400 font-medium">🌍 {t('analysis.globalReadiness')}：</span>
                <span className="text-slate-300 ml-1">{metrics.ai_analysis.globalReadiness[language]}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}