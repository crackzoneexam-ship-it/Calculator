import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateMarginMarkup } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface MarginMarkupCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const MarginMarkupCalculator: React.FC<MarginMarkupCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [mode, setMode] = useState<'from_prices' | 'from_margin' | 'from_markup'>('from_margin');
  const [costPrice, setCostPrice] = useState<number | ''>(800);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(1000);
  const [targetMargin, setTargetMargin] = useState<number | ''>(20);
  const [targetMarkup, setTargetMarkup] = useState<number | ''>(25);

  const result = useMemo(() => {
    return calculateMarginMarkup({
      mode,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      targetMargin: Number(targetMargin) || 0,
      targetMarkup: Number(targetMarkup) || 0,
    });
  }, [mode, costPrice, sellingPrice, targetMargin, targetMarkup]);

  const handleReset = () => {
    setCostPrice(0);
    setSellingPrice(0);
    setTargetMargin(20);
    setTargetMarkup(25);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'margin_markup',
      title: lang === 'hi' ? 'मार्जिन व मार्कअप सॉल्वर' : 'Margin & Markup Solver',
      inputsSummary: `Cost: ₹${costPrice}, Mode: ${mode}`,
      resultSummary: `Price: ${formatINR(result.sellingPrice)}, Margin: ${formatPercent(result.marginPercent)}`,
      details: {
        'Cost Price': Number(costPrice) || 0,
        'Selling Price': result.sellingPrice,
        'Gross Profit': result.grossProfit,
        'Margin %': result.marginPercent,
        'Markup %': result.markupPercent,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Margin & Markup Plan*\n• Cost Price: ₹${costPrice || 0}\n• Mode: ${mode}\n• Required Selling Price: ${formatINR(result.sellingPrice)}\n• Profit per piece: ${formatINR(result.grossProfit)}\n• Gross Margin: ${formatPercent(result.marginPercent)} (on Sales)\n• Markup: ${formatPercent(result.markupPercent)} (on Cost)`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'मार्जिन एवं मार्कअप सॉल्वर' : 'Margin & Markup Solver'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'लागत और इच्छित मार्जिन/मार्कअप से सटीक बिक्री भाव निकालें या कीमतों से मार्जिन जांचें'
              : 'Calculate optimal selling price from target margin or markup, or test existing prices'}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleFavourite}
          className={`p-2 rounded-xl transition-colors ${
            isFavourite
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          title={isFavourite ? 'Starred' : 'Add to favourites'}
        >
          <Star className={`w-5 h-5 ${isFavourite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          {/* Mode Switcher */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              {lang === 'hi' ? 'गणना का तरीका (Mode)' : 'Calculation Mode'}
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('from_margin')}
                className={`py-2 px-2 rounded-lg transition-all truncate text-center ${
                  mode === 'from_margin'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'मार्जिन से भाव' : 'Target Margin %'}
              </button>
              <button
                type="button"
                onClick={() => setMode('from_markup')}
                className={`py-2 px-2 rounded-lg transition-all truncate text-center ${
                  mode === 'from_markup'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'मार्कअप से भाव' : 'Target Markup %'}
              </button>
              <button
                type="button"
                onClick={() => setMode('from_prices')}
                className={`py-2 px-2 rounded-lg transition-all truncate text-center ${
                  mode === 'from_prices'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'कीमतों से जांच' : 'From Prices'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'लागत मूल्य / खरीद भाव (₹)' : 'Cost Price (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="0"
                />
              </div>
            </div>

            {mode === 'from_margin' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'इच्छित लाभ मार्जिन % (बिक्री पर)' : 'Desired Margin % (on Selling Price)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="99.9"
                    step="0.5"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(e.target.value === '' ? '' : Math.min(99.9, Math.max(0, parseFloat(e.target.value))))}
                    className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="20"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    %
                  </span>
                </div>
              </div>
            )}

            {mode === 'from_markup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'इच्छित मार्कअप % (लागत पर)' : 'Desired Markup % (on Cost Price)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={targetMarkup}
                    onChange={(e) => setTargetMarkup(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="25"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    %
                  </span>
                </div>
              </div>
            )}

            {mode === 'from_prices' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'बिक्री मूल्य (₹)' : 'Selling Price (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCalculateAndSave}
              className="flex-1 min-h-[44px] bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              {lang === 'hi' ? 'गणना सुरक्षित करें' : 'Recalculate & Save'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {lang === 'hi' ? 'रीसेट' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-5">
          <ResultCard
            lang={lang}
            title={lang === 'hi' ? 'मार्जिन विश्लेषण रिपोर्ट' : 'Margin & Markup Analysis'}
            primaryLabel={
              mode === 'from_prices'
                ? lang === 'hi'
                  ? 'सकल मार्जिन (Gross Margin %)'
                  : 'Gross Margin %'
                : lang === 'hi'
                ? 'अनुशंसित बिक्री मूल्य (Selling Price)'
                : 'Target Selling Price'
            }
            primaryValue={
              mode === 'from_prices'
                ? formatPercent(result.marginPercent)
                : formatINR(result.sellingPrice)
            }
            numericPrimaryValue={result.sellingPrice}
            statusBadge={`${formatPercent(result.marginPercent)} Margin`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'लागत मूल्य (Cost)' : 'Cost Price',
                value: formatINR(result.costPrice),
              },
              {
                label: lang === 'hi' ? 'बिक्री मूल्य (Selling)' : 'Selling Price',
                value: formatINR(result.sellingPrice),
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'प्रति पीस लाभ (Profit)' : 'Profit Per Unit',
                value: formatINR(result.grossProfit),
                isPositive: result.grossProfit > 0,
              },
              {
                label: lang === 'hi' ? 'मार्जिन (बिक्री पर %)' : 'Margin % (on Revenue)',
                value: formatPercent(result.marginPercent),
                isPositive: true,
              },
              {
                label: lang === 'hi' ? 'मार्कअप (लागत पर %)' : 'Markup % (on Cost)',
                value: formatPercent(result.markupPercent),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Difference Between Margin and Markup Explained"
        titleHi="मार्जिन और मार्कअप में अंतर एवं सूत्र"
        formulaEn={[
          'Margin % = [(Selling Price - Cost Price) ÷ Selling Price] × 100',
          'Markup % = [(Selling Price - Cost Price) ÷ Cost Price] × 100',
          'Selling Price from Margin = Cost Price ÷ [1 - (Margin % ÷ 100)]',
          'Selling Price from Markup = Cost Price × [1 + (Markup % ÷ 100)]',
        ]}
        formulaHi={[
          'मार्जिन % = [(बिक्री मूल्य - खरीद मूल्य) ÷ बिक्री मूल्य] × 100',
          'मार्कअप % = [(बिक्री मूल्य - खरीद मूल्य) ÷ खरीद मूल्य] × 100',
          'मार्जिन से बिक्री मूल्य = खरीद मूल्य ÷ [1 - (मार्जिन % ÷ 100)]',
          'मार्कअप से बिक्री मूल्य = खरीद मूल्य × [1 + (मार्कअप % ÷ 100)]',
        ]}
        notesEn={[
          'Example: Cost ₹800 sold at ₹1000 gives ₹200 profit. Margin is 20% (200/1000), but Markup is 25% (200/800)!',
          'Many retailers mistakenly add 20% markup thinking they get a 20% margin, resulting in lower profits.',
        ]}
        notesHi={[
          'उदाहरण: ₹800 की चीज ₹1000 में बेचने पर ₹200 मुनाफा होता है। इसमें मार्जिन 20% (200/1000) है, पर मार्कअप 25% (200/800) है!',
          'कई व्यापारी 20% मार्जिन पाने के लिए लागत में सिर्फ 20% जोड़ देते हैं, जिससे उन्हें नुकसान होता है।',
        ]}
      />
    </div>
  );
};
