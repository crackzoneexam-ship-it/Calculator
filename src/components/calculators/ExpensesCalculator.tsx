import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateExpenses } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface ExpensesCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const ExpensesCalculator: React.FC<ExpensesCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [rent, setRent] = useState<number | ''>(25000);
  const [electricityWater, setElectricityWater] = useState<number | ''>(6000);
  const [salaries, setSalaries] = useState<number | ''>(45000);
  const [supplies, setSupplies] = useState<number | ''>(12000);
  const [marketing, setMarketing] = useState<number | ''>(8000);
  const [maintenance, setMaintenance] = useState<number | ''>(3500);
  const [refreshments, setRefreshments] = useState<number | ''>(2500);
  const [misc, setMisc] = useState<number | ''>(4000);

  const result = useMemo(() => {
    return calculateExpenses({
      rent: Number(rent) || 0,
      electricityWater: Number(electricityWater) || 0,
      salaries: Number(salaries) || 0,
      supplies: Number(supplies) || 0,
      marketing: Number(marketing) || 0,
      maintenance: Number(maintenance) || 0,
      refreshments: Number(refreshments) || 0,
      misc: Number(misc) || 0,
    });
  }, [rent, electricityWater, salaries, supplies, marketing, maintenance, refreshments, misc]);

  const handleReset = () => {
    setRent(0);
    setElectricityWater(0);
    setSalaries(0);
    setSupplies(0);
    setMarketing(0);
    setMaintenance(0);
    setRefreshments(0);
    setMisc(0);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'expenses',
      title: lang === 'hi' ? 'दैनिक एवं मासिक खर्चे' : 'Business Expenses Calc',
      inputsSummary: `Rent: ₹${rent}, Salaries: ₹${salaries}`,
      resultSummary: `Monthly: ${formatINR(result.totalMonthly)}, Daily: ${formatINR(result.dailyRunRate)}/day`,
      details: {
        'Monthly OPEX': result.totalMonthly,
        'Daily Run Rate': result.dailyRunRate,
        'Annual Cost': result.yearlyExpense,
        'Top Expense': `${result.largestExpenseName} (${formatINR(result.largestExpenseAmount)})`,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Monthly Business Operating Cost (OPEX)*\n• Rent: ₹${rent || 0}\n• Salaries: ₹${salaries || 0}\n• Power/Water: ₹${electricityWater || 0}\n• Marketing: ₹${marketing || 0}\n• Supplies & Misc: ₹${(Number(supplies) || 0) + (Number(misc) || 0)}\n-----------------------\n*Total Monthly Expense:* ${formatINR(result.totalMonthly)}\n*Daily Run Rate (Break-even):* ${formatINR(result.dailyRunRate)}/day\n*Annualized Expense:* ${formatINR(result.yearlyExpense)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'व्यापारिक खर्चे एवं संचालन लागत (OPEX)' : 'Business Expenses & Operating Costs (OPEX)'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'दुकान या ऑफिस का किराया, बिजली, वेतन जोड़कर दैनिक व मासिक संचालन खर्च निकालें'
              : 'Calculate monthly fixed operating costs and daily break-even run rate'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'दुकान / ऑफिस किराया (₹)' : 'Shop / Office Rent (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={rent}
                onChange={(e) => setRent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'स्टाफ वेतन / मजदूरी (₹)' : 'Staff Salaries & Wages (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={salaries}
                onChange={(e) => setSalaries(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'बिजली एवं पानी बिल (₹)' : 'Electricity & Water Bill (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={electricityWater}
                onChange={(e) => setElectricityWater(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'सामान एवं पैकेजिंग (₹)' : 'Supplies & Packaging (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={supplies}
                onChange={(e) => setSupplies(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'विज्ञापन एवं प्रचार (₹)' : 'Marketing & Advertising (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={marketing}
                onChange={(e) => setMarketing(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'मरम्मत व मेंटेनेंस (₹)' : 'Maintenance & Repairs (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={maintenance}
                onChange={(e) => setMaintenance(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'चाय-पानी व नाश्ता (₹)' : 'Tea & Refreshments (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={refreshments}
                onChange={(e) => setRefreshments(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'विविध खर्चे (Misc ₹)' : 'Miscellaneous Expenses (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={misc}
                onChange={(e) => setMisc(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
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
        <div className="lg:col-span-5 space-y-4">
          <ResultCard
            lang={lang}
            title={lang === 'hi' ? 'मासिक संचालन लागत सारांश' : 'Monthly OPEX Summary'}
            primaryLabel={lang === 'hi' ? 'कुल मासिक खर्च (Monthly OPEX)' : 'Total Monthly Operating Cost'}
            primaryValue={formatINR(result.totalMonthly)}
            numericPrimaryValue={result.totalMonthly}
            statusBadge={`${formatINR(result.dailyRunRate)}/day`}
            statusType="neutral"
            items={[
              {
                label: lang === 'hi' ? 'दैनिक लागत दर (Daily Run Rate)' : 'Daily Run Rate (30 Days)',
                value: `${formatINR(result.dailyRunRate)}/day`,
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'वार्षिक कुल खर्च (Annual)' : 'Annualized Expenses',
                value: formatINR(result.yearlyExpense),
              },
              {
                label: lang === 'hi' ? 'सबसे बड़ा खर्च' : 'Top Expense Head',
                value: result.largestExpenseName,
                subtext: formatINR(result.largestExpenseAmount),
              },
              {
                label: lang === 'hi' ? 'वेतन हिस्सा %' : 'Salaries Share',
                value: formatPercent(
                  result.totalMonthly > 0 ? ((Number(salaries) || 0) / result.totalMonthly) * 100 : 0
                ),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />

          {/* Expense share list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {lang === 'hi' ? 'खर्चों का प्रतिशत विभाजन' : 'Expense Category Share'}
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {result.breakdown
                .filter((b) => b.amount > 0)
                .map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="truncate">{b.name}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatINR(b.amount)} ({formatPercent(b.percent, 1)})
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="OPEX and Daily Run Rate Importance"
        titleHi="संचालन लागत और दैनिक ब्रेक-ईवन दर का महत्व"
        formulaEn={[
          'Total Monthly OPEX = Sum of all recurring shop/office monthly overheads',
          'Daily Run Rate = Total Monthly OPEX ÷ 30 Days',
          'Daily Minimum Gross Profit required = Daily Run Rate (Just to cover costs before making profit)',
          'Annualized Cost = Monthly OPEX × 12',
        ]}
        formulaHi={[
          'कुल मासिक खर्च = दुकान या संस्थान के सभी आवर्ती खर्चों का योग',
          'दैनिक संचालन दर = कुल मासिक खर्च ÷ 30 दिन',
          'प्रतिदिन न्यूनतम सकल लाभ = दैनिक संचालन दर (दुकान का शटर खुला रखने की अनिवार्य लागत)',
          'वार्षिक खर्च = मासिक खर्च × 12',
        ]}
        notesEn={[
          'Knowing your daily run rate ensures you never price products below your minimum daily operating threshold.',
        ]}
        notesHi={[
          'दैनिक संचालन दर जानने से आपको पता रहता है कि दुकान का खर्च निकालने के लिए रोज कम से कम कितना मुनाफा कमाना अनिवार्य है।',
        ]}
      />
    </div>
  );
};
