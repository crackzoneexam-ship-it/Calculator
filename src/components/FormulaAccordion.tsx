import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '../types';

interface FormulaAccordionProps {
  lang: Language;
  titleEn: string;
  titleHi: string;
  formulaEn: string[];
  formulaHi: string[];
  notesEn?: string[];
  notesHi?: string[];
}

export const FormulaAccordion: React.FC<FormulaAccordionProps> = ({
  lang,
  titleEn,
  titleHi,
  formulaEn,
  formulaHi,
  notesEn,
  notesHi,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const title = lang === 'hi' ? titleHi : titleEn;
  const formulas = lang === 'hi' ? formulaHi : formulaEn;
  const notes = lang === 'hi' ? notesHi : notesEn;

  return (
    <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>{title}</span>
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 space-y-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="space-y-1 font-mono text-[11px] bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            {formulas.map((f, i) => (
              <div key={i} className="text-teal-700 dark:text-teal-300">
                • {f}
              </div>
            ))}
          </div>
          {notes && notes.length > 0 && (
            <div className="space-y-1 pt-1">
              {notes.map((note, i) => (
                <p key={i} className="text-[11px] leading-relaxed">
                  ⓘ {note}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
