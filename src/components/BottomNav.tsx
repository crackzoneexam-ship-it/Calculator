import React from 'react';
import { LayoutGrid, Star, Calculator, History, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

export type MobileTab = 'all' | 'favourites' | 'basic' | 'history' | 'tests';

interface BottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  lang: Language;
  historyCount: number;
  favouritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang,
  historyCount,
  favouritesCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* All Calculators */}
        <button
          type="button"
          onClick={() => onSelectTab('all')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'all'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-1 truncate">
            {lang === 'hi' ? 'सभी' : 'All'}
          </span>
        </button>

        {/* Favourites */}
        <button
          type="button"
          onClick={() => onSelectTab('favourites')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'favourites'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Star className={`w-5 h-5 ${activeTab === 'favourites' ? 'fill-current' : ''}`} />
          <span className="text-[10px] mt-1 truncate">
            {lang === 'hi' ? 'पसंदीदा' : 'Saved'}
          </span>
          {favouritesCount > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {favouritesCount}
            </span>
          )}
        </button>

        {/* Basic Calc Fast Access */}
        <button
          type="button"
          onClick={() => onSelectTab('basic')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'basic'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'basic'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
          </div>
        </button>

        {/* History */}
        <button
          type="button"
          onClick={() => onSelectTab('history')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'history'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] mt-1 truncate">
            {lang === 'hi' ? 'इतिहास' : 'History'}
          </span>
          {historyCount > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 bg-teal-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Tests / Formulas */}
        <button
          type="button"
          onClick={() => onSelectTab('tests')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'tests'
              ? 'text-teal-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-1 truncate">
            {lang === 'hi' ? 'सत्यापन' : 'Tests'}
          </span>
        </button>
      </div>
    </div>
  );
};
