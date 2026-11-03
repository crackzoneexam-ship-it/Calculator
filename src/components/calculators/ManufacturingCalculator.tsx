import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateManufacturing } from '../../utils/calculations';
import { formatINR, formatNumberIN, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface ManufacturingCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const ManufacturingCalculator: React.FC<ManufacturingCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [rawMaterial, setRawMaterial] = useState<number | ''>(120);
  const [directLabor, setDirectLabor] = useState<number | ''>(45);
  const [machineRate, setMachineRate] = useState<number | ''>(250);
  const [machineHours, setMachineHours] = useState<number | ''>(0.2); // 12 minutes
  const [overhead, setOverhead] = useState<number | ''>(20);
  const [scrapPercent, setScrapPercent] = useState<number | ''>(5);
  const [targetMargin, setTargetMargin] = useState<number | ''>(25);
  const [batchQty, setBatchQty] = useState<number | ''>(500);

  const result = useMemo(() => {
    return calculateManufacturing({
      rawMaterialPerUnit: Number(rawMaterial) || 0,
      directLaborPerUnit: Number(directLabor) || 0,
      machineHourlyRate: Number(machineRate) || 0,
      machineHoursPerUnit: Number(machineHours) || 0,
      factoryOverheadPerUnit: Number(overhead) || 0,
      scrapPercentage: Number(scrapPercent) || 0,
      targetMarginPercent: Number(targetMargin) || 0,
      batchQuantity: Number(batchQty) || 1,
    });
  }, [rawMaterial, directLabor, machineRate, machineHours, overhead, scrapPercent, targetMargin, batchQty]);

  const handleReset = () => {
    setRawMaterial(100);
    setDirectLabor(40);
    setMachineRate(200);
    setMachineHours(0.25);
    setOverhead(15);
    setScrapPercent(5);
    setTargetMargin(20);
    setBatchQty(250);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'manufacturing',
      title: lang === 'hi' ? 'मैन्युफैक्चरिंग इकाई लागत' : 'Manufacturing Unit Cost',
      inputsSummary: `RM: ₹${rawMaterial}, DL: ₹${directLabor}, Batch: ${batchQty}`,
      resultSummary: `Unit Cost: ${formatINR(result.totalUnitCost)}, Quote: ${formatINR(result.recommendedSellingPricePerUnit)} (${formatPercent(Number(targetMargin) || 0)} margin)`,
      details: {
        'Raw Material': Number(rawMaterial) || 0,
        'Direct Labor': Number(directLabor) || 0,
        'Machine Cost': (Number(machineRate) || 0) * (Number(machineHours) || 0),
        'Unit Cost': result.totalUnitCost,
        'Quote Price / Unit': result.recommendedSellingPricePerUnit,
        'Batch Total Quote': result.totalBatchQuote,
        'Batch Profit': result.batchGrossProfit,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Manufacturing & Job Work Quote*\n• Batch Quantity (MOQ): ${batchQty} units\n• Raw Material / Unit: ₹${rawMaterial}\n• Direct Labor / Unit: ₹${directLabor}\n• Machine & Overheads: ₹${((Number(machineRate) || 0) * (Number(machineHours) || 0) + (Number(overhead) || 0)).toFixed(2)}\n• Scrap Allowance (${scrapPercent}%): ₹${result.scrapCostPerUnit}\n-----------------------\n*Total Unit Cost of Production:* ${formatINR(result.totalUnitCost)}\n*Recommended Quote Price / Unit:* ${formatINR(result.recommendedSellingPricePerUnit)} (${targetMargin}% margin)\n*Total Batch Quote (MOQ):* ${formatINR(result.totalBatchQuote)}\n*Estimated Batch Profit:* ${formatINR(result.batchGrossProfit)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'मैन्युफैक्चरिंग एवं जॉब वर्क (Manufacturing & Job Work)' : 'Manufacturing & Job Work Costing'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'कच्चा माल, मजदूरी, मशीन घंटा दर, ओवरहेड, वेस्टेज प्रतिशत जोड़कर प्रति पीस लागत व कोटेशन'
              : 'Calculate unit production cost, machine hour rate, scrap factor, and batch MOQ quotations'}
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
                {lang === 'hi' ? 'कच्चा माल प्रति पीस (Raw Material ₹)' : 'Raw Material per Unit (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={rawMaterial}
                  onChange={(e) => setRawMaterial(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="120"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'प्रत्यक्ष मजदूरी प्रति पीस (Direct Labor ₹)' : 'Direct Labor per Unit (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={directLabor}
                  onChange={(e) => setDirectLabor(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="45"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मशीन घंटा दर (Machine Hourly Rate ₹)' : 'Machine Hourly Rate (₹/Hr)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={machineRate}
                  onChange={(e) => setMachineRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="250"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मशीन समय प्रति पीस (घंटे / Hours)' : 'Cycle Time per Unit (Hours)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.05"
                value={machineHours}
                onChange={(e) => setMachineHours(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="0.2"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">0.2 hr = 12 mins per unit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'फैक्ट्री ओवरहेड (बिजली/सुपरविजन ₹)' : 'Factory Overheads / Unit (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={overhead}
                onChange={(e) => setOverhead(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'वेस्टेज / स्क्रैप अनुमति (%)' : 'Scrap / Wastage Allowance %'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={scrapPercent}
                  onChange={(e) => setScrapPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="5"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'इच्छित लाभ मार्जिन % (Target Margin)' : 'Target Profit Margin %'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="25"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'बैच लॉट संख्या (Batch MOQ)' : 'Batch Lot Quantity (MOQ)'}
              </label>
              <input
                type="number"
                min="1"
                value={batchQty}
                onChange={(e) => setBatchQty(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                placeholder="500"
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
            title={lang === 'hi' ? 'उत्पादन लागत एवं कोटेशन' : 'Manufacturing Cost Sheet'}
            primaryLabel={lang === 'hi' ? 'अनुशंसित कोटेशन भाव प्रति पीस' : 'Recommended Selling Price / Unit'}
            primaryValue={formatINR(result.recommendedSellingPricePerUnit)}
            statusBadge={`${batchQty} Units Batch`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'कुल निर्माण लागत प्रति पीस' : 'Cost of Production / Unit',
                value: formatINR(result.totalUnitCost),
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'पूरे बैच का कुल कोटेशन' : 'Total Batch Quote (MOQ)',
                value: formatINR(result.totalBatchQuote),
              },
              {
                label: lang === 'hi' ? 'पूरे बैच पर कुल मुनाफा' : 'Batch Gross Profit',
                value: formatINR(result.batchGrossProfit),
                isPositive: true,
              },
              {
                label: lang === 'hi' ? 'मशीन रनिंग खर्च प्रति पीस' : 'Machine Cost / Unit',
                value: formatINR((Number(machineRate) || 0) * (Number(machineHours) || 0)),
              },
              {
                label: lang === 'hi' ? 'वेस्टेज स्क्रैप लागत' : 'Scrap Cost / Unit',
                value: formatINR(result.scrapCostPerUnit),
              },
              {
                label: lang === 'hi' ? 'कुल बैच लागत' : 'Total Batch Cost',
                value: formatINR(result.totalBatchCost),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Job Work & Manufacturing Costing Rules"
        titleHi="जॉब वर्क एवं मैन्युफैक्चरिंग लागत निर्धारण के नियम"
        formulaEn={[
          'Base Unit Cost = Raw Material + Direct Labor + (Machine Hourly Rate × Cycle Time Hours) + Overhead',
          'Scrap Factor Cost = Base Unit Cost × (Scrap % ÷ 100)',
          'Total Unit Cost = Base Unit Cost + Scrap Factor Cost',
          'Quotation Price = Total Unit Cost ÷ [1 - (Target Margin % ÷ 100)]',
          'Total Batch Quote = Quotation Price × Batch Lot Quantity',
        ]}
        formulaHi={[
          'मूल इकाई लागत = कच्चा माल + मजदूरी + (मशीन घंटा दर × पीस बनाने के घंटे) + ओवरहेड',
          'स्क्रैप वेस्टेज लागत = मूल इकाई लागत × (वेस्टेज % ÷ 100)',
          'कुल प्रति पीस लागत = मूल इकाई लागत + स्क्रैप लागत',
          'कोटेशन दर = कुल प्रति पीस लागत ÷ [1 - (मार्जिन % ÷ 100)]',
          'कुल बैच कोटेशन = कोटेशन दर × बैच मात्रा',
        ]}
        notesEn={[
          'Factoring machine depreciation and electricity in the machine hourly rate ensures sustainable factory operation.',
        ]}
        notesHi={[
          'मशीन घंटा दर में बिजली, टूल घिसाव और मेंटेनेंस को जरूर जोड़ें ताकि जॉब वर्क घाटे में न जाए।',
        ]}
      />
    </div>
  );
};
