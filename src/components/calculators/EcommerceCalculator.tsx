import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateEcommerce } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface EcommerceCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const EcommerceCalculator: React.FC<EcommerceCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [sellingPrice, setSellingPrice] = useState<number | ''>(999);
  const [productCost, setProductCost] = useState<number | ''>(320);
  const [packagingCost, setPackagingCost] = useState<number | ''>(25);
  const [shippingFee, setShippingFee] = useState<number | ''>(75);
  const [commissionPercent, setCommissionPercent] = useState<number | ''>(12);
  const [fixedFee, setFixedFee] = useState<number | ''>(20);
  const [pgPercent, setPgPercent] = useState<number | ''>(2);
  const [returnRate, setReturnRate] = useState<number | ''>(10);
  const [reverseShipping, setReverseShipping] = useState<number | ''>(75);

  const result = useMemo(() => {
    return calculateEcommerce({
      sellingPrice: Number(sellingPrice) || 0,
      productCost: Number(productCost) || 0,
      packagingCost: Number(packagingCost) || 0,
      shippingFee: Number(shippingFee) || 0,
      referralCommissionPercent: Number(commissionPercent) || 0,
      fixedClosingFee: Number(fixedFee) || 0,
      paymentGatewayPercent: Number(pgPercent) || 2,
      expectedReturnRatePercent: Number(returnRate) || 0,
      reverseShippingOnReturn: Number(reverseShipping) || 0,
    });
  }, [sellingPrice, productCost, packagingCost, shippingFee, commissionPercent, fixedFee, pgPercent, returnRate, reverseShipping]);

  const handleReset = () => {
    setSellingPrice(799);
    setProductCost(250);
    setPackagingCost(20);
    setShippingFee(70);
    setCommissionPercent(10);
    setFixedFee(20);
    setPgPercent(2);
    setReturnRate(10);
    setReverseShipping(70);
  };

  const handleCalculateAndSave = () => {
    onSaveHistory({
      calculatorId: 'ecommerce',
      title: lang === 'hi' ? 'ई-कॉमर्स सेलर पेआउट' : 'E-Commerce Seller Payout',
      inputsSummary: `SP: ₹${sellingPrice}, Comm: ${commissionPercent}%, RTO: ${returnRate}%`,
      resultSummary: `Bank Payout: ${formatINR(result.netPayoutToBank)}, Net Profit: ${formatINR(result.effectiveNetProfit)} (${formatPercent(result.netMarginPercent)})`,
      details: {
        'Listing Price': Number(sellingPrice) || 0,
        'Marketplace Deductions': result.totalMarketplaceDeductions,
        'Bank Payout': result.netPayoutToBank,
        'RTO Loss Buffer': result.rtoLossBufferPerUnit,
        'Effective Profit': result.effectiveNetProfit,
        'Net Margin %': result.netMarginPercent,
      },
    });
  };

  const whatsappMessage = `*BizCalc Pro - Amazon/Flipkart Seller Payout Summary*\n• Selling Price on Portal: ${formatINR(Number(sellingPrice) || 0)}\n• Product Cost + Packing: ${formatINR((Number(productCost) || 0) + (Number(packagingCost) || 0))}\n-----------------------\n• Referral Commission (${commissionPercent}%): -${formatINR(result.marketplaceCommission)}\n• Shipping Fee: -${formatINR(Number(shippingFee) || 0)}\n• Fixed & PG Fees: -${formatINR((Number(fixedFee) || 0) + result.paymentGatewayFee)}\n• 18% GST on Portal Fees: -${formatINR(result.gstOnMarketplaceFees)}\n-----------------------\n*Total Portal Cut:* -${formatINR(result.totalMarketplaceDeductions)}\n*Net Payout to Bank:* ${formatINR(result.netPayoutToBank)}\n*RTO Loss Risk (${returnRate}%):* -${formatINR(result.rtoLossBufferPerUnit)}/order\n*Final Net Profit:* ${formatINR(result.effectiveNetProfit)} (${formatPercent(result.netMarginPercent)})`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'ई-कॉमर्स सेलर पेआउट (Amazon / Flipkart / Meesho)' : 'E-commerce Seller Net Payout'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'मार्केटप्लेस कमीशन, शिपिंग, 18% जीएसटी (ITC सहित) व रिटर्न (RTO) हानि काटकर बैंक पेआउट'
              : 'Calculate Amazon/Flipkart/Meesho net bank payouts after fees, 18% GST on services, and RTO buffers'}
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
                {lang === 'hi' ? 'पोर्टल पर बिक्री मूल्य (SP ₹)' : 'Listing Selling Price (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                  placeholder="999"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lang === 'hi' ? 'प्रोडक्ट निर्माण/खरीद लागत (₹)' : 'Product COGS / Cost (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={productCost}
                  onChange={(e) => setProductCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="320"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'कमीशन (%)' : 'Commission %'}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="12"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'शिपिंग शुल्क (₹)' : 'Shipping Fee (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="75"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'पैकेजिंग बॉक्स (₹)' : 'Packaging (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={packagingCost}
                onChange={(e) => setPackagingCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="25"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'फिक्स्ड क्लोजिंग फीस (₹)' : 'Fixed Closing Fee (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={fixedFee}
                onChange={(e) => setFixedFee(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {lang === 'hi' ? 'पेमेंट गेटवे शुल्क (%)' : 'Payment Gateway %'}
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={pgPercent}
                onChange={(e) => setPgPercent(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="2"
              />
            </div>
          </div>

          {/* RTO Return Buffer Settings */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              {lang === 'hi' ? 'रिटर्न / आरटीओ जोखिम बफर (RTO Loss Buffer)' : 'RTO Return Risk Buffer'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  {lang === 'hi' ? 'अनुमानित रिटर्न दर (Return Rate %)' : 'Return Rate %'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={returnRate}
                  onChange={(e) => setReturnRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">
                  {lang === 'hi' ? 'रिवर्स शिपिंग लागत (₹)' : 'Reverse Shipping (₹)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={reverseShipping}
                  onChange={(e) => setReverseShipping(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                  placeholder="75"
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
            title={lang === 'hi' ? 'ई-कॉमर्स सेलर पेआउट विवरण' : 'Marketplace Settlement'}
            primaryLabel={lang === 'hi' ? 'बैंक खाते में आने वाली राशि' : 'Net Bank Payout / Order'}
            primaryValue={formatINR(result.netPayoutToBank)}
            numericPrimaryValue={result.netPayoutToBank}
            statusBadge={`${formatPercent(result.netMarginPercent)} Margin`}
            statusType={result.effectiveNetProfit >= 0 ? 'profit' : 'loss'}
            items={[
              {
                label: lang === 'hi' ? 'शुद्ध मुनाफा (RTO काटकर)' : 'Final Net Profit',
                value: formatINR(result.effectiveNetProfit),
                isHighlight: true,
                isPositive: result.effectiveNetProfit > 0,
                isNegative: result.effectiveNetProfit <= 0,
              },
              {
                label: lang === 'hi' ? 'कुल मार्केटप्लेस कटौती' : 'Total Fees Deducted',
                value: formatINR(result.totalMarketplaceDeductions),
                isNegative: true,
              },
              {
                label: lang === 'hi' ? 'फीस पर 18% जीएसटी' : '18% GST on Fees',
                value: formatINR(result.gstOnMarketplaceFees),
                subtext: 'Claimable as ITC in GSTR-3B',
              },
              {
                label: lang === 'hi' ? 'आरटीओ रिटर्न हानि बफर' : 'RTO Loss / Unit',
                value: `-${formatINR(result.rtoLossBufferPerUnit)}`,
                isNegative: true,
              },
              {
                label: lang === 'hi' ? 'डिलिवर ऑर्डर मुनाफा' : 'Gross Order Profit',
                value: formatINR(result.netProfitPerDeliveredOrder),
              },
            ]}
            whatsappText={whatsappMessage}
            onReset={handleReset}
          />
        </div>
      </div>

      <FormulaAccordion
        lang={lang}
        titleEn="Marketplace Fee Breakdown & RTO Math"
        titleHi="मार्केटप्लेस कमीशन, 18% जीएसटी एवं आरटीओ घाटे का गणित"
        formulaEn={[
          'Marketplace Service Fees = Referral Commission + Shipping Fee + Fixed Fee + Payment Gateway (2%)',
          'GST on Marketplace Fees = Service Fees × 18% (Registered sellers can claim 100% of this as ITC)',
          'Net Payout to Bank = Selling Price - Total Marketplace Deductions (Fees + 18% GST)',
          'RTO Buffer per unit = (Forward Shipping + Reverse Shipping + Packaging) × Return Rate %',
          'Effective Net Profit = Net Bank Payout - Product Cost - Packaging Cost - RTO Buffer',
        ]}
        formulaHi={[
          'सर्विस फीस = रेफरल कमीशन + शिपिंग फीस + क्लोजिंग फीस + पेमेंट गेटवे (2%)',
          'फीस पर जीएसटी = सर्विस फीस × 18% (यह 18% टैक्स आप GSTR-3B में वापस इनपुट क्रेडिट ले सकते हैं)',
          'बैंक पेआउट = पोर्टल बिक्री मूल्य - कुल मार्केटप्लेस कटौती (फीस + 18% जीएसटी)',
          'आरटीओ रिटर्न बफर = (आगे का भाड़ा + वापसी भाड़ा + पैकिंग) × रिटर्न प्रतिशत',
          'शुद्ध मुनाफा = बैंक पेआउट - प्रोडक्ट खरीद लागत - पैकिंग - आरटीओ बफर',
        ]}
        notesEn={[
          'Always budget for 10-15% RTO returns on COD orders to avoid surprise monthly losses.',
        ]}
        notesHi={[
          'सीओडी (Cash on Delivery) ऑर्डर्स पर हमेशा 10% से 15% आरटीओ रिटर्न घाटे का बफर जोड़कर ही कीमत तय करें।',
        ]}
      />
    </div>
  );
};
