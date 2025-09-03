'use client';

import { useLanguage } from '@/lib/language';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-gray-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
        className="bg-transparent text-sm text-gray-300 border border-gray-600/30 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400/50 transition-colors hover:border-gray-500/50"
      >
        <option value="en" className="bg-gray-900 text-white">English</option>
        <option value="zh" className="bg-gray-900 text-white">中文</option>
      </select>
    </div>
  );
}