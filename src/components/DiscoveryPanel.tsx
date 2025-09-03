import { SparklesIcon, ExternalLinkIcon, StarIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Discovery } from '@/types/github';

interface DiscoveryPanelProps {
  discoveries: Discovery[];
}

export function DiscoveryPanel({ discoveries }: DiscoveryPanelProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 sticky top-24">
      <div className="flex items-center space-x-2 mb-4">
        <SparklesIcon className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">新发现</h3>
      </div>

      {discoveries.length > 0 ? (
        <div className="space-y-4">
          {discoveries.slice(0, 8).map((discovery, index) => (
            <div 
              key={discovery.project?.project?.id || index}
              className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white truncate flex-1">
                  {discovery.project?.project?.name || '未知项目'}
                </h4>
                <a 
                  href={discovery.project?.project?.html_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-300 transition-colors ml-2"
                >
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {discovery.project?.project?.description || '暂无描述'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-slate-300">
                      {discovery.project?.project?.stargazers_count?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="px-2 py-1 text-xs bg-yellow-400/10 text-yellow-400 rounded border border-yellow-400/20">
                    {discovery.project?.value_score || 0}分
                  </div>
                </div>
                
                <div className="text-xs text-slate-500">
                  {discovery.discovered_at ? 
                    formatDistanceToNow(new Date(discovery.discovered_at), { 
                      addSuffix: true, 
                      locale: zhCN 
                    }) : '刚刚'
                  }
                </div>
              </div>
            </div>
          ))}
          
          {discoveries.length === 0 && (
            <div className="text-center py-8">
              <SparklesIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">暂时没有新发现</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <SparklesIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">正在寻找新项目...</p>
        </div>
      )}

      {discoveries.length > 8 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            查看更多 ({discoveries.length - 8})
          </button>
        </div>
      )}
    </div>
  );
}