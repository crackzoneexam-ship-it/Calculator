import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateGST } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface GstCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const GstCalculator: React.FC<GstCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [amount, setAmount] = useState<number | ''>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<number | ''>('');
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [supplyType, setSupplyType] = useState<'intra_state' | 'inter_state'>('intra_state');
  const [inputGstCredit, setInputGstCredit] = useState<number | ''>(0);

  const effectiveRate = customRate !== '' ? Number(customRate) : gstRate;

  const result = useMemo(() => {
    return calculateGST({
      amount: Number(amount) || 0,
      rate: effectiveRate,
      mode,
      supplyType,
      inputGst: Number(inputGstCredit) || 0,
    });
  }, [amount, effectiveRate, mode, supplyType, inputGstCredit]);

  const handleReset = () => {
    setAmount(0);
    setGstRate(18);
    setCustomRate('');
    setInputGstCredit(0);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'gst',
      title: lang === 'hi' ? 'जीएसटी गणना' : 'GST Calculator',
      inputsSummary: `₹${amount} @ ${effectiveRate}% (${mode})`,
      resultSummary: `Tax: ${formatINR(result.totalGst)}, Gross: ${formatINR(result.grossAmount)}`,
      details: {
        'Entered Amount': Number(amount) || 0,
        'GST Slab': `${effectiveRate}%`,
        Mode: mode,
        'Base Amount': result.baseAmount,
        'Total GST': result.totalGst,
        'Gross Amount': result.grossAmount,
        'Net Payable after ITC': result.netGstPayable,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - GST Tax Invoice Breakdown*\n• Rate: ${effectiveRate}% (${mode === 'inclusive' ? 'Inclusive' : 'Exclusive'})\n• Base Value: ${formatINR(result.baseAmount)}\n• Total GST: ${formatINR(result.totalGst)}\n${
    supplyType === 'intra_state'
      ? `  - CGST (Central 50%): ${formatINR(result.cgst)}\n  - SGST (State 50%): ${formatINR(result.sgst)}\n`
      : `  - IGST (Interstate 100%): ${formatINR(result.igst)}\n`
  }${Number(inputGstCredit) > 0 ? `• Less ITC Credit: -${formatINR(Number(inputGstCredit))}\n• Net GST Payable: ${formatINR(result.netGstPayable)}\n` : ''}*Gross Invoice Value:* ${formatINR(result.grossAmount)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'जीएसटी एवं इनपुट टैक्स क्रेडिट (ITC) कैलकुलेटर' : 'GST & Input Tax Credit (ITC) Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'भारतीय जीएसटी स्लैब (0, 5, 12, 18, 28%), रिवर्स गणना, सीजीएसटी/एसजीएसटी व आईटीसी समायोजन'
              : 'Calculate Indian GST slabs, reverse GST, CGST/SGST/IGST breakdown, and net tax after ITC'}
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
        {/* Input Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          {/* Inclusive vs Exclusive Switch */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              {lang === 'hi' ? 'जीएसटी का प्रकार' : 'Calculation Mode'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('exclusive')}
                className={`py-2 px-3 rounded-lg transition-all text-center ${
                  mode === 'exclusive'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'जीएसटी अलग से (Exclusive / +Tax)' : 'Exclusive (+GST on Base)'}
              </button>
              <button
                type="button"
                onClick={() => setMode('inclusive')}
                className={`py-2 px-3 rounded-lg transition-all text-center ${
                  mode === 'inclusive'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'जीएसटी सहित (Inclusive / रिवर्स)' : 'Inclusive (Reverse GST)'}
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              {mode === 'exclusive'
                ? lang === 'hi'
                  ? 'मूल राशि / बेस प्राइस (₹)'
                  : 'Base Amount without Tax (₹)'
                : lang === 'hi'
                ? 'कुल बिल राशि (जीएसटी सहित ₹)'
                : 'Total Gross Bill Amount (with GST ₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-semibold"
                placeholder="0"
              />
            </div>
          </div>

          {/* GST Slabs */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              {lang === 'hi' ? 'जीएसटी स्लैब चुनें' : 'Select GST Slab'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setGstRate(rate);
                    setCustomRate('');
                  }}
                  className={`min-h-[40px] text-xs font-bold rounded-xl border transition-all ${
                    customRate === '' && gstRate === rate
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>

            {/* Custom GST input */}
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                {lang === 'hi' ? 'या कस्टम दर:' : 'Or custom rate:'}
              </span>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  placeholder="e.g. 3% (Gold) or 0.25% (Diamonds)"
                  className="w-full text-xs px-3 pr-7 py-1.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-teal-500 font-mono"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Supply Type: Intra-State vs Inter-State */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              {lang === 'hi' ? 'आपूर्ति प्रकार (Supply Type)' : 'Supply Type'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSupplyType('intra_state')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  supplyType === 'intra_state'
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700 font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {lang === 'hi' ? 'राज्य के भीतर (CGST + SGST)' : 'Intra-State (CGST + SGST)'}
              </button>
              <button
                type="button"
                onClick={() => setSupplyType('inter_state')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  supplyType === 'inter_state'
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700 font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {lang === 'hi' ? 'अन्य राज्य (IGST)' : 'Inter-State (IGST)'}
              </button>
            </div>
          </div>

          {/* Input Tax Credit (ITC) offset input */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {lang === 'hi' ? 'इनपुट टैक्स क्रेडिट (ITC समायोजन ₹ - वैकल्पिक)' : 'Input Tax Credit (ITC ₹ - Optional)'}
            </label>
            <span className="text-[11px] text-slate-500 block mb-1.5">
              {lang === 'hi'
                ? 'खरीद पर पहले से चुकाया गया टैक्स (Output GST से घट जाएगा)'
                : 'Tax already paid on raw materials/purchases (offsets output tax)'}
            </span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={inputGstCredit}
                onChange={(e) => setInputGstCredit(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
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

        {/* Right Results */}
        <div className="lg:col-span-5">
          <ResultCard
            lang={lang}
            title={lang === 'hi' ? 'जीएसटी टैक्स इनवॉइस विवरण' : 'GST Invoice Breakdown'}
            primaryLabel={lang === 'hi' ? 'कुल देय बिल (Gross Invoice Value)' : 'Gross Invoice Value'}
            primaryValue={formatINR(result.grossAmount)}
            numericPrimaryValue={result.grossAmount}
            statusBadge={`${effectiveRate}% GST`}
            statusType="neutral"
            items={[
              {
                label: lang === 'hi' ? 'मूल राशि (Base Value)' : 'Net Base Amount',
                value: formatINR(result.baseAmount),
              },
              {
                label: lang === 'hi' ? 'कुल जीएसटी (Total GST)' : 'Total GST',
                value: formatINR(result.totalGst),
                isHighlight: true,
              },
              ...(supplyType === 'intra_state'
                ? [
                    {
                      label: lang === 'hi' ? 'केंद्रीय कर (CGST 50%)' : 'CGST (Central 50%)',
                      value: formatINR(result.cgst),
                    },
                    {
                      label: lang === 'hi' ? 'राज्य कर (SGST 50%)' : 'SGST (State 50%)',
                      value: formatINR(result.sgst),
                    },
                  ]
                : [
                    {
                      label: lang === 'hi' ? 'एकीकृत कर (IGST 100%)' : 'IGST (Interstate)',
                      value: formatINR(result.igst),
                    },
                    {
                      label: lang === 'hi' ? 'आपूर्ति प्रकार' : 'Supply Type',
                      value: 'Inter-State',
                    },
                  ]),
              {
                label: lang === 'hi' ? 'इनपुट टैक्स क्रेडिट (ITC)' : 'Input GST Credit',
                value: formatINR(result.inputGstCredit),
              },
              {
                label: lang === 'hi' ? 'शुद्ध देय टैक्स (Net to Govt)' : 'Net Tax Payable',
                value: formatINR(result.netGstPayable),
                isHighlight: true,
                isPositive: result.netGstPayable === 0,
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Indian GST Act Formulas & ITC Rules"
        titleHi="भारतीय जीएसटी नियम, रिवर्स गणना एवं आईटीसी सूत्र"
        formulaEn={[
          'Exclusive GST: Tax = Base Amount × (GST Rate ÷ 100); Gross = Base + Tax',
          'Inclusive (Reverse) GST: Base Amount = Gross Bill ÷ [1 + (GST Rate ÷ 100)]',
          'Intra-State: CGST = Total GST ÷ 2, SGST = Total GST ÷ 2',
          'Inter-State: IGST = Total GST',
          'Net GST Payable to Government = Output GST Collected - Eligible Input Tax Credit (ITC)',
        ]}
        formulaHi={[
          'जीएसटी अलग से: टैक्स = मूल राशि × (जीएसटी दर ÷ 100); कुल बिल = मूल + टैक्स',
          'जीएसटी सहित (रिवर्स): मूल राशि = कुल बिल ÷ [1 + (जीएसटी दर ÷ 100)]',
          'राज्य के भीतर: CGST = कुल टैक्स ÷ 2, SGST = कुल टैक्स ÷ 2',
          'अन्य राज्य: IGST = कुल टैक्स (100% केंद्र द्वारा संग्रहित)',
          'सरकार को देय शुद्ध जीएसटी = बिक्री पर लिया गया टैक्स - खरीद पर चुकाया गया टैक्स (ITC)',
        ]}
        notesEn={[
          'Gold and precious metals are taxed at 3% GST. Rough diamonds at 0.25%.',
          'Registered businesses can claim 100% ITC on business purchases against output tax liability.',
        ]}
        notesHi={[
          'सोने व चांदी पर 3% जीएसटी, तराशे हुए हीरों पर 1.5% व कच्चे हीरों पर 0.25% लागू होता है।',
          'जीएसटी रजिस्टर्ड व्यापारी अपनी खरीद पर चुकाए गए इनपुट टैक्स को बिक्री टैक्स से घटा सकते हैं।',
        ]}
      />
    </div>
  );
};
