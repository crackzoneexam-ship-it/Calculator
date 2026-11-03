import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateRealEstate } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface RealEstateCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const RealEstateCalculator: React.FC<RealEstateCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [propertyValue, setPropertyValue] = useState<number | ''>(5500000);
  const [monthlyRent, setMonthlyRent] = useState<number | ''>(24000);
  const [propertyTax, setPropertyTax] = useState<number | ''>(8000);
  const [maintenance, setMaintenance] = useState<number | ''>(15000);
  const [stampDutyPercent, setStampDutyPercent] = useState<number | ''>(6);
  const [registrationPercent, setRegistrationPercent] = useState<number | ''>(1);

  const result = useMemo(() => {
    return calculateRealEstate({
      propertyValue: Number(propertyValue) || 0,
      monthlyRentalIncome: Number(monthlyRent) || 0,
      annualPropertyTax: Number(propertyTax) || 0,
      annualMaintenance: Number(maintenance) || 0,
      stampDutyPercent: Number(stampDutyPercent) || 0,
      registrationPercent: Number(registrationPercent) || 0,
    });
  }, [propertyValue, monthlyRent, propertyTax, maintenance, stampDutyPercent, registrationPercent]);

  const handleReset = () => {
    setPropertyValue(5000000);
    setMonthlyRent(20000);
    setPropertyTax(6000);
    setMaintenance(12000);
    setStampDutyPercent(6);
    setRegistrationPercent(1);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'real_estate',
      title: lang === 'hi' ? 'प्रॉपर्टी किराया यील्ड' : 'Real Estate Yield',
      inputsSummary: `Value: ${formatINR(Number(propertyValue) || 0)}, Rent: ${formatINR(Number(monthlyRent) || 0)}/mo`,
      resultSummary: `Gross Yield: ${formatPercent(result.grossRentalYieldPercent)}, Net Yield: ${formatPercent(result.netRentalYieldPercent)}`,
      details: {
        'Property Value': Number(propertyValue) || 0,
        'Gross Annual Rent': result.grossAnnualRent,
        'Gross Yield': `${result.grossRentalYieldPercent}%`,
        'Net Yield': `${result.netRentalYieldPercent}%`,
        'Stamp Duty': result.stampDutyAmount,
        'Registration Fee': result.registrationAmount,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Real Estate Investment & Yield Analysis*\n• Property Cost: ${formatINR(Number(propertyValue) || 0)}\n• Monthly Rent: ${formatINR(Number(monthlyRent) || 0)}\n-----------------------\n*Gross Rental Yield:* ${formatPercent(result.grossRentalYieldPercent)}/year\n*Net Rental Yield (after tax/maint):* ${formatPercent(result.netRentalYieldPercent)}/year\n*Annual Net Rent:* ${formatINR(result.netAnnualRent)}\n-----------------------\n*Acquisition Costs:*\n• Stamp Duty (${stampDutyPercent}%): ${formatINR(result.stampDutyAmount)}\n• Registration (${registrationPercent}%): ${formatINR(result.registrationAmount)}\n*Total Property Outlay:* ${formatINR(result.totalAcquisitionCost)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'प्रॉपर्टी, किराया यील्ड व स्टांप ड्यूटी' : 'Real Estate Yield & Stamp Duty Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'संपत्ति का वार्षिक किराया यील्ड %, स्टांप शुल्क, रजिस्ट्री फीस व कुल खरीद लागत'
              : 'Calculate gross & net rental yield %, state stamp duty, and registration charges'}
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
              {lang === 'hi' ? 'प्रॉपर्टी खरीद मूल्य (Property Value ₹)' : 'Property Purchase Value (₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                placeholder="5500000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'मासिक किराया आय (Monthly Rent ₹)' : 'Monthly Rental Income (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="24000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'वार्षिक मेंटेनेंस व सोसाइटी खर्च (₹)' : 'Annual Society Maintenance (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="15000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'वार्षिक प्रॉपर्टी टैक्स (₹)' : 'Property Tax (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="8000"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'स्टांप ड्यूटी (%)' : 'Stamp Duty %'}
              </label>
              <input
                type="number"
                min="0"
                max="15"
                step="0.5"
                value={stampDutyPercent}
                onChange={(e) => setStampDutyPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="6"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'रजिस्ट्री शुल्क (%)' : 'Registration %'}
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.5"
                value={registrationPercent}
                onChange={(e) => setRegistrationPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="1"
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
            title={lang === 'hi' ? 'प्रॉपर्टी यील्ड विश्लेषण' : 'Real Estate Yield Report'}
            primaryLabel={lang === 'hi' ? 'सकल किराया यील्ड (Gross Rental Yield)' : 'Gross Rental Yield %'}
            primaryValue={formatPercent(result.grossRentalYieldPercent)}
            statusBadge={`${formatPercent(result.netRentalYieldPercent)} Net Yield`}
            statusType="profit"
            items={[
              {
                label: lang === 'hi' ? 'शुद्ध किराया यील्ड (Net Yield)' : 'Net Rental Yield',
                value: formatPercent(result.netRentalYieldPercent),
                isHighlight: true,
                isPositive: true,
              },
              {
                label: lang === 'hi' ? 'वार्षिक कुल किराया' : 'Annual Gross Rent',
                value: formatINR(result.grossAnnualRent),
              },
              {
                label: lang === 'hi' ? 'वार्षिक शुद्ध किराया' : 'Annual Net Rent',
                value: formatINR(result.netAnnualRent),
              },
              {
                label: lang === 'hi' ? 'स्टांप शुल्क (Stamp Duty)' : 'Stamp Duty Amount',
                value: formatINR(result.stampDutyAmount),
              },
              {
                label: lang === 'hi' ? 'रजिस्ट्री शुल्क' : 'Registration Fee',
                value: formatINR(result.registrationAmount),
              },
              {
                label: lang === 'hi' ? 'कुल खरीद खर्च' : 'Total Acquisition Outlay',
                value: formatINR(result.totalAcquisitionCost),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Real Estate Rental Yield & Registration Slabs"
        titleHi="प्रॉपर्टी किराया यील्ड एवं राज्यवार रजिस्ट्री नियम"
        formulaEn={[
          'Gross Rental Yield % = (Monthly Rent × 12) ÷ Total Property Value × 100',
          'Net Rental Yield % = (Annual Rent - Annual Taxes - Maintenance) ÷ Total Property Value × 100',
          'Stamp Duty in most Indian states (MH, KA, DL, UP) ranges from 5% to 7% of property agreement value.',
          'Standard Registration fee is 1% across most state sub-registrar offices.',
        ]}
        formulaHi={[
          'सकल किराया यील्ड % = (मासिक किराया × 12) ÷ संपत्ति कुल मूल्य × 100',
          'शुद्ध किराया यील्ड % = (वार्षिक किराया - टैक्स - मेंटेनेंस) ÷ संपत्ति कुल मूल्य × 100',
          'भारत के अधिकांश राज्यों (महाराष्ट्र, यूपी, दिल्ली, कर्नाटक) में स्टांप शुल्क 5% से 7% होता है।',
          'रजिस्ट्री शुल्क आमतौर पर संपत्ति मूल्य का 1% होता है।',
        ]}
        notesEn={[
          'Residential rental yield in tier-1 Indian metros averages 2.5% to 4%, while commercial real estate yields 7% to 9%.',
        ]}
        notesHi={[
          'भारत के बड़े शहरों में आवासीय संपत्तियों पर 2.5% से 4% किराया यील्ड मिलता है, जबकि दुकानों व कमर्शियल में 7% से 9% तक मिलता है।',
        ]}
      />
    </div>
  );
};
