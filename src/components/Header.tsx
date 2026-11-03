import React from 'react';
import { ShieldCheck, History, Moon, Sun, Languages } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenHistory: () => void;
  onOpenTests: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isDark,
  onToggleDark,
  onOpenHistory,
  onOpenTests,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
            ₹
          </span>
          <span>{lang === 'hi' ? 'बिज़कैल्क प्रो' : 'BizCalc Pro'}</span>
        </a>

        {/* Zone 2: Navigation Links / Controls */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0"
          >
            <History className="w-4 h-4" />
            <span>{lang === 'hi' ? 'इतिहास' : 'History'}</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold">{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleDark}
            className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0"
            title="Toggle Light / Dark mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? (lang === 'hi' ? 'लाइट' : 'Light') : (lang === 'hi' ? 'डार्क' : 'Dark')}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile quick language toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="md:hidden px-2.5 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg whitespace-nowrap shrink-0"
          >
            {lang === 'hi' ? 'EN' : 'हिंदी'}
          </button>

          {/* Theme toggle for mobile */}
          <button
            type="button"
            onClick={onToggleDark}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Verified Formulas Button */}
          <button
            type="button"
            onClick={onOpenTests}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? 'सूत्र सत्यापन' : 'Verify Formulas'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
