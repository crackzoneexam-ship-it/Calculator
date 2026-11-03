import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateDiscount } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface DiscountCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const DiscountCalculator: React.FC<DiscountCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [mrp, setMrp] = useState<number | ''>(2500);
  const [primaryDiscount, setPrimaryDiscount] = useState<number | ''>(20);
  const [cashDiscount, setCashDiscount] = useState<number | ''>(5);
  const [applyGst, setApplyGst] = useState<boolean>(false);
  const [gstRate, setGstRate] = useState<number>(18);

  const result = useMemo(() => {
    return calculateDiscount({
      mrp: Number(mrp) || 0,
      primaryDiscountPercent: Number(primaryDiscount) || 0,
      cashDiscountPercent: Number(cashDiscount) || 0,
      applyGst,
      gstRate,
    });
  }, [mrp, primaryDiscount, cashDiscount, applyGst, gstRate]);

  const handleReset = () => {
    setMrp(0);
    setPrimaryDiscount(0);
    setCashDiscount(0);
    setApplyGst(false);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'discount',
      title: lang === 'hi' ? 'छूट एवं बट्टा गणना' : 'Discount Calculator',
      inputsSummary: `MRP: ₹${mrp}, Disc: ${primaryDiscount}% + ${cashDiscount}%`,
      resultSummary: `Final: ${formatINR(result.finalPayable)} (Saved ${formatINR(result.totalDiscountAmount)})`,
      details: {
        'Marked Price (MRP)': Number(mrp) || 0,
        'Primary Discount %': Number(primaryDiscount) || 0,
        'Cash Discount %': Number(cashDiscount) || 0,
        'Final Payable': result.finalPayable,
        'Total Saved': result.totalDiscountAmount,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Discount & Billing Slip*\n• MRP: ₹${mrp || 0}\n• Trade Discount (${primaryDiscount}%): -${formatINR(result.primarySavings)}\n• Price After Trade Disc: ${formatINR(result.priceAfterPrimary)}\n• Cash Discount (${cashDiscount}%): -${formatINR(result.secondarySavings)}\n${applyGst ? `• GST (${gstRate}%): +${formatINR(result.gstAmount)}\n` : ''}-----------------------\n*Total Savings:* ${formatINR(result.totalDiscountAmount)} (${formatPercent(result.effectiveDiscountPercent)})\n*Net Payable:* ${formatINR(result.finalPayable)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'छूट एवं नकद बट्टा (Discount) कैलकुलेटर' : 'Discount & Cash Discount Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'एमआरपी पर व्यापारिक छूट, थोक बाजार का नकद बट्टा (उदा. 20% + 5%) व जीएसटी गणना'
              : 'Calculate marked price discounts, cascading trade & cash discounts, and final payable bill'}
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
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              {lang === 'hi' ? 'अंकित मूल्य / एमआरपी (MRP ₹)' : 'Marked Price (MRP ₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'प्राथमिक छूट % (Trade Discount)' : 'Primary / Trade Discount %'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={primaryDiscount}
                  onChange={(e) => setPrimaryDiscount(e.target.value === '' ? '' : Math.min(100, Math.max(0, parseFloat(e.target.value))))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="20"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'नकद बट्टा % (Cash Discount / CD)' : 'Secondary / Cash Discount (CD) %'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cashDiscount}
                  onChange={(e) => setCashDiscount(e.target.value === '' ? '' : Math.min(100, Math.max(0, parseFloat(e.target.value))))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="5"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Quick Discount Presets */}
          <div>
            <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
              {lang === 'hi' ? 'सामान्य थोक बाजार छूट प्रीसेट' : 'Popular Wholesale Discount Presets'}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { p: 10, c: 2, label: '10% + 2% CD' },
                { p: 20, c: 5, label: '20% + 5% CD' },
                { p: 30, c: 5, label: '30% + 5% CD' },
                { p: 40, c: 0, label: 'Flat 40%' },
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrimaryDiscount(preset.p);
                    setCashDiscount(preset.c);
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* GST Toggle on Discounted Price */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="apply-gst-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                {lang === 'hi' ? 'छूट के बाद जीएसटी जोड़ें (+GST)' : 'Add GST on Discounted Price'}
              </label>
              <input
                id="apply-gst-toggle"
                type="checkbox"
                checked={applyGst}
                onChange={(e) => setApplyGst(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>

            {applyGst && (
              <div className="flex items-center gap-2">
                {[5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      gstRate === rate
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
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
            title={lang === 'hi' ? 'छूट एवं देय राशि विवरण' : 'Discounted Bill Slip'}
            primaryLabel={lang === 'hi' ? 'अंतिम देय राशि (Final Payable)' : 'Final Payable Amount'}
            primaryValue={formatINR(result.finalPayable)}
            numericPrimaryValue={result.finalPayable}
            statusBadge={`${formatPercent(result.effectiveDiscountPercent)} OFF`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'मूल एमआरपी (MRP)' : 'Original MRP',
                value: formatINR(result.mrp),
              },
              {
                label: lang === 'hi' ? 'कुल बचत (Total Saved)' : 'Total Savings',
                value: formatINR(result.totalDiscountAmount),
                isPositive: true,
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'प्राथमिक छूट बचत' : 'Primary Savings',
                value: formatINR(result.primarySavings),
              },
              {
                label: lang === 'hi' ? 'नकद बट्टा (CD) बचत' : 'Cash Discount Savings',
                value: formatINR(result.secondarySavings),
              },
              {
                label: lang === 'hi' ? 'प्रभावी कुल छूट %' : 'Effective Discount %',
                value: formatPercent(result.effectiveDiscountPercent),
                isPositive: true,
              },
              {
                label: lang === 'hi' ? 'जीएसटी राशि' : 'GST Amount',
                value: formatINR(result.gstAmount),
                subtext: applyGst ? `${gstRate}% GST` : 'Not applied',
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Successive / Cascading Discount Formulas in Indian Markets"
        titleHi="थोक बाजार में क्रमिक छूट (Successive Discount) के नियम"
        formulaEn={[
          'Primary Discounted Price = MRP × [1 - (Primary % ÷ 100)]',
          'Cash Discount (CD) is applied on the remaining price, NOT on the original MRP!',
          'Secondary Price = Primary Price × [1 - (Cash % ÷ 100)]',
          'Effective Discount % = 1 - [(1 - D1) × (1 - D2)]',
        ]}
        formulaHi={[
          'प्राथमिक छूट के बाद मूल्य = MRP × [1 - (छूट % ÷ 100)]',
          'नकद बट्टा (CD) मूल एमआरपी पर नहीं, बल्कि प्राथमिक छूट के बाद बची राशि पर लागू होता है!',
          'अंतिम मूल्य = प्राथमिक मूल्य × [1 - (नकद छूट % ÷ 100)]',
          'कुल प्रभावी छूट % = 1 - [(1 - D1/100) × (1 - D2/100)] × 100',
        ]}
        notesEn={[
          'Example: 20% + 5% discount is NOT 25%! On ₹1000, 20% leaves ₹800. 5% on ₹800 is ₹40. Total discount is ₹240 (24%), not ₹250.',
        ]}
        notesHi={[
          'उदाहरण: 20% + 5% की छूट कुल 25% नहीं होती! ₹1000 पर 20% घटाने से ₹800 बचते हैं। ₹800 पर 5% सीडी ₹40 होता है। कुल छूट ₹240 (24%) हुई, 25% नहीं।',
        ]}
      />
    </div>
  );
};
