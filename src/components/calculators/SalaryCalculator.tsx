import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateSalary } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface SalaryCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [grossSalary, setGrossSalary] = useState<number | ''>(65000);
  const [basicPercent, setBasicPercent] = useState<number | ''>(50);
  const [hraPercent, setHraPercent] = useState<number | ''>(20);
  const [isEpUncapped, setIsEpUncapped] = useState<boolean>(false);
  const [pt, setPt] = useState<number | ''>(200);
  const [tds, setTds] = useState<number | ''>(1500);
  const [serviceYears, setServiceYears] = useState<number | ''>(5);

  const result = useMemo(() => {
    return calculateSalary({
      monthlyGrossSalary: Number(grossSalary) || 0,
      basicPayPercent: Number(basicPercent) || 40,
      hraPercent: Number(hraPercent) || 20,
      isEpUncapped,
      professionalTax: Number(pt) || 0,
      estimatedMonthlyTds: Number(tds) || 0,
      yearsOfServiceForGratuity: Number(serviceYears) || 0,
    });
  }, [grossSalary, basicPercent, hraPercent, isEpUncapped, pt, tds, serviceYears]);

  const handleReset = () => {
    setGrossSalary(50000);
    setBasicPercent(40);
    setHraPercent(20);
    setIsEpUncapped(false);
    setPt(200);
    setTds(1000);
    setServiceYears(5);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'salary',
      title: lang === 'hi' ? 'वेतन एवं इन-हैंड पेरोल' : 'Salary & Payroll Calc',
      inputsSummary: `Gross: ₹${grossSalary}, Basic: ${basicPercent}%, EPF Cap: ${!isEpUncapped}`,
      resultSummary: `In-Hand: ${formatINR(result.netInHandSalary)}/mo (Deductions: ${formatINR(result.totalDeductions)})`,
      details: {
        'Monthly Gross': Number(grossSalary) || 0,
        'Basic Pay': result.basicPay,
        'Employee EPF (12%)': result.employeePf,
        'Professional Tax': result.professionalTax,
        TDS: result.monthlyTds,
        'Net In-Hand': result.netInHandSalary,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Indian Salary Slip Breakdown*\n• Gross Monthly Salary: ${formatINR(Number(grossSalary) || 0)}\n• Basic Pay (${basicPercent}%): ${formatINR(result.basicPay)}\n• HRA (${hraPercent}%): ${formatINR(result.hra)}\n• Special Allowance: ${formatINR(result.specialAllowance)}\n-----------------------\n*Deductions:*\n• Employee PF (12%): -${formatINR(result.employeePf)}\n• Professional Tax (PT): -${formatINR(result.professionalTax)}\n• Income Tax (TDS): -${formatINR(result.monthlyTds)}\n*Total Deductions:* -${formatINR(result.totalDeductions)}\n-----------------------\n*Net Take-Home Salary (In-Hand):* ${formatINR(result.netInHandSalary)}/month${
    result.gratuityAmount ? `\n• Estimated Gratuity (${serviceYears} yrs): ${formatINR(result.gratuityAmount)}` : ''
  }`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'वेतन एवं पेरोल कैलकुलेटर (CTC to In-Hand)' : 'Salary & Payroll Calculator (In-Hand)'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'मासिक सीटीसी से इन-हैंड वेतन: मूल वेतन, एचआरए, पीएफ (EPF 12%), व्यवसाय कर (PT) व ग्रेच्युटी'
              : 'Calculate monthly in-hand take-home salary, employee/employer EPF, PT, and gratuity'}
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
              {lang === 'hi' ? 'मासिक कुल वेतन (Gross Monthly Salary ₹)' : 'Gross Monthly Salary (₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                placeholder="65000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मूल वेतन (Basic Pay %)' : 'Basic Pay % of Gross'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="80"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(e.target.value === '' ? '' : Math.max(10, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="50"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Indian standard is 40% - 50%</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मकान किराया भत्ता (HRA %)' : 'House Rent Allowance (HRA %)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={hraPercent}
                  onChange={(e) => setHraPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="20"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* EPF Ceiling Options */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="epf-cap-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                {lang === 'hi' ? 'वास्तविक मूल वेतन पर पीएफ काटें (Uncapped EPF)' : 'Deduct PF on Full Actual Basic'}
              </label>
              <input
                id="epf-cap-toggle"
                type="checkbox"
                checked={isEpUncapped}
                onChange={(e) => setIsEpUncapped(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </div>
            <span className="text-[11px] text-slate-500 block">
              {isEpUncapped
                ? lang === 'hi'
                  ? 'पीएफ वास्तविक मूल वेतन के 12% पर कटेगा (अधिक पीएफ संचय)'
                  : 'Deducting 12% on full basic salary (higher retirement savings)'
                : lang === 'hi'
                ? 'ईपीएफओ मानक ₹15,000 मासिक सीलिंग कैप लागू (अधिकतम पीएफ = ₹1,800/माह)'
                : 'Using standard ₹15,000 statutory wage ceiling (Max PF = ₹1,800/mo)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'व्यवसाय कर (PT ₹)' : 'Professional Tax (PT)'}
              </label>
              <input
                type="number"
                min="0"
                value={pt}
                onChange={(e) => setPt(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'मासिक आयकर (TDS ₹)' : 'Monthly TDS (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={tds}
                onChange={(e) => setTds(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="1500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'नौकरी के वर्ष (Gratuity)' : 'Service (Years)'}
              </label>
              <input
                type="number"
                min="0"
                value={serviceYears}
                onChange={(e) => setServiceYears(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="5"
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
            title={lang === 'hi' ? 'वेतन पर्ची (Pay Slip)' : 'Monthly Pay Slip'}
            primaryLabel={lang === 'hi' ? 'हाथ में आने वाला इन-हैंड वेतन' : 'Net Take-Home Salary (In-Hand)'}
            primaryValue={`${formatINR(result.netInHandSalary)}/mo`}
            numericPrimaryValue={result.netInHandSalary}
            statusBadge={`Gross ${formatINR(Number(grossSalary) || 0)}`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'कर्मचारी पीएफ (12% EPF)' : 'Employee PF (12%)',
                value: formatINR(result.employeePf),
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'कंपनी पीएफ शेयर' : 'Employer PF Match',
                value: formatINR(result.employerPf),
              },
              {
                label: lang === 'hi' ? 'मूल वेतन (Basic Pay)' : 'Basic Pay Component',
                value: formatINR(result.basicPay),
              },
              {
                label: lang === 'hi' ? 'एचआरए (HRA)' : 'HRA Allowance',
                value: formatINR(result.hra),
              },
              {
                label: lang === 'hi' ? 'कुल मासिक कटौती' : 'Total Deductions',
                value: formatINR(result.totalDeductions),
                isNegative: true,
              },
              {
                label: lang === 'hi' ? 'ग्रेच्युटी अनुमान' : 'Gratuity Estimate',
                value: result.gratuityAmount ? formatINR(result.gratuityAmount) : 'Eligible after 5 yrs',
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="EPF, PT & Gratuity Act Formulas (Indian Labor Law)"
        titleHi="ईपीएफ (EPF), व्यवसाय कर और ग्रेच्युटी के कानूनी सूत्र"
        formulaEn={[
          'Employee EPF = 12% of Basic Pay (Statutory cap is ₹15,000/month basic = ₹1,800/mo)',
          'Net In-Hand Salary = Gross Salary - Employee EPF - Professional Tax (PT) - Monthly TDS',
          'Employer EPF = 12% match (divided into 8.33% EPS pension + 3.67% EPF)',
          'Gratuity Formula (Payment of Gratuity Act 1972) = (15 × Last Drawn Basic × Years of Service) ÷ 26',
        ]}
        formulaHi={[
          'कर्मचारी पीएफ = मूल वेतन का 12% (वैधानिक नियम अनुसार ₹15,000 की सीलिंग पर अधिकतम ₹1,800/माह)',
          'इन-हैंड वेतन = कुल ग्रॉस वेतन - कर्मचारी पीएफ - व्यवसाय कर (PT) - टीडीएस',
          'कंपनी पीएफ = 12% (जिसमें 8.33% पेंशन ईपीएस और 3.67% पीएफ फंड में जाता है)',
          'ग्रेच्युटी सूत्र = (15 × अंतिम मूल वेतन × नौकरी के वर्ष) ÷ 26 (कम से कम 5 वर्ष की सेवा पर देय)',
        ]}
        notesEn={[
          'Dividing by 26 in Gratuity accounts for working days in a month excluding Sundays as per labor court ruling.',
        ]}
        notesHi={[
          'ग्रेच्युटी सूत्र में 26 से भाग इसलिए दिया जाता है क्योंकि रविवार छोड़कर महीने में 26 कार्य दिवस माने जाते हैं।',
        ]}
      />
    </div>
  );
};
