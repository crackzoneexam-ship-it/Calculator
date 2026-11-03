import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateAgricultureMandi } from '../../utils/calculations';
import { formatINR, formatNumberIN } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface AgricultureMandiCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const AgricultureMandiCalculator: React.FC<AgricultureMandiCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [mode, setMode] = useState<'mandi_payout' | 'cultivation_cost'>('mandi_payout');

  // Mandi State
  const [weightQuintals, setWeightQuintals] = useState<number | ''>(100);
  const [ratePerQuintal, setRatePerQuintal] = useState<number | ''>(3200);
  const [bagCount, setBagCount] = useState<number | ''>(200);
  const [hamaliPerBag, setHamaliPerBag] = useState<number | ''>(15);
  const [mandiCessPercent, setMandiCessPercent] = useState<number | ''>(1.5);
  const [weighingCharges, setWeighingCharges] = useState<number | ''>(250);

  // Cultivation State
  const [acreArea, setAcreArea] = useState<number | ''>(5);
  const [seedCost, setSeedCost] = useState<number | ''>(4000);
  const [fertilizerCost, setFertilizerCost] = useState<number | ''>(6500);
  const [pesticideCost, setPesticideCost] = useState<number | ''>(3000);
  const [dieselTractorCost, setDieselTractorCost] = useState<number | ''>(5500);
  const [laborCost, setLaborCost] = useState<number | ''>(6000);
  const [irrigationCost, setIrrigationCost] = useState<number | ''>(2500);
  const [yieldPerAcre, setYieldPerAcre] = useState<number | ''>(18);
  const [marketRate, setMarketRate] = useState<number | ''>(3400);

  const result = useMemo(() => {
    return calculateAgricultureMandi({
      mode,
      weightQuintals: Number(weightQuintals) || 0,
      ratePerQuintal: Number(ratePerQuintal) || 0,
      bagCount: Number(bagCount) || 0,
      hamaliPerBag: Number(hamaliPerBag) || 0,
      mandiCessPercent: Number(mandiCessPercent) || 0,
      weighingCharges: Number(weighingCharges) || 0,
      acreArea: Number(acreArea) || 1,
      seedCost: Number(seedCost) || 0,
      fertilizerCost: Number(fertilizerCost) || 0,
      pesticideCost: Number(pesticideCost) || 0,
      dieselTractorCost: Number(dieselTractorCost) || 0,
      laborCost: Number(laborCost) || 0,
      irrigationCost: Number(irrigationCost) || 0,
      expectedYieldQuintalsPerAcre: Number(yieldPerAcre) || 0,
      expectedMarketRatePerQuintal: Number(marketRate) || 0,
    });
  }, [
    mode,
    weightQuintals,
    ratePerQuintal,
    bagCount,
    hamaliPerBag,
    mandiCessPercent,
    weighingCharges,
    acreArea,
    seedCost,
    fertilizerCost,
    pesticideCost,
    dieselTractorCost,
    laborCost,
    irrigationCost,
    yieldPerAcre,
    marketRate,
  ]);

  const handleReset = () => {
    if (mode === 'mandi_payout') {
      setWeightQuintals(50);
      setRatePerQuintal(3000);
      setBagCount(100);
      setHamaliPerBag(15);
      setMandiCessPercent(1.5);
      setWeighingCharges(200);
    } else {
      setAcreArea(2);
      setSeedCost(3500);
      setFertilizerCost(5000);
      setPesticideCost(2500);
      setDieselTractorCost(4500);
      setLaborCost(5000);
      setIrrigationCost(2000);
      setYieldPerAcre(15);
      setMarketRate(3200);
    }
  };

  const handleCalculateAndSave = () => {
    if (mode === 'mandi_payout') {
      onSaveHistory({
        calculatorId: 'agriculture',
        title: lang === 'hi' ? 'मंडी भुगतान पर्ची' : 'Mandi Payout Slip',
        inputsSummary: `${weightQuintals} Q @ ₹${ratePerQuintal}/Q`,
        resultSummary: `Net Payout: ${formatINR(result.netFarmerPayout || 0)} (Ded: ${formatINR(result.totalDeductions || 0)})`,
        details: {
          Weight: `${weightQuintals} Quintals`,
          Rate: `₹${ratePerQuintal}/Q`,
          Gross: result.grossSaleValue || 0,
          Hamali: result.totalHamali || 0,
          Cess: result.totalCess || 0,
          'Net Payout': result.netFarmerPayout || 0,
        },
      });
    } else {
      onSaveHistory({
        calculatorId: 'agriculture',
        title: lang === 'hi' ? 'फसल खेती मुनाफा' : 'Crop Cultivation Profit',
        inputsSummary: `${acreArea} Acres, Yield: ${yieldPerAcre} Q/Acre`,
        resultSummary: `Net Profit: ${formatINR(result.netFarmerProfit || 0)} (${formatINR(result.profitPerAcre || 0)}/Acre)`,
        details: {
          Acres: Number(acreArea) || 0,
          'Total Cost': result.totalCultivationCost || 0,
          'Gross Revenue': result.expectedGrossRevenue || 0,
          'Net Profit': result.netFarmerProfit || 0,
        },
      });
    }
  };

  const whatsappMessage =
    mode === 'mandi_payout'
      ? `*BizCalc Pro - APMC Mandi Auction Payout Slip*\n• Weight: ${weightQuintals} Quintals (${bagCount} bags)\n• Mandi Rate: ₹${ratePerQuintal}/Quintal\n• Gross Amount: ${formatINR(result.grossSaleValue || 0)}\n• Hamali (Labor): -${formatINR(result.totalHamali || 0)}\n• Mandi Cess / Arhat (${mandiCessPercent}%): -${formatINR(result.totalCess || 0)}\n• Weighing Charges: -${formatINR(Number(weighingCharges) || 0)}\n-----------------------\n*Total Deductions:* -${formatINR(result.totalDeductions || 0)}\n*Net Farmer Payout:* ${formatINR(result.netFarmerPayout || 0)}\n*Effective Rate/Quintal:* ${formatINR(result.netRatePerQuintal || 0)}/Q`
      : `*BizCalc Pro - Farm Cultivation Cost & Profit*\n• Farm Area: ${acreArea} Acres\n• Total Cost of Cultivation: ${formatINR(result.totalCultivationCost || 0)} (${formatINR(result.costPerAcre || 0)}/Acre)\n• Total Expected Crop: ${result.expectedTotalYield} Quintals\n• Expected Gross Revenue: ${formatINR(result.expectedGrossRevenue || 0)}\n-----------------------\n*Net Farmer Profit:* ${formatINR(result.netFarmerProfit || 0)}\n*Net Profit per Acre:* ${formatINR(result.profitPerAcre || 0)}/Acre`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'कृषि एवं मंडी भाव कैलकुलेटर (Agriculture & Mandi)' : 'Agriculture & Mandi Auction Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'कृषि उपज मंडी नीलामी भुगतान, हमाली, सेस/आढ़त कमीशन एवं खेती की कुल लागत व मुनाफा'
              : 'Calculate APMC mandi auction payouts with hamali & cess, or farm cultivation profit per acre'}
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

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode('mandi_payout')}
          className={`py-2 px-3 rounded-xl transition-all text-center ${
            mode === 'mandi_payout'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'मंडी पर्ची / हमाली कटौती' : 'Mandi Auction Payout'}
        </button>
        <button
          type="button"
          onClick={() => setMode('cultivation_cost')}
          className={`py-2 px-3 rounded-xl transition-all text-center ${
            mode === 'cultivation_cost'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'खेती लागत व मुनाफा / एकड़' : 'Crop Cultivation Profit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          {mode === 'mandi_payout' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'फसल वजन (क्विंटल / Quintals)' : 'Crop Weight (Quintals)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={weightQuintals}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value));
                      setWeightQuintals(val);
                      if (typeof val === 'number') {
                        setBagCount(Math.round(val * 2)); // 50kg bags default
                      }
                    }}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    placeholder="100"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">1 Quintal = 100 kg</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'नीलामी भाव (₹ प्रति क्विंटल)' : 'Mandi Rate (₹/Quintal)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={ratePerQuintal}
                      onChange={(e) => setRatePerQuintal(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                      placeholder="3200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'बोरी / कट्टा संख्या (Bags)' : 'Bag / Bora Count'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bagCount}
                    onChange={(e) => setBagCount(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="200"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'हमाली मजदूरी (₹ प्रति बोरी)' : 'Hamali Labor (₹/Bag)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={hamaliPerBag}
                      onChange={(e) => setHamaliPerBag(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="15"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'मंडी सेस / आढ़त कमीशन (%)' : 'Mandi Cess / Arhatiya %'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={mandiCessPercent}
                      onChange={(e) => setMandiCessPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] px-3.5 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="1.5"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'तुलाई व कांटा खर्च (₹)' : 'Weighing / Tulai (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={weighingCharges}
                      onChange={(e) => setWeighingCharges(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="250"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Cultivation Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === 'hi' ? 'खेत का रकबा (एकड़ / Acres)' : 'Farm Area (Acres)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={acreArea}
                    onChange={(e) => setAcreArea(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === 'hi' ? 'अनुमानित पैदावार (क्विंटल/एकड़)' : 'Yield (Quintals/Acre)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={yieldPerAcre}
                    onChange={(e) => setYieldPerAcre(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === 'hi' ? 'अपेक्षित भाव (₹/क्विंटल)' : 'Market Rate (₹/Q)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={marketRate}
                    onChange={(e) => setMarketRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="3400"
                  />
                </div>
              </div>

              <span className="text-xs font-bold text-slate-500 block pt-2 border-t border-slate-100 dark:border-slate-800">
                {lang === 'hi' ? 'प्रति एकड़ खर्चे (₹/Acre Expenses)' : 'Per-Acre Input Costs (₹)'}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'बीज (Seed)' : 'Seed'}</label>
                  <input
                    type="number"
                    min="0"
                    value={seedCost}
                    onChange={(e) => setSeedCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                    placeholder="4000"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'खाद/यूरिया' : 'Fertilizer'}</label>
                  <input
                    type="number"
                    min="0"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                    placeholder="6500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'कीटनाशक' : 'Pesticides'}</label>
                  <input
                    type="number"
                    min="0"
                    value={pesticideCost}
                    onChange={(e) => setPesticideCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'ट्रैक्टर/डीजल' : 'Tractor/Diesel'}</label>
                  <input
                    type="number"
                    min="0"
                    value={dieselTractorCost}
                    onChange={(e) => setDieselTractorCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                    placeholder="5500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'मजदूरी/निराई' : 'Labor'}</label>
                  <input
                    type="number"
                    min="0"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                    placeholder="6000"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'सिंचाई/पानी' : 'Irrigation'}</label>
                  <input
                    type="number"
                    min="0"
                    value={irrigationCost}
                    onChange={(e) => setIrrigationCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                    placeholder="2500"
                  />
                </div>
              </div>
            </>
          )}

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
          {mode === 'mandi_payout' ? (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'मंडी भुगतान पर्ची (Net Payout)' : 'Mandi Settlement Slip'}
              primaryLabel={lang === 'hi' ? 'किसान को मिलने वाली शुद्ध राशि' : 'Net Farmer Bank Payout'}
              primaryValue={formatINR(result.netFarmerPayout || 0)}
              numericPrimaryValue={result.netFarmerPayout || 0}
              statusBadge={`${weightQuintals} Quintals`}
              statusType="profit"
              items={[
                {
                  label: lang === 'hi' ? 'कुल सकल बिक्री (Gross)' : 'Gross Sale Value',
                  value: formatINR(result.grossSaleValue || 0),
                },
                {
                  label: lang === 'hi' ? 'कुल कटौती (हमाली + सेस)' : 'Total Deductions',
                  value: formatINR(result.totalDeductions || 0),
                  isNegative: true,
                },
                {
                  label: lang === 'hi' ? 'हमाली मजदूरी' : 'Hamali Labor',
                  value: formatINR(result.totalHamali || 0),
                  subtext: `${bagCount} bags @ ₹${hamaliPerBag}`,
                },
                {
                  label: lang === 'hi' ? 'मंडी सेस / आढ़त शुल्क' : 'Mandi Cess / Commission',
                  value: formatINR(result.totalCess || 0),
                },
                {
                  label: lang === 'hi' ? 'शुद्ध प्रभावी भाव (Net/Q)' : 'Effective Rate/Quintal',
                  value: `${formatINR(result.netRatePerQuintal || 0)}/Q`,
                  isHighlight: true,
                },
              ]}
              whatsappText={whatsappMessage}
              onReset={handleReset}
            />
          ) : (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'खेती लाभ/हानि रिपोर्ट' : 'Farm Profit Statement'}
              primaryLabel={lang === 'hi' ? 'कुल शुद्ध किसान मुनाफा' : 'Net Farmer Profit'}
              primaryValue={formatINR(result.netFarmerProfit || 0)}
              numericPrimaryValue={result.netFarmerProfit || 0}
              statusBadge={`${formatINR(result.profitPerAcre || 0)}/Acre`}
              statusType="profit"
              items={[
                {
                  label: lang === 'hi' ? 'प्रति एकड़ मुनाफा' : 'Net Profit per Acre',
                  value: formatINR(result.profitPerAcre || 0),
                  isHighlight: true,
                  isPositive: true,
                },
                {
                  label: lang === 'hi' ? 'कुल खेती लागत' : 'Total Cultivation Cost',
                  value: formatINR(result.totalCultivationCost || 0),
                },
                {
                  label: lang === 'hi' ? 'कुल फसल पैदावार' : 'Total Harvest Yield',
                  value: `${result.expectedTotalYield} Quintals`,
                },
                {
                  label: lang === 'hi' ? 'कुल संभावित बिक्री राजस्व' : 'Gross Farm Revenue',
                  value: formatINR(result.expectedGrossRevenue || 0),
                },
              ]}
              whatsappText={whatsappMessage}
              onReset={handleReset}
            />
          )}
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="APMC Mandi Auction & Farming Calculations"
        titleHi="मंडी नीलामी, हमाली कटौती एवं खेती लागत नियम"
        formulaEn={[
          'Gross Sale = Weight in Quintals × Rate per Quintal',
          'Total Hamali = Number of Bags × Hamali Rate per Bag',
          'Mandi Cess = Gross Sale × (Mandi Cess % ÷ 100)',
          'Farmer Net Payout = Gross Sale - Hamali - Mandi Cess - Weighing Charges',
          'Cultivation Profit = Total Revenue - (Cost per Acre × Total Acres)',
        ]}
        formulaHi={[
          'सकल बिक्री = वजन (क्विंटल) × नीलामी भाव (प्रति क्विंटल)',
          'कुल हमाली = बोरियों की संख्या × प्रति बोरी हमाली दर',
          'मंडी सेस / आढ़त = सकल बिक्री × (सेस % ÷ 100)',
          'किसान शुद्ध भुगतान = सकल बिक्री - हमाली - मंडी सेस - कांटा खर्च',
          'खेती मुनाफा = कुल उपज बिक्री - (प्रति एकड़ लागत × कुल एकड़)',
        ]}
        notesEn={[
          'Standard bag in Indian mandis carries 50 kg of grain (2 bags = 1 quintal).',
        ]}
        notesHi={[
          'भारतीय कृषि उपज मंडियों में 1 बोरी अमूमन 50 किलो की होती है (यानी 2 बोरी = 1 क्विंटल)।',
        ]}
      />
    </div>
  );
};
