import { SparklesIcon, ExternalLinkIcon, StarIcon, RefreshCwIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Discovery } from '@/types/github';
import { useState } from 'react';

interface DiscoveryPanelProps {
  discoveries: Discovery[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function DiscoveryPanel({ discoveries, loading, error, onRefresh }: DiscoveryPanelProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">新发现</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-slate-400 hover:text-slate-300 transition-colors"
            title="了解新发现功能"
          >
            <InfoIcon className="w-4 h-4" />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
              title="刷新发现"
            >
              <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 帮助说明 */}
      {showHelp && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
          <p className="mb-2">🔍 <strong>新发现功能说明：</strong></p>
          <ul className="space-y-1 text-xs">
            <li>• 自动扫描 GitHub 趋势项目</li>
            <li>• 筛选价值评分 &gt; 60分 的高潜力项目</li>
            <li>• 基于多维度算法评估商业价值</li>
            <li>• 每次刷新获取最新趋势数据</li>
          </ul>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <RefreshCwIcon className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-spin" />
          <p className="text-slate-400 text-sm">正在发现新项目...</p>
          <p className="text-xs text-slate-500 mt-1">分析GitHub趋势项目中</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <AlertCircleIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm mb-2">发现功能暂时不可用</p>
          <p className="text-xs text-slate-500 mb-3">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              重试
            </button>
          )}
        </div>
      ) : discoveries.length > 0 ? (
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
          
          {discoveries.length > 8 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                查看更多 ({discoveries.length - 8})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <SparklesIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm mb-1">暂时没有新发现</p>
          <p className="text-xs text-slate-600 mb-3">
            没有找到符合条件的高价值项目
          </p>
          {onRefresh && (
            <button
              onClick={() => {
                console.log('刷新按钮被点击');
                onRefresh();
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              点击刷新重新扫描
            </button>
          )}
        </div>
      )}
    </div>
  );
}