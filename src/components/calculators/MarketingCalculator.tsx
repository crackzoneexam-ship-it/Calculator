import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateMarketing } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface MarketingCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const MarketingCalculator: React.FC<MarketingCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [adSpend, setAdSpend] = useState<number | ''>(50000);
  const [conversions, setConversions] = useState<number | ''>(250);
  const [revenue, setRevenue] = useState<number | ''>(225000);
  const [impressions, setImpressions] = useState<number | ''>(150000);
  const [clicks, setClicks] = useState<number | ''>(4500);
  const [ltv, setLtv] = useState<number | ''>(1200);

  const result = useMemo(() => {
    return calculateMarketing({
      adSpend: Number(adSpend) || 0,
      conversions: Number(conversions) || 0,
      revenueGenerated: Number(revenue) || 0,
      impressions: Number(impressions) || 0,
      clicks: Number(clicks) || 0,
      avgCustomerLifetimeValue: Number(ltv) || 0,
    });
  }, [adSpend, conversions, revenue, impressions, clicks, ltv]);

  const handleReset = () => {
    setAdSpend(30000);
    setConversions(150);
    setRevenue(120000);
    setImpressions(100000);
    setClicks(3000);
    setLtv(1000);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'marketing',
      title: lang === 'hi' ? 'डिजिटल मार्केटिंग व ROAS' : 'Marketing & ROAS Calc',
      inputsSummary: `Spend: ₹${adSpend}, Rev: ₹${revenue}, Orders: ${conversions}`,
      resultSummary: `ROAS: ${result.roas}x (${result.roasPercent}%), CAC: ${formatINR(result.cac)}`,
      details: {
        'Ad Spend': Number(adSpend) || 0,
        Revenue: Number(revenue) || 0,
        ROAS: `${result.roas}x`,
        CAC: result.cac,
        'Profit After Ads': result.profitAfterAdSpend,
        CTR: `${result.ctr}%`,
        CPC: `₹${result.cpc}`,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Digital Marketing Campaign Performance*\n• Total Ad Spend: ${formatINR(Number(adSpend) || 0)}\n• Revenue Generated: ${formatINR(Number(revenue) || 0)}\n• Orders / Conversions: ${conversions}\n-----------------------\n*ROAS (Return on Ad Spend):* ${result.roas}x (${result.roasPercent}%)\n*CAC (Cost per Customer):* ${formatINR(result.cac)}\n*Profit After Ads:* ${formatINR(result.profitAfterAdSpend)}\n• CTR: ${result.ctr}% | CPC: ₹${result.cpc} | CPM: ₹${result.cpm}\n• LTV:CAC Ratio: ${result.ltvToCacRatio}x (${result.ltvToCacRatio >= 3 ? 'Excellent' : 'Needs Optimization'})`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'डिजिटल मार्केटिंग, ROAS व CAC कैलकुलेटर' : 'Digital Marketing & ROAS Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'विज्ञापन पर रिटर्न (ROAS), नया ग्राहक पाने की लागत (CAC), क्लिक दर (CTR) व एलटीवी अनुपात'
              : 'Calculate Return on Ad Spend (ROAS), Customer Acquisition Cost (CAC), CTR, CPC, and LTV:CAC'}
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
                {lang === 'hi' ? 'कुल विज्ञापन बजट खर्च (Ad Spend ₹)' : 'Total Ad Spend (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={adSpend}
                  onChange={(e) => setAdSpend(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'कुल प्राप्त राजस्व (Revenue Generated ₹)' : 'Revenue Generated (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                  placeholder="225000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'ऑर्डर्स / ग्राहक संख्या' : 'Conversions / Sales'}
              </label>
              <input
                type="number"
                min="1"
                value={conversions}
                onChange={(e) => setConversions(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="250"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'इंप्रेशन (Impressions)' : 'Impressions'}
              </label>
              <input
                type="number"
                min="0"
                value={impressions}
                onChange={(e) => setImpressions(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="150000"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'क्लिक संख्या (Clicks)' : 'Ad Clicks'}
              </label>
              <input
                type="number"
                min="0"
                value={clicks}
                onChange={(e) => setClicks(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="4500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {lang === 'hi' ? 'ग्राहक लाइफटाइम मूल्य (LTV ₹ - वैकल्पिक)' : 'Customer Lifetime Value (LTV ₹ - Optional)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={ltv}
                onChange={(e) => setLtv(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="1200"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Used to calculate LTV:CAC health ratio (Target is &ge; 3.0x)
            </span>
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
            title={lang === 'hi' ? 'मार्केटिंग रिटर्न रिपोर्ट' : 'Campaign Performance'}
            primaryLabel={lang === 'hi' ? 'विज्ञापन पर रिटर्न (ROAS)' : 'Return on Ad Spend (ROAS)'}
            primaryValue={`${result.roas}x`}
            statusBadge={`${result.roasPercent}% ROAS`}
            statusType={result.roas >= 3 ? 'profit' : result.roas >= 1.5 ? 'neutral' : 'loss'}
            items={[
              {
                label: lang === 'hi' ? 'ग्राहक अधिग्रहण लागत (CAC)' : 'Customer Acquisition Cost (CAC)',
                value: formatINR(result.cac),
                isHighlight: true,
              },
              {
                label: lang === 'hi' ? 'विज्ञापन बाद शुद्ध बचत' : 'Profit After Ad Spend',
                value: formatINR(result.profitAfterAdSpend),
                isPositive: result.profitAfterAdSpend > 0,
              },
              {
                label: lang === 'hi' ? 'क्लिक दर (CTR %)' : 'Click Through Rate (CTR)',
                value: `${result.ctr}%`,
              },
              {
                label: lang === 'hi' ? 'प्रति क्लिक लागत (CPC)' : 'Cost Per Click (CPC)',
                value: formatINR(result.cpc),
              },
              {
                label: lang === 'hi' ? 'कन्वर्शन दर (CVR %)' : 'Conversion Rate',
                value: `${result.conversionRate}%`,
              },
              {
                label: lang === 'hi' ? 'LTV:CAC अनुपात' : 'LTV to CAC Ratio',
                value: `${result.ltvToCacRatio}x`,
                isPositive: result.ltvToCacRatio >= 3,
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Digital Marketing & Performance Ad Formulas"
        titleHi="डिजिटल विज्ञापन (ROAS, CAC, CPC) के मुख्य सूत्र"
        formulaEn={[
          'ROAS (Return on Ad Spend) = Total Revenue Generated ÷ Total Ad Spend',
          'CAC (Customer Acquisition Cost) = Total Ad Spend ÷ Number of Conversions',
          'CTR (Click Through Rate) = (Clicks ÷ Impressions) × 100',
          'CPC (Cost Per Click) = Total Ad Spend ÷ Total Clicks',
          'CPM (Cost Per Thousand Impressions) = (Total Ad Spend ÷ Impressions) × 1000',
          'Healthy LTV:CAC ratio is 3:1 or higher in e-commerce and SaaS.',
        ]}
        formulaHi={[
          'ROAS = विज्ञापन से प्राप्त कुल राजस्व ÷ कुल विज्ञापन खर्च',
          'CAC (ग्राहक लागत) = कुल विज्ञापन खर्च ÷ प्राप्त नए ग्राहकों की संख्या',
          'CTR (क्लिक दर) = (कुल क्लिक ÷ कुल इंप्रेशन) × 100',
          'CPC = कुल खर्च ÷ कुल क्लिक',
          'LTV:CAC अनुपात 3 गुना या अधिक होना चाहिए, यानी ग्राहक से मिलने वाला कुल फायदा अधिग्रहण लागत से कम से कम 3 गुना हो।',
        ]}
        notesEn={[
          'A ROAS of 3x to 4x is typically required to break even after accounting for product COGS, shipping, and packaging.',
        ]}
        notesHi={[
          'उत्पाद लागत और शिपिंग खर्च निकालने के बाद मुनाफा कमाने के लिए कम से कम 3x से 4x ROAS होना आवश्यक है।',
        ]}
      />
    </div>
  );
};
