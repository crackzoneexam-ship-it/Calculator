import React, { useState, useMemo } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateEMI } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface EmiCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [loanAmount, setLoanAmount] = useState<number | ''>(500000);
  const [annualRate, setAnnualRate] = useState<number | ''>(10.5);
  const [tenureVal, setTenureVal] = useState<number | ''>(3);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showAmortization, setShowAmortization] = useState(false);

  const tenureMonths = tenureUnit === 'years' ? (Number(tenureVal) || 1) * 12 : Number(tenureVal) || 1;

  const result = useMemo(() => {
    return calculateEMI({
      loanAmount: Number(loanAmount) || 0,
      annualRate: Number(annualRate) || 0,
      tenureMonths,
    });
  }, [loanAmount, annualRate, tenureMonths]);

  const handleReset = () => {
    setLoanAmount(100000);
    setAnnualRate(10);
    setTenureVal(1);
    setTenureUnit('years');
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'emi',
      title: lang === 'hi' ? 'व्यापार ऋण ईएमआई' : 'Business Loan EMI',
      inputsSummary: `₹${loanAmount} @ ${annualRate}% for ${tenureVal} ${tenureUnit}`,
      resultSummary: `EMI: ${formatINR(result.monthlyEmi)}/mo, Interest: ${formatINR(result.totalInterest)}`,
      details: {
        'Loan Amount': Number(loanAmount) || 0,
        'Interest Rate': `${annualRate}%`,
        Tenure: `${tenureMonths} months`,
        'Monthly EMI': result.monthlyEmi,
        'Total Interest': result.totalInterest,
        'Total Repayment': result.totalPayment,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Business Loan & EMI Plan*\n• Loan Amount: ₹${loanAmount || 0}\n• Interest Rate: ${annualRate}% p.a.\n• Tenure: ${tenureVal} ${tenureUnit} (${tenureMonths} months)\n-----------------------\n*Monthly EMI:* ${formatINR(result.monthlyEmi)}\n*Total Interest:* ${formatINR(result.totalInterest)}\n*Total Payment:* ${formatINR(result.totalPayment)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'व्यापार ऋण एवं ईएमआई कैलकुलेटर' : 'Business Loan & EMI Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'मुद्रा एवं एमएसएमई व्यापार ऋण की मासिक किश्त (EMI), कुल ब्याज व वार्षिक विवरण'
              : 'Calculate monthly EMI, interest burden, and year-by-year amortization for MSME loans'}
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
        {/* Form Inputs */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              {lang === 'hi' ? 'ऋण राशि (Loan Amount ₹)' : 'Loan Principal Amount (₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-semibold"
                placeholder="500000"
              />
            </div>

            {/* Quick loan shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[100000, 250000, 500000, 1000000, 2500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                >
                  ₹{amt >= 100000 ? `${amt / 100000} Lakh` : amt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'वार्षिक ब्याज दर % (p.a.)' : 'Annual Interest Rate % (p.a.)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.25"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="10.5"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'hi' ? 'ऋण अवधि (Tenure)' : 'Loan Tenure'}
                </label>
                <div className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                  <button
                    type="button"
                    onClick={() => setTenureUnit('years')}
                    className={`px-1.5 py-0.5 rounded ${
                      tenureUnit === 'years'
                        ? 'bg-white dark:bg-slate-900 font-bold text-teal-700 dark:text-teal-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {lang === 'hi' ? 'वर्ष' : 'Yr'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenureUnit('months')}
                    className={`px-1.5 py-0.5 rounded ${
                      tenureUnit === 'months'
                        ? 'bg-white dark:bg-slate-900 font-bold text-teal-700 dark:text-teal-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {lang === 'hi' ? 'माह' : 'Mo'}
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="1"
                value={tenureVal}
                onChange={(e) => setTenureVal(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="3"
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
        <div className="lg:col-span-5 space-y-4">
          <ResultCard
            lang={lang}
            title={lang === 'hi' ? 'ईएमआई भुगतान योजना' : 'EMI Repayment Plan'}
            primaryLabel={lang === 'hi' ? 'मासिक किश्त (Monthly EMI)' : 'Monthly EMI'}
            primaryValue={`${formatINR(result.monthlyEmi)}/mo`}
            numericPrimaryValue={result.monthlyEmi}
            statusBadge={`${tenureMonths} Months`}
            statusType="neutral"
            items={[
              {
                label: lang === 'hi' ? 'मूल ऋण राशि' : 'Principal Loan',
                value: formatINR(Number(loanAmount) || 0),
              },
              {
                label: lang === 'hi' ? 'कुल देय ब्याज' : 'Total Interest',
                value: formatINR(result.totalInterest),
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'कुल भुगतान (मूल + ब्याज)' : 'Total Repayment',
                value: formatINR(result.totalPayment),
              },
              {
                label: lang === 'hi' ? 'ब्याज अनुपात %' : 'Interest Ratio %',
                value: formatPercent(result.interestRatioPercent),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />

          {/* Amortization Schedule Accordion */}
          {result.yearlyAmortization.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600"
              >
                <span>{lang === 'hi' ? 'वार्षिक भुगतान विवरण (Amortization)' : 'Yearly Loan Amortization'}</span>
                {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAmortization && (
                <div className="overflow-x-auto text-[11px] font-mono">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                        <th className="py-1">Year</th>
                        <th className="py-1">Principal</th>
                        <th className="py-1">Interest</th>
                        <th className="py-1">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {result.yearlyAmortization.map((row) => (
                        <tr key={row.year} className="text-slate-700 dark:text-slate-300">
                          <td className="py-1 font-bold">Yr {row.year}</td>
                          <td className="py-1">{formatINR(row.principalPaid)}</td>
                          <td className="py-1 text-amber-600 dark:text-amber-400">{formatINR(row.interestPaid)}</td>
                          <td className="py-1">{formatINR(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Reducing Balance EMI Formula (RBI Banking Standard)"
        titleHi="घटते मूलधन (Reducing Balance) पर ईएमआई गणना का सूत्र"
        formulaEn={[
          'EMI = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1]',
          'P = Principal Loan Amount',
          'r = Monthly Interest Rate = (Annual Rate ÷ 12) ÷ 100',
          'n = Loan Tenure in Months',
          'Total Interest Payable = (EMI × n) - Principal',
        ]}
        formulaHi={[
          'ईएमआई = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1]',
          'P = मूल ऋण राशि (Principal Amount)',
          'r = मासिक ब्याज दर = (वार्षिक दर ÷ 12) ÷ 100',
          'n = कुल महीने (Tenure in months)',
          'कुल ब्याज = (मासिक ईएमआई × कुल महीने) - मूल राशि',
        ]}
        notesEn={[
          'Standard bank business loans (SBI, HDFC, ICICI, Mudra) use monthly reducing balance.',
          'Prepaying 1 extra EMI every year can reduce total interest payout by 15% to 25%!',
        ]}
        notesHi={[
          'भारतीय बैंक (एसबीआई, पीएनबी, एचडीएफसी, मुद्रा लोन) मासिक घटते बैलेंस पर ईएमआई की गणना करते हैं।',
          'हर साल सिर्फ 1 अतिरिक्त किश्त का पूर्व-भुगतान करने से कुल ब्याज में 15% से 25% की भारी बचत होती है।',
        ]}
      />
    </div>
  );
};
