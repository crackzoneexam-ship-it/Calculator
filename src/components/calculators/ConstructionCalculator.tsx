import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { calculateConstruction } from '../../utils/calculations';
import { formatINR, formatNumberIN } from '../../utils/formatters';
import { ResultCard } from '../ResultCard';
import { FormulaAccordion } from '../FormulaAccordion';

interface ConstructionCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const ConstructionCalculator: React.FC<ConstructionCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [subType, setSubType] = useState<'concrete_mix' | 'brickwork' | 'builtup_cost'>('concrete_mix');

  // Concrete state
  const [volumeCuM, setVolumeCuM] = useState<number | ''>(5);
  const [grade, setGrade] = useState<'M15' | 'M20' | 'M25'>('M20');

  // Brickwork state
  const [wallLength, setWallLength] = useState<number | ''>(20);
  const [wallHeight, setWallHeight] = useState<number | ''>(10);
  const [wallThickness, setWallThickness] = useState<4.5 | 9>(9);

  // Built-up state
  const [areaSqFt, setAreaSqFt] = useState<number | ''>(1200);
  const [ratePerSqFt, setRatePerSqFt] = useState<number | ''>(1650);

  const result = useMemo(() => {
    return calculateConstruction({
      subType,
      volumeCuM: Number(volumeCuM) || 0,
      grade,
      wallLengthFt: Number(wallLength) || 0,
      wallHeightFt: Number(wallHeight) || 0,
      wallThicknessInches: wallThickness,
      areaSqFt: Number(areaSqFt) || 0,
      ratePerSqFt: Number(ratePerSqFt) || 0,
    });
  }, [subType, volumeCuM, grade, wallLength, wallHeight, wallThickness, areaSqFt, ratePerSqFt]);

  const handleReset = () => {
    if (subType === 'concrete_mix') {
      setVolumeCuM(5);
      setGrade('M20');
    } else if (subType === 'brickwork') {
      setWallLength(20);
      setWallHeight(10);
      setWallThickness(9);
    } else {
      setAreaSqFt(1000);
      setRatePerSqFt(1500);
    }
  };

  const handleCalculateAndSave = () => {
    if (subType === 'concrete_mix') {
      onSaveHistory({
        calculatorId: 'construction',
        title: lang === 'hi' ? 'कंक्रीट मसाला अनुपात' : 'Concrete Mix Design',
        inputsSummary: `${volumeCuM} cu.m, Grade: ${grade}`,
        resultSummary: `${result.cementBags} bags cement, ${result.sandCuFt} cft sand, ${result.aggregateCuFt} cft gitti`,
        details: {
          'Concrete Volume': `${volumeCuM} m³`,
          Grade: grade,
          'Cement Bags': result.cementBags,
          'Sand (cft)': result.sandCuFt,
          'Aggregate (cft)': result.aggregateCuFt,
        },
      });
    } else if (subType === 'brickwork') {
      onSaveHistory({
        calculatorId: 'construction',
        title: lang === 'hi' ? 'ईंट व चिनाई सामग्री' : 'Brickwork Estimator',
        inputsSummary: `${wallLength}x${wallHeight} ft, ${wallThickness}" wall`,
        resultSummary: `${result.totalBricks} bricks, ${result.mortarCementBags} bags cement`,
        details: {
          'Wall Size': `${wallLength}x${wallHeight} ft (${wallThickness} inch)`,
          'Total Bricks': result.totalBricks || 0,
          'Cement Bags': result.mortarCementBags || 0,
          'Sand (cft)': result.mortarSandCuFt || 0,
        },
      });
    } else {
      onSaveHistory({
        calculatorId: 'construction',
        title: lang === 'hi' ? 'मकान निर्माण लागत' : 'Built-up Cost Estimator',
        inputsSummary: `${areaSqFt} sq.ft @ ₹${ratePerSqFt}/sq.ft`,
        resultSummary: `Total: ${formatINR(result.totalBuiltupCost || 0)}`,
        details: {
          Area: `${areaSqFt} sq.ft`,
          'Rate / sq.ft': `₹${ratePerSqFt}`,
          'Total Cost': result.totalBuiltupCost || 0,
        },
      });
    }
  };

  const whatsappMessage =
    subType === 'concrete_mix'
      ? `*BizCalc Pro - Concrete Mix Material Estimate*\n• Volume: ${volumeCuM} cubic meters (m³)\n• Grade: ${grade} (${grade === 'M15' ? '1:2:4' : grade === 'M20' ? '1:1.5:3' : '1:1:2'})\n-----------------------\n*Cement Needed:* ${result.cementBags} Bags (50kg each)\n*Sand (रेत):* ${result.sandCuFt} cu.ft\n*Aggregate (गिट्टी):* ${result.aggregateCuFt} cu.ft`
      : subType === 'brickwork'
      ? `*BizCalc Pro - Brick Masonry Material Estimate*\n• Wall: ${wallLength} ft × ${wallHeight} ft (${(Number(wallLength) || 0) * (Number(wallHeight) || 0)} sq.ft)\n• Wall Thickness: ${wallThickness} inches\n-----------------------\n*Red Clay Bricks (ईंटें):* ${result.totalBricks} Bricks (incl. 5% breakage)\n*Mortar Cement:* ${result.mortarCementBags} Bags\n*Mortar Sand:* ${result.mortarSandCuFt} cu.ft`
      : `*BizCalc Pro - House Construction Cost Estimate*\n• Built-up Area: ${areaSqFt} sq.ft\n• Construction Rate: ₹${ratePerSqFt}/sq.ft\n-----------------------\n*Total Estimated Cost:* ${formatINR(result.totalBuiltupCost || 0)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'निर्माण, कंक्रीट एवं ईंट कैलकुलेटर' : 'Construction & Civil Estimator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'कंक्रीट मिक्स (सीमेंट, रेत, गिट्टी), ईंट की दीवार सामग्री व प्रति वर्ग फुट निर्माण लागत'
              : 'Estimate concrete mix materials, brick masonry, and built-up construction cost per sq.ft'}
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

      {/* Sub-Calculator Switcher */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-lg mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setSubType('concrete_mix')}
          className={`py-2 px-2 rounded-xl transition-all text-center truncate ${
            subType === 'concrete_mix'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'कंक्रीट मिक्स (RMC)' : 'Concrete Mix'}
        </button>
        <button
          type="button"
          onClick={() => setSubType('brickwork')}
          className={`py-2 px-2 rounded-xl transition-all text-center truncate ${
            subType === 'brickwork'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'ईंट चिनाई (Brick)' : 'Brick Masonry'}
        </button>
        <button
          type="button"
          onClick={() => setSubType('builtup_cost')}
          className={`py-2 px-2 rounded-xl transition-all text-center truncate ${
            subType === 'builtup_cost'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {lang === 'hi' ? 'मकान निर्माण लागत' : 'Built-up Cost'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          {subType === 'concrete_mix' ? (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'कंक्रीट आयतन (घन मीटर / m³)' : 'Wet Concrete Volume (Cubic Meters - m³)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={volumeCuM}
                  onChange={(e) => setVolumeCuM(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                  placeholder="5"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  1 m³ ≈ 35.31 cu.ft (CFT). Dry volume coefficient = 1.54
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'कंक्रीट ग्रेड चुनें (Concrete Grade)' : 'Select Concrete Mix Grade'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { g: 'M15', ratio: '1:2:4', desc: 'Flooring & PCC' },
                    { g: 'M20', ratio: '1:1.5:3', desc: 'Slabs & Beams' },
                    { g: 'M25', ratio: '1:1:2', desc: 'Columns & Heavy RCC' },
                  ].map((item) => (
                    <button
                      key={item.g}
                      type="button"
                      onClick={() => setGrade(item.g as 'M15' | 'M20' | 'M25')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        grade === item.g
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-500'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.g}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.ratio}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : subType === 'brickwork' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'दीवार की लंबाई (Feet)' : 'Wall Length (Feet)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={wallLength}
                    onChange={(e) => setWallLength(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'दीवार की ऊंचाई (Feet)' : 'Wall Height (Feet)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {lang === 'hi' ? 'दीवार की मोटाई (Wall Thickness)' : 'Wall Thickness'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWallThickness(9)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      wallThickness === 9
                        ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">9 Inch Wall (मुख्य दीवार)</div>
                    <div className="text-[10px] text-slate-500">External load-bearing brick wall</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWallThickness(4.5)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      wallThickness === 4.5
                        ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">4.5 Inch Wall (पार्टीशन)</div>
                    <div className="text-[10px] text-slate-500">Internal room partition wall</div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'कुल निर्मित क्षेत्रफल (वर्ग फुट / Sq.Ft)' : 'Total Built-up Area (Sq.Ft)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value)))}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    placeholder="1200"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === 'hi' ? 'निर्माण दर (₹ प्रति वर्ग फुट)' : 'Rate per Sq.Ft (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="500"
                      value={ratePerSqFt}
                      onChange={(e) => setRatePerSqFt(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                      className="w-full min-h-[44px] pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 font-mono"
                      placeholder="1650"
                    />
                  </div>
                </div>
              </div>

              {/* Presets for Grade A/B/C construction */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                  {lang === 'hi' ? 'मानक निर्माण दर स्लैब' : 'Standard Indian Construction Tiers'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRatePerSqFt(1400)}
                    className="p-2 text-left bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹1,400/sq.ft</div>
                    <div className="text-[10px] text-slate-500">Basic / Economy</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatePerSqFt(1700)}
                    className="p-2 text-left bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹1,700/sq.ft</div>
                    <div className="text-[10px] text-slate-500">Standard Quality</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatePerSqFt(2200)}
                    className="p-2 text-left bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹2,200/sq.ft</div>
                    <div className="text-[10px] text-slate-500">Premium / Luxury</div>
                  </button>
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
          {subType === 'concrete_mix' ? (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'कंक्रीट मसाला सामग्री' : 'Concrete Mix Bill'}
              primaryLabel={lang === 'hi' ? 'कुल सीमेंट बोरियां (50kg Bags)' : 'Total Cement Required'}
              primaryValue={`${result.cementBags} Bags`}
              statusBadge={`${grade} Mix`}
              statusType="neutral"
              items={[
                {
                  label: lang === 'hi' ? 'रेत / सैंड (CFT)' : 'Sand Volume (CFT)',
                  value: `${formatNumberIN(result.sandCuFt, 1)} CFT`,
                  isHighlight: true,
                },
                {
                  label: lang === 'hi' ? 'गिट्टी / Aggregate (CFT)' : 'Aggregate (Gitti)',
                  value: `${formatNumberIN(result.aggregateCuFt, 1)} CFT`,
                },
                {
                  label: lang === 'hi' ? 'सीमेंट का कुल वजन' : 'Cement Weight (Tons)',
                  value: `${((result.cementBags * 50) / 1000).toFixed(2)} Tons`,
                },
                {
                  label: lang === 'hi' ? 'सूखा आयतन गुणांक' : 'Dry Volume Factor',
                  value: '1.54x',
                },
              ]}
              whatsappText={whatsappMessage}
              onReset={handleReset}
            />
          ) : subType === 'brickwork' ? (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'ईंट चिनाई सामग्री विवरण' : 'Brick Masonry Bill'}
              primaryLabel={lang === 'hi' ? 'कुल ईंटें (5% टूट-फूट सहित)' : 'Total Red Bricks Needed'}
              primaryValue={`${formatNumberIN(result.totalBricks || 0, 0)} Bricks`}
              statusBadge={`${wallThickness} Inch Wall`}
              statusType="neutral"
              items={[
                {
                  label: lang === 'hi' ? 'दीवार क्षेत्रफल' : 'Wall Surface Area',
                  value: `${(Number(wallLength) || 0) * (Number(wallHeight) || 0)} Sq.Ft`,
                },
                {
                  label: lang === 'hi' ? 'मसाला सीमेंट बोरियां' : 'Mortar Cement',
                  value: `${result.mortarCementBags} Bags`,
                  isHighlight: true,
                },
                {
                  label: lang === 'hi' ? 'मसाला रेत (Sand CFT)' : 'Mortar Sand',
                  value: `${formatNumberIN(result.mortarSandCuFt || 0, 1)} CFT`,
                },
                {
                  label: lang === 'hi' ? 'ईंट टूटने का बफर' : 'Wastage Buffer',
                  value: '+5% included',
                },
              ]}
              whatsappText={whatsappMessage}
              onReset={handleReset}
            />
          ) : (
            <ResultCard
              lang={lang}
              title={lang === 'hi' ? 'मकान निर्माण लागत अनुमान' : 'Built-up Area Budget'}
              primaryLabel={lang === 'hi' ? 'कुल अनुमानित निर्माण लागत' : 'Total Construction Cost'}
              primaryValue={formatINR(result.totalBuiltupCost || 0)}
              numericPrimaryValue={result.totalBuiltupCost || 0}
              statusBadge={`₹${ratePerSqFt}/sq.ft`}
              statusType="neutral"
              items={[
                {
                  label: lang === 'hi' ? 'निर्मित क्षेत्रफल' : 'Built-up Area',
                  value: `${areaSqFt} Sq.Ft`,
                },
                {
                  label: lang === 'hi' ? 'दर प्रति वर्ग फुट' : 'Rate per Sq.Ft',
                  value: formatINR(Number(ratePerSqFt) || 0),
                  isHighlight: true,
                },
                {
                  label: lang === 'hi' ? 'कच्चा ढांचा (Grey Structure)' : 'Structure Share (~60%)',
                  value: formatINR((result.totalBuiltupCost || 0) * 0.6),
                },
                {
                  label: lang === 'hi' ? 'फिनिशिंग व फिटिंग' : 'Finishing Share (~40%)',
                  value: formatINR((result.totalBuiltupCost || 0) * 0.4),
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
        titleEn="Indian Standard Civil Engineering Formulas (IS 456)"
        titleHi="भारतीय मानक निर्माण एवं कंक्रीट मसाला नियम (IS 456)"
        formulaEn={[
          'Dry Volume of Concrete = Wet Volume × 1.54 (to account for void spaces)',
          'Cement Volume = (Cement Ratio ÷ Total Ratio) × Dry Volume',
          'Cement Bags = Cement Volume (m³) ÷ 0.0347 (as 1 bag of 50kg cement = 0.0347 m³)',
          'Standard Red Brick in India: 9" wall needs ~9.6 bricks per sq.ft + 5% wastage allowance',
        ]}
        formulaHi={[
          'सूखा कंक्रीट आयतन = गीला आयतन × 1.54 (रिक्त स्थान भरने हेतु)',
          'सीमेंट आयतन = (सीमेंट अनुपात ÷ कुल अनुपात) × सूखा आयतन',
          'सीमेंट बोरियां = सीमेंट आयतन ÷ 0.0347 (क्योंकि 50 किलो की 1 बोरी = 0.0347 घन मीटर)',
          'भारत में लाल ईंट: 9 इंच दीवार में लगभग 9.6 से 10 ईंटें प्रति वर्ग फुट लगती हैं।',
        ]}
        notesEn={[
          'M20 (1:1.5:3) is the mandatory minimum grade for RCC roof slabs and columns as per IS 456.',
        ]}
        notesHi={[
          'छत ढलाई (RCC Slab) और बीम के लिए न्यूनतम M20 ग्रेड (1 सीमेंट : 1.5 रेत : 3 गिट्टी) का उपयोग अनिवार्य है।',
        ]}
      />
    </div>
  );
};
