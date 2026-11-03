import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateProfitLoss } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface ProfitLossCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const ProfitLossCalculator: React.FC<ProfitLossCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [costPrice, setCostPrice] = useState<number | ''>(850);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(1200);
  const [quantity, setQuantity] = useState<number | ''>(10);
  const [overheads, setOverheads] = useState<number | ''>(500);

  const result = useMemo(() => {
    return calculateProfitLoss({
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      quantity: Number(quantity) || 1,
      overheads: Number(overheads) || 0,
    });
  }, [costPrice, sellingPrice, quantity, overheads]);

  const handleReset = () => {
    setCostPrice(0);
    setSellingPrice(0);
    setQuantity(1);
    setOverheads(0);
  };

  const handleCalculateAndSave = () => {
    const cp = Number(costPrice) || 0;
    const sp = Number(sellingPrice) || 0;
    const q = Number(quantity) || 1;
    onSaveHistory({
      calculatorId: 'profit_loss',
      title: lang === 'hi' ? 'लाभ/हानि गणना' : 'Profit & Loss Calc',
      inputsSummary: `CP: ₹${cp}, SP: ₹${sp}, Qty: ${q}`,
      resultSummary: `${result.isProfit ? 'Profit' : 'Loss'}: ${formatINR(result.netProfit)} (${formatPercent(result.marginPercentage)} margin)`,
      details: {
        'Cost Price': cp,
        'Selling Price': sp,
        Quantity: q,
        'Net Profit': result.netProfit,
        'Margin %': result.marginPercentage,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Profit & Loss Summary*\n• Cost Price: ₹${costPrice || 0}\n• Selling Price: ₹${sellingPrice || 0}\n• Quantity: ${quantity || 1}\n• Overheads/Transport: ₹${overheads || 0}\n-----------------------\n*Total Cost:* ${formatINR(result.totalCost)}\n*Total Revenue:* ${formatINR(result.totalRevenue)}\n*Net ${result.isProfit ? 'Profit' : 'Loss'}:* ${formatINR(result.netProfit)}\n*Margin:* ${formatPercent(result.marginPercentage)} | *Markup:* ${formatPercent(result.markupPercentage)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Star */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'लाभ एवं हानि कैलकुलेटर' : 'Profit & Loss Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'लागत, बिक्री, भाड़ा और अतिरिक्त खर्च जोड़कर शुद्ध मुनाफा व मार्जिन प्रतिशत निकालें'
              : 'Calculate net profit, profit margin, markup %, and per-unit metrics with overheads'}
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
        {/* Input Form Controls */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'खरीद भाव / लागत मूल्य (₹)' : 'Cost Price per unit (₹)'}
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

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'बेचान भाव / बिक्री मूल्य (₹)' : 'Selling Price per unit (₹)'}
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

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मात्रा / पीस संख्या' : 'Quantity / Units'}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'अतिरिक्त खर्च / भाड़ा (₹)' : 'Overheads & Transport (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={overheads}
                  onChange={(e) => setOverheads(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="0"
                />
              </div>
            </div>
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

        {/* Results Box */}
        <div className="lg:col-span-5">
          <ResultCard
            lang={lang}
            title={lang === 'hi' ? 'व्यापारिक लाभ/हानि रिपोर्ट' : 'P&L Statement'}
            primaryLabel={
              result.isProfit
                ? lang === 'hi'
                  ? 'कुल शुद्ध मुनाफा (Net Profit)'
                  : 'Total Net Profit'
                : lang === 'hi'
                ? 'कुल शुद्ध हानि (Net Loss)'
                : 'Total Net Loss'
            }
            primaryValue={formatINR(Math.abs(result.netProfit))}
            numericPrimaryValue={Math.abs(result.netProfit)}
            statusBadge={
              result.isProfit
                ? lang === 'hi'
                  ? 'मुनाफा (Profit)'
                  : 'PROFIT'
                : lang === 'hi'
                ? 'हानि (Loss)'
                : 'LOSS'
            }
            statusType={result.isProfit ? 'profit' : 'loss'}
            items={[
              {
                label: lang === 'hi' ? 'कुल लागत (Total Cost)' : 'Total Cost',
                value: formatINR(result.totalCost),
              },
              {
                label: lang === 'hi' ? 'कुल बिक्री (Total Revenue)' : 'Total Revenue',
                value: formatINR(result.totalRevenue),
              },
              {
                label: lang === 'hi' ? 'मार्जिन (बिक्री पर %)' : 'Margin % (on Revenue)',
                value: formatPercent(result.marginPercentage),
                isHighlight: true,
                isPositive: result.isProfit,
                isNegative: !result.isProfit,
              },
              {
                label: lang === 'hi' ? 'मार्कअप (लागत पर %)' : 'Markup % (on Cost)',
                value: formatPercent(result.markupPercentage),
                isPositive: result.isProfit,
                isNegative: !result.isProfit,
              },
              {
                label: lang === 'hi' ? 'प्रति पीस लाभ (Per Unit)' : 'Profit Per Unit',
                value: formatINR(result.profitPerUnit),
                isPositive: result.profitPerUnit >= 0,
                isNegative: result.profitPerUnit < 0,
              },
              {
                label: lang === 'hi' ? 'लागत पर रिटर्न (ROI %)' : 'ROI on Cost %',
                value: formatPercent(result.profitPercentage),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Formula Accordion */}
      <FormulaAccordion
        lang={lang}
        titleEn="Profit, Loss, Margin & Markup Formulas"
        titleHi="लाभ, हानि, मार्जिन एवं मार्कअप के सटीक सूत्र"
        formulaEn={[
          'Total Cost = (Cost Price × Quantity) + Overheads & Freight',
          'Total Revenue = Selling Price × Quantity',
          'Net Profit = Total Revenue - Total Cost',
          'Gross Margin % = (Net Profit ÷ Total Revenue) × 100',
          'Markup % = [(Selling Price - Cost Price) ÷ Cost Price] × 100',
        ]}
        formulaHi={[
          'कुल लागत = (खरीद भाव × मात्रा) + अतिरिक्त खर्चे व भाड़ा',
          'कुल बिक्री = बिक्री मूल्य × मात्रा',
          'शुद्ध मुनाफा = कुल बिक्री - कुल लागत',
          'मार्जिन प्रतिशत = (शुद्ध मुनाफा ÷ कुल बिक्री) × 100',
          'मार्कअप प्रतिशत = [(बिक्री मूल्य - खरीद भाव) ÷ खरीद भाव] × 100',
        ]}
        notesEn={[
          'Margin is calculated on Selling Price (Revenue); Markup is calculated on Cost Price.',
          'Always include freight and transit insurance in overheads to protect true gross margins.',
        ]}
        notesHi={[
          'मार्जिन की गणना बिक्री मूल्य पर होती है, जबकि मार्कअप खरीद भाव (लागत) पर निकाला जाता है।',
          'सटीक मुनाफा जानने के लिए भाड़ा, पैकिंग और लोडिंग खर्च को लागत में जरूर शामिल करें।',
        ]}
      />
    </div>
  );
};
