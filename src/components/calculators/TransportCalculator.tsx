import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateTransport } from '../../utils/calculations';
import { formatINR, formatNumberIN, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface TransportCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const TransportCalculator: React.FC<TransportCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [distanceKm, setDistanceKm] = useState<number | ''>(650);
  const [mileage, setMileage] = useState<number | ''>(4.2);
  const [fuelPrice, setFuelPrice] = useState<number | ''>(90);
  const [tollCharges, setTollCharges] = useState<number | ''>(1800);
  const [driverBhatta, setDriverBhatta] = useState<number | ''>(1500);
  const [loadingUnloading, setLoadingUnloading] = useState<number | ''>(800);
  const [otherOverheads, setOtherOverheads] = useState<number | ''>(500);
  const [freightRate, setFreightRate] = useState<number | ''>(26000);
  const [cargoTonnage, setCargoTonnage] = useState<number | ''>(12);

  const result = useMemo(() => {
    return calculateTransport({
      distanceKm: Number(distanceKm) || 0,
      mileageKmPerLitre: Number(mileage) || 1,
      fuelPricePerLitre: Number(fuelPrice) || 0,
      tollCharges: Number(tollCharges) || 0,
      driverBhatta: Number(driverBhatta) || 0,
      loadingUnloading: Number(loadingUnloading) || 0,
      otherOverheads: Number(otherOverheads) || 0,
      freightRateQuote: Number(freightRate) || 0,
      cargoTonnage: Number(cargoTonnage) || 1,
    });
  }, [distanceKm, mileage, fuelPrice, tollCharges, driverBhatta, loadingUnloading, otherOverheads, freightRate, cargoTonnage]);

  const handleReset = () => {
    setDistanceKm(500);
    setMileage(4);
    setFuelPrice(90);
    setTollCharges(1500);
    setDriverBhatta(1200);
    setLoadingUnloading(600);
    setOtherOverheads(400);
    setFreightRate(22000);
    setCargoTonnage(10);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'transport',
      title: lang === 'hi' ? 'ट्रक ट्रिप भाड़ा व डीजल' : 'Trip Freight & Fuel',
      inputsSummary: `${distanceKm} km, Freight: ₹${freightRate}`,
      resultSummary: `Profit: ${formatINR(result.netTripProfit)} (${formatPercent(result.profitMarginPercent)}), Cost/km: ₹${result.costPerKm}`,
      details: {
        Distance: `${distanceKm} km`,
        'Fuel Cost': result.totalFuelCost,
        'Trip Expense': result.totalTripExpense,
        'Net Profit': result.netTripProfit,
        'Cost/km': result.costPerKm,
        'Cost/Ton-km': result.costPerTonKm,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Commercial Truck Trip Estimate*\n• Route Distance: ${distanceKm} km (${cargoTonnage} Tons)\n• Quoted Freight: ${formatINR(Number(freightRate) || 0)}\n-----------------------\n• Diesel Needed: ${result.fuelLitresNeeded} Litres (${formatINR(result.totalFuelCost)})\n• Fastag / Tolls: ${formatINR(Number(tollCharges) || 0)}\n• Driver Bhatta: ${formatINR(Number(driverBhatta) || 0)}\n• Loading/Unloading: ${formatINR(Number(loadingUnloading) || 0)}\n*Total Trip Expense:* ${formatINR(result.totalTripExpense)}\n-----------------------\n*Net Trip Profit:* ${formatINR(result.netTripProfit)} (${formatPercent(result.profitMarginPercent)})\n*Operating Cost per km:* ₹${result.costPerKm}/km`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'ट्रांसपोर्ट, ट्रिप डीजल एवं भाड़ा' : 'Transport & Fleet Trip Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'ट्रिप का कुल डीजल खर्च, फास्टैग टोल, ड्राइवर भत्ता, भाड़ा दर, प्रति किमी लागत व शुद्ध ट्रिप मुनाफा'
              : 'Calculate trip fuel consumption, FASTag toll, driver allowance, freight quote, and ton-km margins'}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'ट्रिप दूरी (किलोमीटर / km)' : 'Trip Distance (km)'}
              </label>
              <input
                type="number"
                min="1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                placeholder="650"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'माइलेज (km / लीटर)' : 'Mileage (km/Litre)'}
              </label>
              <input
                type="number"
                min="0.5"
                step="0.1"
                value={mileage}
                onChange={(e) => setMileage(e.target.value === '' ? '' : Math.max(0.5, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="4.2"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'डीजल भाव (₹ / L)' : 'Diesel Rate (₹/L)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-6 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="90"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'कुल तय भाड़ा (Freight Quote ₹)' : 'Total Quoted Freight (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={freightRate}
                  onChange={(e) => setFreightRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                  placeholder="26000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'माल का वजन (टन / Tons)' : 'Cargo Weight (Tons)'}
              </label>
              <input
                type="number"
                min="1"
                value={cargoTonnage}
                onChange={(e) => setCargoTonnage(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'टोल/फास्टैग' : 'Fastag/Toll'}</label>
              <input
                type="number"
                min="0"
                value={tollCharges}
                onChange={(e) => setTollCharges(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                placeholder="1800"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'ड्राइवर भत्ता' : 'Driver Bhatta'}</label>
              <input
                type="number"
                min="0"
                value={driverBhatta}
                onChange={(e) => setDriverBhatta(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'लोडिंग/उतराई' : 'Loading'}</label>
              <input
                type="number"
                min="0"
                value={loadingUnloading}
                onChange={(e) => setLoadingUnloading(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                placeholder="800"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">{lang === 'hi' ? 'अन्य खर्च' : 'Misc/Overhead'}</label>
              <input
                type="number"
                min="0"
                value={otherOverheads}
                onChange={(e) => setOtherOverheads(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
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
            title={lang === 'hi' ? 'ट्रिप मुनाफा एवं लागत रिपोर्ट' : 'Trip Profitability Sheet'}
            primaryLabel={lang === 'hi' ? 'शुद्ध ट्रिप मुनाफा (Net Trip Profit)' : 'Net Trip Profit'}
            primaryValue={formatINR(result.netTripProfit)}
            numericPrimaryValue={result.netTripProfit}
            statusBadge={`${formatPercent(result.profitMarginPercent)} Margin`}
            statusType={result.netTripProfit >= 0 ? 'profit' : 'loss'}
            items={[
              {
                label: lang === 'hi' ? 'कुल ट्रिप खर्च' : 'Total Trip Expense',
                value: formatINR(result.totalTripExpense),
              },
              {
                label: lang === 'hi' ? 'डीजल खर्च' : 'Fuel Cost',
                value: formatINR(result.totalFuelCost),
                subtext: `${result.fuelLitresNeeded} Litres`,
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'प्रति किमी लागत' : 'Cost per km',
                value: `₹${result.costPerKm}/km`,
              },
              {
                label: lang === 'hi' ? 'प्रति टन-किमी लागत' : 'Cost per Ton-km',
                value: `₹${result.costPerTonKm}/ton-km`,
              },
              {
                label: lang === 'hi' ? 'तय भाड़ा' : 'Quoted Freight',
                value: formatINR(Number(freightRate) || 0),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Logistics & Fleet Costing Formulas"
        titleHi="लॉजिस्टिक्स एवं कमर्शियल ट्रक भाड़ा सूत्र"
        formulaEn={[
          'Fuel Litres Needed = Distance in km ÷ Mileage (km/Litre)',
          'Total Fuel Cost = Fuel Litres Needed × Diesel Price per Litre',
          'Total Trip Expense = Fuel + Tolls + Driver Bhatta + Loading/Unloading + Misc',
          'Net Trip Profit = Quoted Freight - Total Trip Expense',
          'Cost per Ton-km = Total Trip Expense ÷ (Distance in km × Cargo Tonnage)',
        ]}
        formulaHi={[
          'आवश्यक डीजल (लीटर) = कुल दूरी (किमी) ÷ माइलेज (किमी/लीटर)',
          'कुल डीजल लागत = आवश्यक डीजल × डीजल भाव',
          'कुल ट्रिप खर्च = डीजल + फास्टैग टोल + ड्राइवर भत्ता + लोडिंग/उतराई + अन्य',
          'शुद्ध ट्रिप मुनाफा = तय भाड़ा - कुल ट्रिप खर्च',
          'प्रति टन-किमी लागत = कुल ट्रिप खर्च ÷ (दूरी × माल वजन टन में)',
        ]}
        notesEn={[
          'Accurately estimating toll and empty return fuel ensures fleet owners stay profitable.',
        ]}
        notesHi={[
          'भाड़ा तय करते समय हमेशा वापसी की खाली ट्रिप या ईंधन खर्च को ध्यान में रखकर ही कोटेशन दें।',
        ]}
      />
    </div>
  );
};
