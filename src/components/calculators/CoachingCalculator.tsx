import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateCoaching } from '../../utils/calculations';
import { formatINR, formatNumberIN, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface CoachingCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const CoachingCalculator: React.FC<CoachingCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [batches, setBatches] = useState<number | ''>(3);
  const [studentsPerBatch, setStudentsPerBatch] = useState<number | ''>(25);
  const [feePerStudent, setFeePerStudent] = useState<number | ''>(2000);
  const [teacherSalary, setTeacherSalary] = useState<number | ''>(16000);
  const [classroomRent, setClassroomRent] = useState<number | ''>(22000);
  const [electricityAc, setElectricityAc] = useState<number | ''>(6000);
  const [notesPrinting, setNotesPrinting] = useState<number | ''>(120);
  const [misc, setMisc] = useState<number | ''>(3500);

  const result = useMemo(() => {
    return calculateCoaching({
      numberOfBatches: Number(batches) || 1,
      studentsPerBatch: Number(studentsPerBatch) || 0,
      monthlyFeePerStudent: Number(feePerStudent) || 0,
      teacherSalaryPerBatch: Number(teacherSalary) || 0,
      classroomRentMonthly: Number(classroomRent) || 0,
      electricityAndAcMonthly: Number(electricityAc) || 0,
      notesPrintingPerStudent: Number(notesPrinting) || 0,
      miscExpenses: Number(misc) || 0,
    });
  }, [batches, studentsPerBatch, feePerStudent, teacherSalary, classroomRent, electricityAc, notesPrinting, misc]);

  const handleReset = () => {
    setBatches(2);
    setStudentsPerBatch(20);
    setFeePerStudent(1800);
    setTeacherSalary(14000);
    setClassroomRent(18000);
    setElectricityAc(5000);
    setNotesPrinting(100);
    setMisc(2500);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'coaching',
      title: lang === 'hi' ? 'कोचिंग संस्थान मुनाफा' : 'Coaching Institute Profit',
      inputsSummary: `${batches} Batches, ${result.totalStudents} Students @ ₹${feePerStudent}/mo`,
      resultSummary: `Profit: ${formatINR(result.netMonthlyProfit)}/mo (${formatPercent(result.profitMarginPercent)} margin), Revenue: ${formatINR(result.grossMonthlyRevenue)}`,
      details: {
        Batches: Number(batches) || 0,
        'Total Students': result.totalStudents,
        'Gross Fees': result.grossMonthlyRevenue,
        'Teacher Expenses': result.facultyExpenses,
        'Classroom Rent': Number(classroomRent) || 0,
        'Net Profit': result.netMonthlyProfit,
        'Profit / Student': result.profitPerStudent,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Coaching Institute Monthly P&L*\n• Enrolled Students: ${result.totalStudents} across ${batches} batches\n• Fee per Student: ${formatINR(Number(feePerStudent) || 0)}/month\n-----------------------\n*Gross Fees Collected:* ${formatINR(result.grossMonthlyRevenue)}\n• Faculty Payouts (${batches} batches): -${formatINR(result.facultyExpenses)}\n• Classroom Rent & Power: -${formatINR((Number(classroomRent) || 0) + (Number(electricityAc) || 0))}\n• Notes & Materials: -${formatINR(result.totalPrintingCost)}\n*Total Operating Costs:* -${formatINR(result.totalMonthlyExpenses)}\n-----------------------\n*Net Monthly Profit:* ${formatINR(result.netMonthlyProfit)} (${formatPercent(result.profitMarginPercent)})\n*Profit per Student:* ${formatINR(result.profitPerStudent)}/student`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'कोचिंग संस्थान एवं ट्यूशन मुनाफा कैलकुलेटर' : 'Coaching & Tuition Institute Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'बैच संख्या, छात्र फीस, शिक्षक मानदेय, क्लासरूम किराया, नोट्स छपाई व मासिक शुद्ध बचत'
              : 'Calculate coaching batch revenue, teacher payout expenses, rent, and net profit per student'}
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
              {lang === 'hi' ? '1. बैच एवं छात्र संख्या (Batches & Students)' : '1. Batches & Student Fees'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'कुल बैच संख्या' : 'No. of Batches'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={batches}
                  onChange={(e) => setBatches(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'छात्र प्रति बैच' : 'Students / Batch'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={studentsPerBatch}
                  onChange={(e) => setStudentsPerBatch(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'मासिक फीस / छात्र (₹)' : 'Monthly Fee / Student'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={feePerStudent}
                    onChange={(e) => setFeePerStudent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] pl-6 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '2. संस्थान खर्चे (Coaching Operating Costs)' : '2. Coaching Operating Costs'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'शिक्षक मानदेय / बैच (₹)' : 'Teacher Salary / Batch (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={teacherSalary}
                    onChange={(e) => setTeacherSalary(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="16000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'क्लासरूम किराया (₹/माह)' : 'Classroom Rent / Month (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={classroomRent}
                    onChange={(e) => setClassroomRent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="22000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'बिजली व एसी बिल (₹/माह)' : 'Electricity & AC (₹/mo)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={electricityAc}
                  onChange={(e) => setElectricityAc(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="6000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'नोट्स व टेस्ट छपाई / छात्र (₹)' : 'Notes Printing / Student (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={notesPrinting}
                  onChange={(e) => setNotesPrinting(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="120"
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
            title={lang === 'hi' ? 'कोचिंग मासिक लाभ-हानि रिपोर्ट' : 'Coaching Profit Statement'}
            primaryLabel={lang === 'hi' ? 'मासिक शुद्ध बचत / मुनाफा' : 'Net Monthly Institute Profit'}
            primaryValue={formatINR(result.netMonthlyProfit)}
            numericPrimaryValue={result.netMonthlyProfit}
            statusBadge={`${formatPercent(result.profitMarginPercent)} Margin`}
            statusType={result.netMonthlyProfit >= 0 ? 'profit' : 'loss'}
            items={[
              {
                label: lang === 'hi' ? 'कुल मासिक फीस संग्रह' : 'Gross Monthly Fees',
                value: formatINR(result.grossMonthlyRevenue),
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'कुल छात्र संख्या' : 'Total Students',
                value: `${result.totalStudents} Students`,
                subtext: `${batches} batches × ${studentsPerBatch}`,
              },
              {
                label: lang === 'hi' ? 'कुल शिक्षक मानदेय' : 'Faculty Expenses',
                value: formatINR(result.facultyExpenses),
                isNegative: true,
              },
              {
                label: lang === 'hi' ? 'कुल संचालन खर्चे' : 'Total Operating Costs',
                value: formatINR(result.totalMonthlyExpenses),
                isNegative: true,
              },
              {
                label: lang === 'hi' ? 'प्रति छात्र शुद्ध लाभ' : 'Profit per Student',
                value: `${formatINR(result.profitPerStudent)}/student`,
                isPositive: result.profitPerStudent > 0,
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Coaching & Tuition Financial Planning Formulas"
        titleHi="कोचिंग संस्थान एवं बैच वित्तीय योजना के सूत्र"
        formulaEn={[
          'Total Students = Number of Batches × Students per Batch',
          'Gross Revenue = Total Students × Monthly Fee per Student',
          'Faculty Expense = Number of Batches × Teacher Salary per Batch',
          'Total Operating Costs = Faculty Expense + Classroom Rent + Electricity + (Notes Printing × Total Students) + Misc',
          'Net Monthly Profit = Gross Revenue - Total Operating Costs',
        ]}
        formulaHi={[
          'कुल छात्र = बैच संख्या × प्रति बैच छात्र',
          'सकल फीस आय = कुल छात्र × प्रति छात्र मासिक फीस',
          'शिक्षक मानदेय = कुल बैच × प्रति बैच शिक्षक वेतन',
          'कुल संचालन खर्च = शिक्षक मानदेय + क्लासरूम किराया + बिजली + नोट्स छपाई + अन्य',
          'मासिक शुद्ध मुनाफा = कुल फीस - कुल संचालन खर्च',
        ]}
        notesEn={[
          'Optimizing batch schedules during evening peak hours maximizes classroom rental efficiency.',
        ]}
        notesHi={[
          'एक ही क्लासरूम में अलग-अलग समय पर 3 से 4 बैच चलाने से किराए की प्रति छात्र लागत बहुत कम हो जाती है।',
        ]}
      />
    </div>
  );
};
