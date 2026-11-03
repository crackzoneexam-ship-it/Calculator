import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateFreelancing } from '../../utils/calculations';
import { formatINR, formatNumberIN } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface FreelancingCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const FreelancingCalculator: React.FC<FreelancingCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [desiredIncome, setDesiredIncome] = useState<number | ''>(85000);
  const [overheads, setOverheads] = useState<number | ''>(12000);
  const [billableHours, setBillableHours] = useState<number | ''>(25);
  const [weeksOff, setWeeksOff] = useState<number | ''>(4);
  const [taxBuffer, setTaxBuffer] = useState<number | ''>(10);
  const [applyTds, setApplyTds] = useState<boolean>(true);
  const [tdsRate, setTdsRate] = useState<number>(10);

  const result = useMemo(() => {
    return calculateFreelancing({
      desiredMonthlyIncome: Number(desiredIncome) || 0,
      monthlyBusinessOverheads: Number(overheads) || 0,
      billableHoursPerWeek: Number(billableHours) || 1,
      paidWeeksOffPerYear: Number(weeksOff) || 0,
      taxBufferPercent: Number(taxBuffer) || 0,
      apply194jTds: applyTds,
      tdsRate,
    });
  }, [desiredIncome, overheads, billableHours, weeksOff, taxBuffer, applyTds, tdsRate]);

  const handleReset = () => {
    setDesiredIncome(75000);
    setOverheads(10000);
    setBillableHours(25);
    setWeeksOff(4);
    setTaxBuffer(10);
    setApplyTds(true);
    setTdsRate(10);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'freelancing',
      title: lang === 'hi' ? 'फ्रीलांसिंग प्रति घंटा दर' : 'Freelance Hourly Rate',
      inputsSummary: `Target: ₹${desiredIncome}/mo, ${billableHours} hrs/wk`,
      resultSummary: `Rate: ₹${result.hourlyRate}/hr (₹${result.dayRate}/day), Annual: ${formatINR(result.requiredAnnualRevenue)}`,
      details: {
        'Target Take-Home': Number(desiredIncome) || 0,
        'Required Hourly Rate': result.hourlyRate,
        'Day Rate (8 hrs)': result.dayRate,
        'Annual Revenue Needed': result.requiredAnnualRevenue,
        'Billable Hours/Yr': result.totalBillableHoursPerYear,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Freelance & Professional Fee Quotation*\n• Target In-Hand Income: ${formatINR(Number(desiredIncome) || 0)}/month\n• Billable Commitment: ${billableHours} hours/week (${result.effectiveWorkingWeeks} weeks/year)\n-----------------------\n*Recommended Hourly Rate:* ₹${result.hourlyRate}/hour\n*Recommended Day Rate (8 hrs):* ₹${result.dayRate}/day\n*Required Annual Invoicing:* ${formatINR(result.requiredAnnualRevenue)}\n${
    applyTds
      ? `• Section 194J TDS (${tdsRate}%): Client withholds ₹${(100000 * (tdsRate / 100)).toLocaleString('en-IN')} on ₹1,00,000 invoice (Net received: ₹${(100000 * (1 - tdsRate / 100)).toLocaleString('en-IN')})`
      : ''
  }`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'फ्रीलांसिंग एवं प्रति घंटा फीस (Freelance & Hourly Rate)' : 'Freelancing & Hourly Rate Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'इच्छित मासिक आय व बिल योग्य घंटों के आधार पर सही प्रति घंटा दर, दिन की दर व 194J टीडीएस'
              : 'Calculate required billable hourly and day rates, taking leaves, taxes, and 194J TDS into account'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'इच्छित मासिक इन-हैंड आय (Target Income ₹)' : 'Target Monthly In-Hand (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={desiredIncome}
                  onChange={(e) => setDesiredIncome(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                  placeholder="85000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मासिक बिजनेस टूल्स व खर्चे (₹)' : 'Monthly Business Overheads (₹)'}
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
                  placeholder="12000"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Software, WiFi, Coworking, CA fees</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'बिल योग्य घंटे/हफ्ता' : 'Billable Hrs / Week'}
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={billableHours}
                onChange={(e) => setBillableHours(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="25"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Realistic is 20-30 hrs</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'छुट्टी के हफ्ते/साल' : 'Weeks Off / Year'}
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={weeksOff}
                onChange={(e) => setWeeksOff(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="4"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Vacation & sick leave buffer</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'टैक्स बफर (%)' : 'Tax Buffer %'}
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={taxBuffer}
                onChange={(e) => setTaxBuffer(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="10"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Sec 44ADA (50% profit)</span>
            </div>
          </div>

          {/* Section 194J TDS Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="tds-194j-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                {lang === 'hi' ? 'क्लाइंट इनवॉइस पर 194J TDS कटौती जोड़ें' : 'Calculate Section 194J TDS Withholding'}
              </label>
              <input
                id="tds-194j-toggle"
                type="checkbox"
                checked={applyTds}
                onChange={(e) => setApplyTds(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>
            {applyTds && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">TDS Rate:</span>
                <button
                  type="button"
                  onClick={() => setTdsRate(10)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                    tdsRate === 10
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  10% (Professional Fees)
                </button>
                <button
                  type="button"
                  onClick={() => setTdsRate(2)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                    tdsRate === 2
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  2% (Technical Services)
                </button>
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
            title={lang === 'hi' ? 'अनुशंसित फ्रीलांस दर रिपोर्ट' : 'Freelance Pricing Sheet'}
            primaryLabel={lang === 'hi' ? 'न्यूनतम प्रति घंटा दर (Hourly Rate)' : 'Minimum Required Hourly Rate'}
            primaryValue={`₹${formatNumberIN(result.hourlyRate, 0)}/hr`}
            numericPrimaryValue={result.hourlyRate}
            statusBadge={`₹${formatNumberIN(result.dayRate, 0)}/Day`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'दैनिक दर (8 घंटे का दिन)' : 'Day Rate (8 Hours)',
                value: `₹${formatNumberIN(result.dayRate, 0)}/day`,
                isHighlight: true,
                isPositive: true,
              },
              {
                label: lang === 'hi' ? 'वार्षिक कुल बिलिंग लक्ष्य' : 'Required Annual Billing',
                value: formatINR(result.requiredAnnualRevenue),
              },
              {
                label: lang === 'hi' ? 'साल में बिल योग्य कुल घंटे' : 'Billable Hours / Year',
                value: `${result.totalBillableHoursPerYear} Hours`,
                subtext: `${result.effectiveWorkingWeeks} working weeks`,
              },
              {
                label: lang === 'hi' ? '₹1 Lakh बिल पर 194J TDS' : 'TDS on ₹1L Invoice',
                value: `-${formatINR(result.tdsDeductionOn100k)} (${tdsRate}%)`,
                isNegative: true,
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Freelancer Hourly Rate Math & Section 44ADA / 194J Rules"
        titleHi="फ्रीलांसिंग प्रति घंटा दर एवं धारा 44ADA / 194J नियम"
        formulaEn={[
          'Gross Revenue Needed = (Monthly Take-Home + Monthly Overheads) ÷ [1 - (Tax % ÷ 100)] × 12',
          'Total Billable Hours = (52 Weeks - Weeks Off) × Billable Hours per Week',
          'Minimum Hourly Rate = Gross Revenue Needed ÷ Total Billable Hours',
          'Day Rate = Hourly Rate × 8 Hours',
          'Under Section 194J, Indian clients deduct 10% TDS on professional invoices (refundable via ITR filing).',
        ]}
        formulaHi={[
          'वार्षिक आवश्यक ग्रॉस बिलिंग = (मासिक बचत + मासिक बिजनेस खर्चे) ÷ [1 - (टैक्स % ÷ 100)] × 12',
          'साल में कुल बिल योग्य घंटे = (52 हफ्ते - छुट्टी के हफ्ते) × प्रति हफ्ता बिल योग्य घंटे',
          'न्यूनतम प्रति घंटा दर = वार्षिक ग्रॉस बिलिंग ÷ साल में कुल बिल योग्य घंटे',
          'दिन की दर = प्रति घंटा दर × 8 घंटे',
          'धारा 194J के तहत भारतीय क्लाइंट ₹30,000 से अधिक के इनवॉइस पर 10% टीडीएस काटते हैं (जो आईटीआर में वापस मिल जाता है)।',
        ]}
        notesEn={[
          'Most freelancers mistakenly assume 40 billable hours/week. In reality, 15-20 hours go into non-billable client pitches, admin, and invoices.',
        ]}
        notesHi={[
          'सप्ताह में 40 घंटे काम करने का मतलब 40 बिल योग्य घंटे नहीं होता। कम से कम 10-15 घंटे नए क्लाइंट ढूंढने व मीटिंग्स में चले जाते हैं।',
        ]}
      />
    </div>
  );
};
