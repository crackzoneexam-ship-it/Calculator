import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateInventory } from '../../utils/calculations';
import { formatNumberIN, formatINR } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface InventoryCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const InventoryCalculator: React.FC<InventoryCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [annualDemand, setAnnualDemand] = useState<number | ''>(12000);
  const [orderingCost, setOrderingCost] = useState<number | ''>(250);
  const [holdingCost, setHoldingCost] = useState<number | ''>(15);
  const [leadTimeDays, setLeadTimeDays] = useState<number | ''>(7);
  const [dailyUsage, setDailyUsage] = useState<number | ''>(40);
  const [safetyStock, setSafetyStock] = useState<number | ''>(100);
  const [cogs, setCogs] = useState<number | ''>(600000);
  const [avgInventory, setAvgInventory] = useState<number | ''>(75000);

  const result = useMemo(() => {
    return calculateInventory({
      annualDemand: Number(annualDemand) || 0,
      orderingCostPerOrder: Number(orderingCost) || 0,
      holdingCostPerUnitYear: Number(holdingCost) || 1,
      leadTimeDays: Number(leadTimeDays) || 0,
      dailyUsageRate: Number(dailyUsage) || 0,
      safetyStock: Number(safetyStock) || 0,
      cogs: Number(cogs) || 0,
      avgInventoryValue: Number(avgInventory) || 1,
    });
  }, [annualDemand, orderingCost, holdingCost, leadTimeDays, dailyUsage, safetyStock, cogs, avgInventory]);

  const handleReset = () => {
    setAnnualDemand(10000);
    setOrderingCost(200);
    setHoldingCost(10);
    setLeadTimeDays(7);
    setDailyUsage(30);
    setSafetyStock(80);
    setCogs(500000);
    setAvgInventory(50000);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'inventory',
      title: lang === 'hi' ? 'इन्वेंट्री एवं ईओक्यू' : 'Inventory & EOQ',
      inputsSummary: `Demand: ${annualDemand}, Order Cost: ₹${orderingCost}`,
      resultSummary: `EOQ: ${result.eoq} units, Reorder: ${result.reorderLevel} units, DSI: ${result.daysSalesOfInventory} days`,
      details: {
        'Optimal Order (EOQ)': result.eoq,
        'Orders per Year': result.ordersPerYear,
        'Reorder Level': result.reorderLevel,
        'Turnover Ratio': result.stockTurnoverRatio,
        'Days Inventory Held': result.daysSalesOfInventory,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Inventory Stock Analysis*\n• Annual Demand: ${annualDemand} units\n• Optimal Order Batch (EOQ): ${result.eoq} units\n• Recommended Orders/Year: ${result.ordersPerYear}\n-----------------------\n*Reorder Level (Safety Stock):* ${result.reorderLevel} units\n*Stock Turnover Ratio:* ${result.stockTurnoverRatio}x\n*Days Sales of Inventory (DSI):* ${result.daysSalesOfInventory} days`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'इन्वेंट्री एवं स्टॉक प्रबंधन (Inventory & EOQ)' : 'Inventory & Stock Valuation (EOQ)'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'आर्थिक ऑर्डर मात्रा (EOQ), रीऑर्डर स्तर, सुरक्षित स्टॉक एवं स्टॉक टर्नओवर अनुपात'
              : 'Calculate Economic Order Quantity (EOQ), reorder safety point, and turnover cycle'}
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
              {lang === 'hi' ? '1. ईओक्यू (आर्थिक ऑर्डर मात्रा) इनपुट' : '1. Economic Order Quantity (EOQ)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'वार्षिक मांग (Units)' : 'Annual Demand'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={annualDemand}
                  onChange={(e) => setAnnualDemand(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="12000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'ऑर्डर लागत (₹/Order)' : 'Ordering Cost (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={orderingCost}
                  onChange={(e) => setOrderingCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="250"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'रख-रखाव लागत (₹/Yr)' : 'Holding Cost (₹/Yr)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={holdingCost}
                  onChange={(e) => setHoldingCost(e.target.value === '' ? '' : Math.max(0.1, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="15"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '2. रीऑर्डर स्तर (Reorder Level & Safety)' : '2. Reorder Level & Safety Stock'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'दैनिक बिक्री (Units/Day)' : 'Daily Usage Rate'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={dailyUsage}
                  onChange={(e) => setDailyUsage(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'माल आने के दिन (Lead Time)' : 'Lead Time (Days)'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="7"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'सुरक्षित स्टॉक (Buffer)' : 'Safety Stock Units'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={safetyStock}
                  onChange={(e) => setSafetyStock(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? '3. स्टॉक टर्नओवर (Inventory Turnover & DSI)' : '3. Turnover & Days Sales in Inventory'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'वार्षिक बिका माल लागत (COGS ₹)' : 'Annual COGS (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="600000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === 'hi' ? 'औसत इन्वेंट्री मूल्य (₹)' : 'Average Inventory Held (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={avgInventory}
                  onChange={(e) => setAvgInventory(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="75000"
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
            title={lang === 'hi' ? 'इन्वेंट्री विश्लेषण रिपोर्ट' : 'Inventory Optimization'}
            primaryLabel={lang === 'hi' ? 'सर्वोत्तम ऑर्डर मात्रा (Optimal EOQ)' : 'Economic Order Quantity (EOQ)'}
            primaryValue={`${formatNumberIN(result.eoq, 0)} Units`}
            statusBadge={`${result.ordersPerYear} Orders/Yr`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'रीऑर्डर स्तर (Reorder Point)' : 'Reorder Level Point',
                value: `${formatNumberIN(result.reorderLevel, 0)} Units`,
                isHighlight: true,
                subtext: 'Reorder when stock hits this',
              },
              {
                label: lang === 'hi' ? 'स्टॉक टर्नओवर अनुपात' : 'Inventory Turnover',
                value: `${result.stockTurnoverRatio}x / year`,
                isPositive: result.stockTurnoverRatio >= 4,
              },
              {
                label: lang === 'hi' ? 'स्टॉक होल्डिंग दिन (DSI)' : 'Days Sales in Inventory',
                value: `${result.daysSalesOfInventory} Days`,
              },
              {
                label: lang === 'hi' ? 'सुरक्षित बफर स्टॉक' : 'Buffer Safety Stock',
                value: `${safetyStock || 0} Units`,
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="EOQ & Reorder Point Formulas"
        titleHi="ईओक्यू (EOQ) और रीऑर्डर स्तर के सूत्र"
        formulaEn={[
          'EOQ = √[(2 × Annual Demand × Ordering Cost) ÷ Holding Cost per Unit per Year]',
          'Reorder Level = (Daily Consumption Rate × Lead Time in Days) + Safety Stock',
          'Inventory Turnover Ratio = Cost of Goods Sold (COGS) ÷ Average Inventory',
          'Days Sales of Inventory (DSI) = 365 ÷ Inventory Turnover Ratio',
        ]}
        formulaHi={[
          'EOQ = √[(2 × वार्षिक मांग × ऑर्डर लागत) ÷ प्रति इकाई वार्षिक रख-रखाव खर्च]',
          'रीऑर्डर स्तर = (दैनिक खपत दर × नया माल आने के दिन) + सुरक्षित स्टॉक',
          'इन्वेंट्री टर्नओवर = बिका माल लागत (COGS) ÷ औसत इन्वेंट्री',
          'माल बिकने के औसत दिन (DSI) = 365 ÷ इन्वेंट्री टर्नओवर',
        ]}
        notesEn={[
          'EOQ minimizes total inventory management costs by balancing bulk shipping discounts against warehouse holding costs.',
        ]}
        notesHi={[
          'ईओक्यू आपको बताता है कि एक बार में कितना माल मंगाना सबसे किफायती रहेगा, ताकि गोदाम किराया भी कम लगे और भाड़ा भी बचे।',
        ]}
      />
    </div>
  );
};
