import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateRestaurant } from '../../utils/calculations';
import { formatINR, formatPercent } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface RestaurantCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const RestaurantCalculator: React.FC<RestaurantCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [subType, setSubType] = useState<'food_cost_ratio' | 'table_turnover'>('food_cost_ratio');

  // Dish Food cost
  const [ingredientCost, setIngredientCost] = useState<number | ''>(85);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(260);
  const [dailyQuantity, setDailyQuantity] = useState<number | ''>(40);

  // Table turnover
  const [totalSeats, setTotalSeats] = useState<number | ''>(48);
  const [avgSpend, setAvgSpend] = useState<number | ''>(350);
  const [tableTurns, setTableTurns] = useState<number | ''>(2.5);
  const [operatingDays, setOperatingDays] = useState<number | ''>(30);

  const result = useMemo(() => {
    return calculateRestaurant({
      subType,
      ingredientCostPerDish: Number(ingredientCost) || 0,
      sellingPricePerDish: Number(sellingPrice) || 0,
      dailyDishQuantity: Number(dailyQuantity) || 0,
      totalSeats: Number(totalSeats) || 0,
      avgSpendPerCustomer: Number(avgSpend) || 0,
      tableTurnsPerDay: Number(tableTurns) || 0,
      operatingDaysMonth: Number(operatingDays) || 30,
    });
  }, [subType, ingredientCost, sellingPrice, dailyQuantity, totalSeats, avgSpend, tableTurns, operatingDays]);

  const handleReset = () => {
    if (subType === 'food_cost_ratio') {
      setIngredientCost(70);
      setSellingPrice(220);
      setDailyQuantity(35);
    } else {
      setTotalSeats(40);
      setAvgSpend(300);
      setTableTurns(2.5);
      setOperatingDays(30);
    }
  };

  const handleCalculateAndSave = () => {
    if (subType === 'food_cost_ratio') {
      onSaveHistory({
        calculatorId: 'restaurant',
        title: lang === 'hi' ? 'फ़ूड कॉस्ट अनुपात' : 'Restaurant Food Cost',
        inputsSummary: `Cost: ₹${ingredientCost}, Menu: ₹${sellingPrice}`,
        resultSummary: `Food Cost: ${result.foodCostPercentage}% (${result.isFoodCostHealthy ? 'Healthy' : 'Check Pricing'}), Profit: ${formatINR(result.grossProfitPerDish || 0)}/dish`,
        details: {
          'Dish Cost': Number(ingredientCost) || 0,
          'Menu Price': Number(sellingPrice) || 0,
          'Food Cost %': result.foodCostPercentage || 0,
          'Profit / Dish': result.grossProfitPerDish || 0,
          'Monthly Profit': result.monthlyDishProfit || 0,
        },
      });
    } else {
      onSaveHistory({
        calculatorId: 'restaurant',
        title: lang === 'hi' ? 'टेबल टर्नओवर राजस्व' : 'Table Turnover Potential',
        inputsSummary: `${totalSeats} Seats, ${tableTurns} Turns/Day, APC: ₹${avgSpend}`,
        resultSummary: `Daily: ${formatINR(result.dailyRevenuePotential || 0)}, Monthly: ${formatINR(result.monthlyRevenuePotential || 0)}`,
        details: {
          Seats: Number(totalSeats) || 0,
          'Turns / Day': Number(tableTurns) || 0,
          'Monthly Revenue': result.monthlyRevenuePotential || 0,
        },
      });
    }
  };

  const whatsappMessage =
    subType === 'food_cost_ratio'
      ? `*BizCalc Pro - Restaurant Dish Recipe Costing*\n• Ingredient Raw Cost: ${formatINR(Number(ingredientCost) || 0)}\n• Menu Selling Price: ${formatINR(Number(sellingPrice) || 0)}\n-----------------------\n*Food Cost %:* ${result.foodCostPercentage}% (${
          result.isFoodCostHealthy ? 'Optimal 28-35% range' : 'Warning: Outside standard 28-35% benchmark'
        })\n*Gross Profit per Plate:* ${formatINR(result.grossProfitPerDish || 0)}\n*Est. Monthly Dish Profit (${dailyQuantity}/day):* ${formatINR(result.monthlyDishProfit || 0)}`
      : `*BizCalc Pro - Restaurant Seating Capacity Potential*\n• Total Seats: ${totalSeats}\n• Average Spend per Guest (APC): ₹${avgSpend}\n• Table Turnover: ${tableTurns} turns/day\n-----------------------\n*Daily Revenue Potential:* ${formatINR(result.dailyRevenuePotential || 0)}\n*Monthly Revenue Potential (${operatingDays} days):* ${formatINR(result.monthlyRevenuePotential || 0)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'होटल, रेस्टोरेंट एवं फ़ूड कॉस्ट (Restaurant & F&B)' : 'Restaurant & Food Costing Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'खाने की लागत प्रतिशत (Food Cost %), डिश रेसिपी मार्जिन, टेबल टर्नओवर व मासिक राजस्व'
              : 'Calculate food cost % benchmark (28-35%), dish recipe gross margins, and seating revenue'}
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

      {/* Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setSubType('food_cost_ratio')}
          className={`py-2 px-3 rounded-xl transition-all text-center ${
            subType === 'food_cost_ratio'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'डिश फ़ूड कॉस्ट % (Food Cost)' : 'Dish Food Cost %'}
        </button>
        <button
          type="button"
          onClick={() => setSubType('table_turnover')}
          className={`py-2 px-3 rounded-xl transition-all text-center ${
            subType === 'table_turnover'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'टेबल टर्नओवर क्षमता' : 'Table Turns & Revenue'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          {subType === 'food_cost_ratio' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'डिश की सामग्री लागत (Raw Cost ₹)' : 'Dish Raw Ingredient Cost (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={ingredientCost}
                      onChange={(e) => setIngredientCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="85"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'मेन्यू बिक्री भाव (Selling Price ₹)' : 'Menu Selling Price (₹)'}
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
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="260"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'दैनिक औसत बिक्री (प्लेट्स/दिन)' : 'Estimated Daily Plates Sold'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={dailyQuantity}
                  onChange={(e) => setDailyQuantity(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                  placeholder="40"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'कुल बैठने की क्षमता (Seats/Covers)' : 'Total Dining Seats / Capacity'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    placeholder="48"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'प्रति ग्राहक औसत खर्च (APC ₹)' : 'Average Spend per Cover (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={avgSpend}
                      onChange={(e) => setAvgSpend(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="350"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'दैनिक टेबल टर्नओवर (Turns/Day)' : 'Table Turns per Day'}
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={tableTurns}
                    onChange={(e) => setTableTurns(e.target.value === '' ? '' : Math.max(0.1, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="2.5"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Lunch (1 turn) + Dinner (1.5 turns) = 2.5
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'महीने में खुले दिन' : 'Operating Days / Month'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={operatingDays}
                    onChange={(e) => setOperatingDays(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="30"
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
          {subType === 'food_cost_ratio' ? (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'डिश फ़ूड कॉस्ट विश्लेषण' : 'Food Cost Analysis'}
              primaryLabel={lang === 'hi' ? 'फ़ूड कॉस्ट प्रतिशत (Food Cost %)' : 'Food Cost Percentage'}
              primaryValue={`${result.foodCostPercentage}%`}
              statusBadge={
                result.isFoodCostHealthy
                  ? lang === 'hi'
                    ? 'उचित (28-35% मानक)'
                    : 'HEALTHY (28-35%)'
                  : lang === 'hi'
                  ? 'असंतुलित'
                  : 'HIGH / CHECK'
              }
              statusType={result.isFoodCostHealthy ? 'profit' : 'loss'}
              items={[
                {
                  label: lang === 'hi' ? 'प्रति प्लेट सकल लाभ' : 'Gross Profit / Dish',
                  value: formatINR(result.grossProfitPerDish || 0),
                  isPositive: (result.grossProfitPerDish || 0) > 0,
                  isHighlight: true,
                },
                {
                  label: lang === 'hi' ? 'मासिक संभावित मुनाफा' : 'Monthly Profit Pool',
                  value: formatINR(result.monthlyDishProfit || 0),
                  subtext: `${dailyQuantity} plates/day`,
                },
                {
                  label: lang === 'hi' ? 'कच्चा माल लागत' : 'Ingredient Cost',
                  value: formatINR(Number(ingredientCost) || 0),
                },
                {
                  label: lang === 'hi' ? 'मेन्यू बिक्री मूल्य' : 'Menu Price',
                  value: formatINR(Number(sellingPrice) || 0),
                },
              ]}
              whatsappText={whatsappMessage}
              onReset={handleReset}
            />
          ) : (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'रेस्टोरेंट राजस्व क्षमता' : 'Dining Revenue Potential'}
              primaryLabel={lang === 'hi' ? 'मासिक राजस्व क्षमता' : 'Monthly Gross Revenue'}
              primaryValue={formatINR(result.monthlyRevenuePotential || 0)}
              numericPrimaryValue={result.monthlyRevenuePotential || 0}
              statusBadge={`${totalSeats} Seats`}
              statusType="profit"
              items={[
                {
                  label: lang === 'hi' ? 'दैनिक राजस्व क्षमता' : 'Daily Revenue Potential',
                  value: formatINR(result.dailyRevenuePotential || 0),
                  isHighlight: true,
                },
                {
                  label: lang === 'hi' ? 'दैनिक ग्राहक संख्या' : 'Daily Customers Served',
                  value: `${Math.round((Number(totalSeats) || 0) * (Number(tableTurns) || 0))} Guests`,
                },
                {
                  label: lang === 'hi' ? 'औसत ग्राहक खर्च (APC)' : 'Avg Spend per Person',
                  value: formatINR(Number(avgSpend) || 0),
                },
                {
                  label: lang === 'hi' ? 'टेबल टर्नओवर' : 'Table Turns / Day',
                  value: `${tableTurns} Turns`,
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
        titleEn="F&B Industry Benchmarks & GST Rules"
        titleHi="होटल व रेस्टोरेंट उद्योग मानक एवं जीएसटी नियम"
        formulaEn={[
          'Food Cost % = (Ingredient Cost per Plate ÷ Menu Selling Price) × 100',
          'Healthy Food Cost in Indian restaurants is strictly between 28% and 35%.',
          'Daily Revenue = Total Seats × Table Turns per day × Average Spend per Customer',
          'Under Indian GST: Standalone restaurants charge 5% GST (without Input Tax Credit).',
        ]}
        formulaHi={[
          'फ़ूड कॉस्ट % = (डिश की सामग्री लागत ÷ मेन्यू बिक्री मूल्य) × 100',
          'भारतीय रेस्टोरेंट में सफल फ़ूड कॉस्ट मानक 28% से 35% के बीच होना चाहिए।',
          'दैनिक राजस्व = कुल कुर्सियां × टेबल टर्नओवर संख्या × प्रति ग्राहक औसत बिल',
          'भारतीय जीएसटी में सामान्य रेस्टोरेंट 5% जीएसटी लगाते हैं (बिना आईटीसी के)।',
        ]}
        notesEn={[
          'Beverages and desserts typically have lower food costs (~15-20%) which balances higher non-veg dish costs (~35-40%).',
        ]}
        notesHi={[
          'चाय, कॉफी व मॉकटेल्स में लागत सिर्फ 15-20% होती है, जिससे पनीर व मांसाहारी व्यंजनों की अधिक लागत संतुलित हो जाती है।',
        ]}
      />
    </div>
  );
};
