import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateBusinessFinance } from '../../utils/calculations';
import { formatINR, formatNumberIN, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface BusinessFinanceCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const BusinessFinanceCalculator: React.FC<BusinessFinanceCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [fixedCosts, setFixedCosts] = useState<number | ''>(80000);
  const [variableCost, setVariableCost] = useState<number | ''>(35);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(75);
  const [receivables, setReceivables] = useState<number | ''>(150000);
  const [inventoryValue, setInventoryValue] = useState<number | ''>(120000);
  const [payables, setPayables] = useState<number | ''>(90000);
  const [cashBalance, setCashBalance] = useState<number | ''>(300000);
  const [monthlyBurn, setMonthlyBurn] = useState<number | ''>(60000);

  const result = useMemo(() => {
    return calculateBusinessFinance({
      fixedCosts: Number(fixedCosts) || 0,
      variableCostPerUnit: Number(variableCost) || 0,
      sellingPricePerUnit: Number(sellingPrice) || 0,
      receivables: Number(receivables) || 0,
      inventoryValue: Number(inventoryValue) || 0,
      payables: Number(payables) || 0,
      cashBalance: Number(cashBalance) || 0,
      monthlyBurnRate: Number(monthlyBurn) || 0,
    });
  }, [fixedCosts, variableCost, sellingPrice, receivables, inventoryValue, payables, cashBalance, monthlyBurn]);

  const handleReset = () => {
    setFixedCosts(50000);
    setVariableCost(20);
    setSellingPrice(50);
    setReceivables(100000);
    setInventoryValue(80000);
    setPayables(60000);
    setCashBalance(200000);
    setMonthlyBurn(40000);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'business_finance',
      title: lang === 'hi' ? 'ब्रेक-ईवन एवं वर्किंग कैपिटल' : 'Break-Even & Working Capital',
      inputsSummary: `Fixed: ₹${fixedCosts}, VC: ₹${variableCost}, SP: ₹${sellingPrice}`,
      resultSummary: `Break-even: ${result.breakEvenUnits} units (${formatINR(result.breakEvenSales)}), Runway: ${result.cashRunwayMonths} mo`,
      details: {
        'Break-Even Units': result.breakEvenUnits,
        'Break-Even Sales (₹)': result.breakEvenSales,
        'Contribution Margin': result.contributionMargin,
        'Working Capital': result.workingCapital,
        'Cash Runway': `${result.cashRunwayMonths} months`,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Break-Even & Working Capital Summary*\n• Fixed Costs: ₹${fixedCosts || 0}\n• Selling Price: ₹${sellingPrice || 0} | Variable Cost: ₹${variableCost || 0}\n• Contribution Margin: ${formatINR(result.contributionMargin)} (${formatPercent(result.contributionMarginRatio)})\n-----------------------\n*Break-Even Quantity:* ${formatNumberIN(result.breakEvenUnits, 0)} units\n*Break-Even Revenue:* ${formatINR(result.breakEvenSales)}\n*Net Working Capital:* ${formatINR(result.workingCapital)}\n*Cash Runway:* ${result.cashRunwayMonths} Months`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'सम-विच्छेद (Break-Even) एवं कार्यशील पूंजी' : 'Break-Even & Working Capital Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'बिना नफा-नुकसान बिक्री स्तर (BEP), अंशदान अनुपात (P/V Ratio), वर्किंग कैपिटल व कैश रनवे'
              : 'Calculate break-even units & sales, contribution margin ratio, working capital, and cash runway'}
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
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '1. ब्रेक-ईवन विश्लेषण (Break-Even Analysis)' : '1. Break-Even Inputs'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'मासिक स्थिर लागत (Fixed ₹)' : 'Fixed Costs (₹/mo)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="80000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'परिवर्तनशील लागत (VC ₹)' : 'Variable Cost / Unit'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={variableCost}
                  onChange={(e) => setVariableCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="35"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'बिक्री मूल्य (SP ₹)' : 'Selling Price / Unit'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="75"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '2. कार्यशील पूंजी (Working Capital)' : '2. Working Capital Needs'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'बाजार से उधारी (Receivables ₹)' : 'Accounts Receivable'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={receivables}
                  onChange={(e) => setReceivables(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="150000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'गोदाम स्टॉक मूल्य (₹)' : 'Stock/Inventory Value'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={inventoryValue}
                  onChange={(e) => setInventoryValue(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="120000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'आपूर्तिकर्ता देनदारी (Payables ₹)' : 'Accounts Payable'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={payables}
                  onChange={(e) => setPayables(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="90000"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '3. नकद रनवे (Cash Runway)' : '3. Cash Runway'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'बैंक में जमा नकद (Cash Balance ₹)' : 'Cash in Bank (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashBalance}
                  onChange={(e) => setCashBalance(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="300000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'मासिक नकद घाटा (Burn Rate ₹)' : 'Monthly Net Burn Rate (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={monthlyBurn}
                  onChange={(e) => setMonthlyBurn(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="60000"
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

        {/* Right Results */}
        <div className="lg:col-span-5">
          <ResultCard
            lang={lang}
            title={lang === 'hi' ? 'ब्रेक-ईवन एवं वित्तीय रिपोर्ट' : 'Financial Health Report'}
            primaryLabel={lang === 'hi' ? 'सम-विच्छेद बिक्री राशि (BEP Sales)' : 'Break-Even Sales Revenue'}
            primaryValue={formatINR(result.breakEvenSales)}
            numericPrimaryValue={result.breakEvenSales}
            statusBadge={`${formatNumberIN(result.breakEvenUnits, 0)} Units`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'ब्रेक-ईवन यूनिट संख्या' : 'Break-Even Units',
                value: `${formatNumberIN(result.breakEvenUnits, 0)} Units`,
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'अंशदान मार्जिन (P/V Ratio)' : 'P/V Contribution Ratio',
                value: formatPercent(result.contributionMarginRatio),
                isPositive: true,
              },
              {
                label: lang === 'hi' ? 'प्रति यूनिट अंशदान' : 'Contribution / Unit',
                value: formatINR(result.contributionMargin),
              },
              {
                label: lang === 'hi' ? 'कार्यशील पूंजी (Working Capital)' : 'Working Capital',
                value: formatINR(result.workingCapital),
                isPositive: result.workingCapital >= 0,
                isNegative: result.workingCapital < 0,
              },
              {
                label: lang === 'hi' ? 'नकद रनवे (Runway)' : 'Cash Runway',
                value: `${result.cashRunwayMonths} Months`,
                isHighlight: true,
                isPositive: result.cashRunwayMonths >= 6,
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Break-Even & Working Capital Accounting Formulas"
        titleHi="ब्रेक-ईवन और कार्यशील पूंजी के लेखा सूत्र"
        formulaEn={[
          'Contribution Margin = Selling Price - Variable Cost per unit',
          'Break-Even Units = Fixed Costs ÷ Contribution Margin',
          'Break-Even Sales (₹) = Break-Even Units × Selling Price',
          'Working Capital = Accounts Receivable + Inventory Value - Accounts Payable',
          'Cash Runway (Months) = Cash in Bank ÷ Monthly Burn Rate',
        ]}
        formulaHi={[
          'अंशदान (Contribution) = बिक्री मूल्य - परिवर्तनशील लागत',
          'ब्रेक-ईवन यूनिट = कुल स्थिर लागत ÷ प्रति यूनिट अंशदान',
          'ब्रेक-ईवन बिक्री (₹) = ब्रेक-ईवन यूनिट × बिक्री मूल्य',
          'कार्यशील पूंजी (Working Capital) = बाजार उधारी + स्टॉक - आपूर्तिकर्ता देनदारी',
          'कैश रनवे (महीने) = बैंक में जमा राशि ÷ मासिक खर्च',
        ]}
        notesEn={[
          'Break-even tells you the exact number of units you must sell each month to avoid losses.',
        ]}
        notesHi={[
          'ब्रेक-ईवन आपको बताता है कि बिना किसी नुकसान के व्यापार चलाने के लिए महीने में कम से कम कितने पीस बेचना जरूरी है।',
        ]}
      />
    </div>
  );
};
