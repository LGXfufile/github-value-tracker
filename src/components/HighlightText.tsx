interface HighlightTextProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export function HighlightText({ text, searchTerm, className = '' }: HighlightTextProps) {
  if (!text || !searchTerm) {
    return <span className={className}>{text}</span>;
  }

  // 创建正则表达式，忽略大小写，全局匹配
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // 检查这一部分是否匹配搜索词（忽略大小写）
        const isMatch = regex.test(part);
        // 重置regex的lastIndex，因为test()会修改它
        regex.lastIndex = 0;
        
        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-yellow-400/30 text-yellow-200 px-1 rounded font-medium"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
}

// 专门用于高亮多个搜索关键词的组件
interface MultiHighlightTextProps {
  text: string;
  searchTerms: string[];
  className?: string;
}

export function MultiHighlightText({ text, searchTerms, className = '' }: MultiHighlightTextProps) {
  if (!text || !searchTerms || searchTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // 过滤掉空字符串并转义特殊字符
  const validTerms = searchTerms
    .filter(term => term.trim())
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (validTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // 创建联合正则表达式
  const regex = new RegExp(`(${validTerms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // 检查这一部分是否匹配任何搜索词
        const isMatch = validTerms.some(term => 
          new RegExp(`^${term}$`, 'i').test(part)
        );
        
        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-yellow-400/30 text-yellow-200 px-1 rounded font-medium"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
}