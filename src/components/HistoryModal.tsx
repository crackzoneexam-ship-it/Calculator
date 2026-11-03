import React from 'react';
import { X, Trash2, Copy, History, ArrowUpRight } from 'lucide-react';
import { CalculationHistoryItem, CalculatorCategory, Language } from '../types';
import { copyToClipboard } from '../utils/formatters';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
  onSelectCalculator: (id: CalculatorCategory) => void;
  lang: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectCalculator,
  lang,
}) => {
  if (!isOpen) return null;

  const handleCopyItem = async (item: CalculationHistoryItem) => {
    const text = `*BizCalc Pro - ${item.title}*\n${item.inputsSummary}\n*Result:* ${item.resultSummary}\nDate: ${new Date(
      item.timestamp
    ).toLocaleString('en-IN')}`;
    await copyToClipboard(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {lang === 'hi' ? 'गणना इतिहास (Local History)' : 'Calculation History'}
            </h2>
            <span className="text-xs text-slate-400">({history.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title={lang === 'hi' ? 'इतिहास मिटाएं' : 'Clear all history'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मिटाएं' : 'Clear'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-2">
              <History className="w-10 h-10 mx-auto opacity-30 stroke-1" />
              <p className="text-sm">
                {lang === 'hi'
                  ? 'अभी कोई गणना इतिहास नहीं है। सभी गणनाएँ स्वतः सहेज ली जाती हैं।'
                  : 'No calculations saved yet. Calculations are saved automatically.'}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-2 hover:border-teal-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyItem(item)}
                      className="p-1.5 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                      title={lang === 'hi' ? 'कॉपी करें' : 'Copy snippet'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCalculator(item.calculatorId);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50"
                    >
                      <span>{lang === 'hi' ? 'खोलें' : 'Open'}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800/60 font-mono text-[11px] space-y-1">
                  <div className="text-slate-500 line-clamp-1">{item.inputsSummary}</div>
                  <div className="text-slate-900 dark:text-slate-100 font-bold">
                    → {item.resultSummary}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
          {lang === 'hi'
            ? 'डेटा केवल आपके डिवाइस में सुरक्षित रहता है (ऑफ़लाइन एवं निजी)'
            : 'History is stored offline securely in your device browser.'}
        </div>
      </div>
    </div>
  );
};
