import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateRetailKirana } from '../../utils/calculations';
import { formatINR, formatNumberIN, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface RetailKiranaCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const RetailKiranaCalculator: React.FC<RetailKiranaCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [subType, setSubType] = useState<'loose_weight' | 'carton_margin'>('loose_weight');

  // Loose weighing state
  const [looseMode, setLooseMode] = useState<'grams_to_rupees' | 'rupees_to_grams'>('grams_to_rupees');
  const [ratePerKg, setRatePerKg] = useState<number | ''>(80);
  const [targetGrams, setTargetGrams] = useState<number | ''>(250);
  const [targetMoney, setTargetMoney] = useState<number | ''>(50);

  // Carton margin state
  const [cartonCost, setCartonCost] = useState<number | ''>(1200);
  const [unitsInCarton, setUnitsInCarton] = useState<number | ''>(24);
  const [mrpPerUnit, setMrpPerUnit] = useState<number | ''>(65);

  const result = useMemo(() => {
    return calculateRetailKirana({
      subType,
      ratePerKg: Number(ratePerKg) || 0,
      targetGrams: Number(targetGrams) || 0,
      targetMoney: Number(targetMoney) || 0,
      mode: looseMode,
      cartonCost: Number(cartonCost) || 0,
      unitsInCarton: Number(unitsInCarton) || 1,
      mrpPerUnit: Number(mrpPerUnit) || 0,
    });
  }, [subType, looseMode, ratePerKg, targetGrams, targetMoney, cartonCost, unitsInCarton, mrpPerUnit]);

  const handleReset = () => {
    if (subType === 'loose_weight') {
      setRatePerKg(80);
      setTargetGrams(250);
      setTargetMoney(50);
    } else {
      setCartonCost(1000);
      setUnitsInCarton(20);
      setMrpPerUnit(60);
    }
  };

  const handleCalculateAndSave = () => {
    if (subType === 'loose_weight') {
      onSaveHistory({
        calculatorId: 'retail_kirana',
        title: lang === 'hi' ? 'किराना तौल गणना' : 'Kirana Weight Calc',
        inputsSummary: `₹${ratePerKg}/kg, ${looseMode === 'grams_to_rupees' ? `${targetGrams}g` : `₹${targetMoney}`}`,
        resultSummary: looseMode === 'grams_to_rupees' ? formatINR(result.calculatedValue) : `${formatNumberIN(result.calculatedValue, 1)}g`,
        details: {
          'Rate/kg': Number(ratePerKg) || 0,
          Mode: looseMode,
          Result: result.calculatedValue,
        },
      });
    } else {
      onSaveHistory({
        calculatorId: 'retail_kirana',
        title: lang === 'hi' ? 'कार्टन पेटी मार्जिन' : 'Carton Margin Calc',
        inputsSummary: `Carton: ₹${cartonCost}, Units: ${unitsInCarton}, MRP: ₹${mrpPerUnit}`,
        resultSummary: `Profit: ${formatINR(result.cartonProfit || 0)} (${formatPercent(result.cartonMarginPercent || 0)})`,
        details: {
          'Carton Cost': Number(cartonCost) || 0,
          Units: Number(unitsInCarton) || 0,
          'Total Profit': result.cartonProfit || 0,
        },
      });
    }
  };

  const whatsappMessage =
    subType === 'loose_weight'
      ? `*BizCalc Pro - Kirana Store Weight Calculation*\n• Item Rate: ₹${ratePerKg}/kg (₹${((Number(ratePerKg) || 0) / 10).toFixed(2)} per 100g)\n• ${
          looseMode === 'grams_to_rupees'
            ? `Customer Weight: ${targetGrams} grams\n*Payable Amount:* ${formatINR(result.calculatedValue)}`
            : `Customer Budget: ₹${targetMoney}\n*Weight to give:* ${formatNumberIN(result.calculatedValue, 1)} grams (${(result.calculatedValue / 1000).toFixed(3)} kg)`
        }`
      : `*BizCalc Pro - Wholesale Carton Profit*\n• Box Cost: ₹${cartonCost || 0} (${unitsInCarton || 0} units)\n• Cost per unit: ${formatINR(result.costPerUnit || 0)}\n• Retail MRP: ₹${mrpPerUnit || 0}\n• Total Box Revenue: ${formatINR(result.totalCartonMrp || 0)}\n*Total Box Profit:* ${formatINR(result.cartonProfit || 0)} (${formatPercent(result.cartonMarginPercent || 0)})\n*Profit per packet:* ${formatINR(result.profitPerUnit || 0)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'किराना एवं खुदरा दुकान (Retail & Kirana)' : 'Retail & Kirana Store Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'खुले सामान का भाव (किलो से ग्राम / रुपए से वजन) व थोक पेटी/कार्टन का पैकेट मार्जिन'
              : 'Weight-to-rupees weighing scale calculator and wholesale carton/box packet margins'}
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

      {/* Main Switcher: Loose Item vs Carton Margin */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setSubType('loose_weight')}
          className={`py-2 px-3 rounded-xl transition-all text-center ${
            subType === 'loose_weight'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'खुला सामान / तौल (Weighing)' : 'Loose Item / Weighing'}
        </button>
        <button
          type="button"
          onClick={() => setSubType('carton_margin')}
          className={`py-2 px-3 rounded-xl transition-all text-center ${
            subType === 'carton_margin'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'पेटी / कार्टन मार्जिन (Carton)' : 'Carton / Box Margin'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          {subType === 'loose_weight' ? (
            <>
              {/* Loose Item Mode */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'ग्राहक क्या मांग रहा है?' : 'Customer Request Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setLooseMode('grams_to_rupees')}
                    className={`py-2 px-2 rounded-lg font-medium transition-all text-center ${
                      looseMode === 'grams_to_rupees'
                        ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lang === 'hi' ? 'वजन दिया है (उदा. 250 ग्राम)' : 'Grams → Price ₹'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLooseMode('rupees_to_grams')}
                    className={`py-2 px-2 rounded-lg font-medium transition-all text-center ${
                      looseMode === 'rupees_to_grams'
                        ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lang === 'hi' ? 'रुपए दिए हैं (उदा. ₹50 का)' : 'Rupees ₹ → Grams'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'प्रति किलो भाव (Rate per Kg ₹)' : 'Rate per Kilogram (₹/Kg)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={ratePerKg}
                    onChange={(e) => setRatePerKg(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    placeholder="80"
                  />
                </div>
              </div>

              {looseMode === 'grams_to_rupees' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'तौल वजन (Grams)' : 'Weight in Grams'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetGrams}
                    onChange={(e) => setTargetGrams(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="250"
                  />
                  {/* Quick grams presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[50, 100, 250, 500, 750, 1000].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setTargetGrams(g)}
                        className="px-2 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                      >
                        {g >= 1000 ? '1 kg' : `${g}g`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'ग्राहक का बजट (Rupees ₹)' : 'Customer Amount (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={targetMoney}
                      onChange={(e) => setTargetMoney(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="50"
                    />
                  </div>
                  {/* Quick money presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[10, 20, 50, 100, 200, 500].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTargetMoney(m)}
                        className="px-2 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                      >
                        ₹{m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Carton / Box Mode */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'पेटी / कार्टन खरीद लागत (₹)' : 'Carton / Box Wholesale Cost (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={cartonCost}
                    onChange={(e) => setCartonCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'पेटी में कुल पीस / पैकेट' : 'Units / Packets in Carton'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={unitsInCarton}
                    onChange={(e) => setUnitsInCarton(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="24"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'प्रति पैकेट प्रिंट एमआरपी (₹)' : 'MRP Printed per unit (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={mrpPerUnit}
                      onChange={(e) => setMrpPerUnit(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="65"
                    />
                  </div>
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
          {subType === 'loose_weight' ? (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'किराना तौल परिणाम' : 'Weighing Scale Result'}
              primaryLabel={
                looseMode === 'grams_to_rupees'
                  ? lang === 'hi'
                    ? 'ग्राहक से लेने योग्य राशि (₹)'
                    : 'Payable Amount (₹)'
                  : lang === 'hi'
                  ? 'ग्राहक को तौल कर देने योग्य वजन'
                  : 'Weight to Dispense'
              }
              primaryValue={
                looseMode === 'grams_to_rupees'
                  ? formatINR(result.calculatedValue)
                  : `${formatNumberIN(result.calculatedValue, 1)} Grams`
              }
              numericPrimaryValue={looseMode === 'grams_to_rupees' ? result.calculatedValue : undefined}
              statusBadge={looseMode === 'grams_to_rupees' ? `${targetGrams}g` : `₹${targetMoney}`}
              statusType="profit"
              items={[
                {
                  label: lang === 'hi' ? 'प्रति 100 ग्राम भाव' : 'Rate per 100g',
                  value: formatINR(((Number(ratePerKg) || 0) / 10)),
                },
                {
                  label: lang === 'hi' ? 'प्रति 250 ग्राम (पाव) भाव' : 'Rate per 250g (Paav)',
                  value: formatINR(((Number(ratePerKg) || 0) / 4)),
                },
                {
                  label: lang === 'hi' ? 'प्रति आधा किलो (500g)' : 'Rate per 500g',
                  value: formatINR(((Number(ratePerKg) || 0) / 2)),
                },
                {
                  label: lang === 'hi' ? 'किलो में वजन' : 'Weight in Kilograms',
                  value:
                    looseMode === 'grams_to_rupees'
                      ? `${((Number(targetGrams) || 0) / 1000).toFixed(3)} kg`
                      : `${(result.calculatedValue / 1000).toFixed(3)} kg`,
                },
              ]}
              whatsappText={whatsappMessage}
              onReset={handleReset}
            />
          ) : (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'पेटी / कार्टन मार्जिन सारांश' : 'Carton Profit Statement'}
              primaryLabel={lang === 'hi' ? 'पेटी पर कुल मुनाफा (Box Profit)' : 'Total Box Profit'}
              primaryValue={formatINR(result.cartonProfit || 0)}
              numericPrimaryValue={result.cartonProfit || 0}
              statusBadge={`${formatPercent(result.cartonMarginPercent || 0)} Margin`}
              statusType="profit"
              items={[
                {
                  label: lang === 'hi' ? 'प्रति पैकेट खरीद लागत' : 'Cost per Packet',
                  value: formatINR(result.costPerUnit || 0),
                },
                {
                  label: lang === 'hi' ? 'प्रति पैकेट मुनाफा' : 'Profit per Packet',
                  value: formatINR(result.profitPerUnit || 0),
                  isHighlight: true,
                  isPositive: true,
                },
                {
                  label: lang === 'hi' ? 'कुल पेटी एमआरपी बिक्री' : 'Total Box Retail MRP',
                  value: formatINR(result.totalCartonMrp || 0),
                },
                {
                  label: lang === 'hi' ? 'रिटेल मार्जिन %' : 'Retail Margin %',
                  value: formatPercent(result.cartonMarginPercent || 0),
                  isPositive: true,
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
        titleEn="Kirana Calculations & Paav/Aadha Kg Ratios"
        titleHi="किराना तौल सूत्र एवं पाव/आधा किलो अनुपात"
        formulaEn={[
          'Grams to Rupees: Price = (Rate per Kg ÷ 1000) × Weight in Grams',
          'Rupees to Grams: Grams = (Amount in ₹ ÷ Rate per Kg) × 1000',
          '1 Paav = 250 grams (1/4 kg); 1 Aadha Kilo = 500 grams (1/2 kg)',
          'Carton Profit = (Units in Carton × MRP) - Carton Purchase Cost',
        ]}
        formulaHi={[
          'ग्राम से मूल्य: देय राशि = (प्रति किलो भाव ÷ 1000) × ग्राम में वजन',
          'रुपए से ग्राम: मिलने वाला वजन = (ग्राहक की राशि ÷ प्रति किलो भाव) × 1000',
          '1 पाव = 250 ग्राम (चौथाई किलो); 1 आधा किलो = 500 ग्राम',
          'पेटी मुनाफा = (पेटी में पीस × एमआरपी) - पेटी खरीद भाव',
        ]}
        notesEn={[
          'Prevents weighing calculation errors during busy shop rush hours.',
        ]}
        notesHi={[
          'भीड़-भाड़ के समय खुले सामान और दाल-चीनी-मसालों का तुरंत सही तौल निकालने के लिए अत्यंत उपयोगी।',
        ]}
      />
    </div>
  );
};
