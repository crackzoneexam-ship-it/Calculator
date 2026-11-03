import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { copyToClipboard, numberToWordsIN } from '../utils/formatters';

export interface ResultItem {
  label: string;
  value: string;
  subtext?: string;
  isHighlight?: boolean;
  isPositive?: boolean;
  isNegative?: boolean;
}

interface ResultCardProps {
  lang: Language;
  title: string;
  primaryValue: string;
  primaryLabel: string;
  numericPrimaryValue?: number;
  items: ResultItem[];
  whatsappText: string;
  onReset: () => void;
  statusBadge?: string;
  statusType?: 'profit' | 'loss' | 'neutral';
}

export const ResultCard: React.FC<ResultCardProps> = ({
  lang,
  title,
  primaryValue,
  primaryLabel,
  numericPrimaryValue,
  items,
  whatsappText,
  onReset,
  statusBadge,
  statusType = 'neutral',
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(whatsappText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyWhatsApp = async () => {
    const success = await copyToClipboard(whatsappText);
    if (success) {
      setCopiedWA(true);
      setTimeout(() => setCopiedWA(false), 2000);
    }
  };

  const words =
    numericPrimaryValue !== undefined && numericPrimaryValue > 0
      ? numberToWordsIN(numericPrimaryValue, lang)
      : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {lang === 'hi' ? 'गणना परिणाम' : 'Calculation Result'}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>

        {statusBadge && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
              statusType === 'profit'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : statusType === 'loss'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {statusBadge}
          </span>
        )}
      </div>

      {/* Primary Hero Metric */}
      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60">
        <span className="text-xs text-slate-500 block mb-1 font-medium">{primaryLabel}</span>
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono tabular-nums text-slate-900 dark:text-slate-50">
          {primaryValue}
        </div>
        {words && (
          <p className="mt-1.5 text-xs text-teal-700 dark:text-teal-400 font-medium italic">
            ₹ {words}
          </p>
        )}
      </div>

      {/* Secondary Items Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border ${
              item.isHighlight
                ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/50'
                : 'bg-slate-50/60 dark:bg-slate-950/30 border-slate-150 dark:border-slate-800/50'
            }`}
          >
            <div className="text-[11px] text-slate-500 truncate mb-1">{item.label}</div>
            <div
              className={`text-base font-bold font-mono tabular-nums truncate ${
                item.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : item.isNegative
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {item.value}
            </div>
            {item.subtext && (
              <div className="text-[10px] text-slate-500 mt-0.5">{item.subtext}</div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons: Copy, WhatsApp Share, Reset */}
      <div className="pt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 rounded-xl transition-all shadow-sm active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (lang === 'hi' ? 'कॉपी हो गया' : 'Copied!') : (lang === 'hi' ? 'कॉपी करें' : 'Copy Summary')}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyWhatsApp}
          className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl transition-all active:scale-95"
          title={lang === 'hi' ? 'व्हाट्सएप फॉर्मेट कॉपी करें' : 'Copy in WhatsApp invoice format'}
        >
          {copiedWA ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedWA ? (lang === 'hi' ? 'कॉपी हो गया' : 'Ready!') : 'WhatsApp'}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] px-3.5 py-2 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-95"
          title={lang === 'hi' ? 'फ़ॉर्म रीसेट करें' : 'Reset form'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          {lang === 'hi' ? 'स्वतः इतिहास में सुरक्षित' : 'Auto-saved to history'}
        </span>
        <span className="text-[10px] text-slate-500">BizCalc Pro</span>
      </div>
    </div>
  );
};
