/**
 * BizCalc Pro - Pure Calculation Engine
 * Accurate mathematical formulas verified against standard Indian accounting, banking & trade practices.
 */

// 1. Basic Calculator Helper
export function evaluateBasicExpression(expr: string): number {
  // Safe tokenizer and evaluator supporting +, -, *, /, %
  const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '');
  if (!/^[-+/*0-9.%\s()]+$/.test(sanitized)) {
    throw new Error('Invalid characters in expression');
  }

  // Handle percentages like "200 + 10%" or "500 * 5%"
  // We can use Function constructor in a controlled, sanitized sandbox or a clean tokenizer
  try {
    // Replace standalone % with /100
    const processed = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const result = new Function(`"use strict"; return (${processed});`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Calculation error');
    }
    return result;
  } catch {
    throw new Error('Syntax error');
  }
}

// 2. Profit & Loss Calculator
export interface ProfitLossInput {
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  overheads: number;
}
export interface ProfitLossResult {
  totalCost: number;
  totalRevenue: number;
  netProfit: number;
  isProfit: boolean;
  profitPercentage: number; // On Cost
  marginPercentage: number; // On Revenue
  markupPercentage: number;
  profitPerUnit: number;
}
export function calculateProfitLoss(input: ProfitLossInput): ProfitLossResult {
  const { costPrice, sellingPrice, quantity, overheads } = input;
  const q = Math.max(1, quantity || 1);
  const totalCost = costPrice * q + (overheads || 0);
  const totalRevenue = sellingPrice * q;
  const netProfit = totalRevenue - totalCost;
  const isProfit = netProfit >= 0;

  const profitPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const marginPercentage = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const markupPercentage = costPrice > 0 ? ((sellingPrice - costPrice) / costPrice) * 100 : 0;
  const profitPerUnit = q > 0 ? netProfit / q : 0;

  return {
    totalCost,
    totalRevenue,
    netProfit,
    isProfit,
    profitPercentage,
    marginPercentage,
    markupPercentage,
    profitPerUnit,
  };
}

// 3. Margin & Markup Calculator
export interface MarginMarkupInput {
  mode: 'from_prices' | 'from_margin' | 'from_markup';
  costPrice: number;
  sellingPrice?: number;
  targetMargin?: number;
  targetMarkup?: number;
}
export interface MarginMarkupResult {
  costPrice: number;
  sellingPrice: number;
  grossProfit: number;
  marginPercent: number;
  markupPercent: number;
}
export function calculateMarginMarkup(input: MarginMarkupInput): MarginMarkupResult {
  const cost = Math.max(0, input.costPrice || 0);

  if (input.mode === 'from_margin') {
    const margin = Math.min(99.99, Math.max(0, input.targetMargin || 0));
    const selling = margin < 100 ? cost / (1 - margin / 100) : 0;
    const profit = selling - cost;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    return {
      costPrice: cost,
      sellingPrice: selling,
      grossProfit: profit,
      marginPercent: margin,
      markupPercent: markup,
    };
  } else if (input.mode === 'from_markup') {
    const markup = Math.max(0, input.targetMarkup || 0);
    const selling = cost * (1 + markup / 100);
    const profit = selling - cost;
    const margin = selling > 0 ? (profit / selling) * 100 : 0;
    return {
      costPrice: cost,
      sellingPrice: selling,
      grossProfit: profit,
      marginPercent: margin,
      markupPercent: markup,
    };
  } else {
    const selling = Math.max(0, input.sellingPrice || 0);
    const profit = selling - cost;
    const margin = selling > 0 ? (profit / selling) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    return {
      costPrice: cost,
      sellingPrice: selling,
      grossProfit: profit,
      marginPercent: margin,
      markupPercent: markup,
    };
  }
}

// 4. Discount Calculator
export interface DiscountInput {
  mrp: number;
  primaryDiscountPercent: number;
  cashDiscountPercent: number;
  applyGst: boolean;
  gstRate: number;
}
export interface DiscountResult {
  mrp: number;
  priceAfterPrimary: number;
  primarySavings: number;
  priceAfterSecondary: number;
  secondarySavings: number;
  totalDiscountAmount: number;
  effectiveDiscountPercent: number;
  gstAmount: number;
  finalPayable: number;
}
export function calculateDiscount(input: DiscountInput): DiscountResult {
  const mrp = Math.max(0, input.mrp || 0);
  const d1 = Math.min(100, Math.max(0, input.primaryDiscountPercent || 0));
  const d2 = Math.min(100, Math.max(0, input.cashDiscountPercent || 0));

  const primarySavings = (mrp * d1) / 100;
  const priceAfterPrimary = mrp - primarySavings;

  const secondarySavings = (priceAfterPrimary * d2) / 100;
  const priceAfterSecondary = priceAfterPrimary - secondarySavings;

  const totalDiscountAmount = primarySavings + secondarySavings;
  const effectiveDiscountPercent = mrp > 0 ? (totalDiscountAmount / mrp) * 100 : 0;

  let gstAmount = 0;
  if (input.applyGst && input.gstRate > 0) {
    gstAmount = (priceAfterSecondary * input.gstRate) / 100;
  }
  const finalPayable = priceAfterSecondary + gstAmount;

  return {
    mrp,
    priceAfterPrimary,
    primarySavings,
    priceAfterSecondary,
    secondarySavings,
    totalDiscountAmount,
    effectiveDiscountPercent,
    gstAmount,
    finalPayable,
  };
}

// 5. GST Calculator (Indian GST standard)
export interface GstInput {
  amount: number;
  rate: number;
  mode: 'exclusive' | 'inclusive';
  supplyType: 'intra_state' | 'inter_state';
  inputGst?: number; // For Input Tax Credit (ITC) offset
}
export interface GstResult {
  baseAmount: number;
  gstRate: number;
  totalGst: number;
  grossAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  inputGstCredit: number;
  netGstPayable: number;
}
export function calculateGST(input: GstInput): GstResult {
  const rate = Math.max(0, input.rate || 0);
  const amt = Math.max(0, input.amount || 0);
  const inputCredit = Math.max(0, input.inputGst || 0);

  let baseAmount = 0;
  let totalGst = 0;
  let grossAmount = 0;

  if (input.mode === 'inclusive') {
    // Gross = Base + (Base * rate / 100) => Base = Gross / (1 + rate / 100)
    grossAmount = amt;
    baseAmount = rate > 0 ? amt / (1 + rate / 100) : amt;
    totalGst = grossAmount - baseAmount;
  } else {
    baseAmount = amt;
    totalGst = (amt * rate) / 100;
    grossAmount = baseAmount + totalGst;
  }

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (input.supplyType === 'inter_state') {
    igst = totalGst;
  } else {
    cgst = totalGst / 2;
    sgst = totalGst / 2;
  }

  const netGstPayable = Math.max(0, totalGst - inputCredit);

  return {
    baseAmount,
    gstRate: rate,
    totalGst,
    grossAmount,
    cgst,
    sgst,
    igst,
    inputGstCredit: inputCredit,
    netGstPayable,
  };
}

// 6. EMI / Business Loan Calculator
export interface EmiInput {
  loanAmount: number;
  annualRate: number;
  tenureMonths: number;
  prepaymentMonthly?: number;
}
export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  interestRatioPercent: number;
  yearlyAmortization: Array<{
    year: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }>;
}
export function calculateEMI(input: EmiInput): EmiResult {
  const P = Math.max(0, input.loanAmount || 0);
  const annualRate = Math.max(0, input.annualRate || 0);
  const n = Math.max(1, input.tenureMonths || 1);

  if (P === 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
      interestRatioPercent: 0,
      yearlyAmortization: [],
    };
  }

  let emi = 0;
  if (annualRate === 0) {
    emi = P / n;
  } else {
    const r = annualRate / (12 * 100);
    emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = Math.max(0, totalPayment - P);
  const interestRatioPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Build yearly amortization schedule
  const r = annualRate / (12 * 100);
  let balance = P;
  const yearlyAmortization: Array<{
    year: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }> = [];

  const totalYears = Math.ceil(n / 12);
  for (let y = 1; y <= totalYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    const monthsInYear = Math.min(12, n - (y - 1) * 12);

    for (let m = 0; m < monthsInYear; m++) {
      if (balance <= 0) break;
      const monthInterest = annualRate === 0 ? 0 : balance * r;
      const monthPrincipal = Math.min(balance, emi - monthInterest);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      balance = Math.max(0, balance - monthPrincipal);
    }

    yearlyAmortization.push({
      year: y,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      balance,
    });
  }

  return {
    monthlyEmi: emi,
    totalInterest,
    totalPayment,
    interestRatioPercent,
    yearlyAmortization,
  };
}

// 7. Business Expenses / OPEX
export interface ExpensesInput {
  rent: number;
  electricityWater: number;
  salaries: number;
  supplies: number;
  marketing: number;
  maintenance: number;
  refreshments: number;
  misc: number;
}
export interface ExpensesResult {
  totalMonthly: number;
  dailyRunRate: number;
  yearlyExpense: number;
  largestExpenseName: string;
  largestExpenseAmount: number;
  breakdown: Array<{ name: string; amount: number; percent: number }>;
}
export function calculateExpenses(input: ExpensesInput): ExpensesResult {
  const items = [
    { name: 'Rent', amount: Math.max(0, input.rent || 0) },
    { name: 'Electricity & Water', amount: Math.max(0, input.electricityWater || 0) },
    { name: 'Staff Salaries', amount: Math.max(0, input.salaries || 0) },
    { name: 'Supplies & Consumables', amount: Math.max(0, input.supplies || 0) },
    { name: 'Marketing & Ads', amount: Math.max(0, input.marketing || 0) },
    { name: 'Maintenance & Repairs', amount: Math.max(0, input.maintenance || 0) },
    { name: 'Tea & Refreshments', amount: Math.max(0, input.refreshments || 0) },
    { name: 'Miscellaneous', amount: Math.max(0, input.misc || 0) },
  ];

  const totalMonthly = items.reduce((acc, curr) => acc + curr.amount, 0);
  const dailyRunRate = totalMonthly / 30;
  const yearlyExpense = totalMonthly * 12;

  let largestExpenseName = 'None';
  let largestExpenseAmount = 0;

  const breakdown = items.map((item) => {
    if (item.amount > largestExpenseAmount) {
      largestExpenseAmount = item.amount;
      largestExpenseName = item.name;
    }
    return {
      name: item.name,
      amount: item.amount,
      percent: totalMonthly > 0 ? (item.amount / totalMonthly) * 100 : 0,
    };
  });

  return {
    totalMonthly,
    dailyRunRate,
    yearlyExpense,
    largestExpenseName,
    largestExpenseAmount,
    breakdown,
  };
}

// 8. Retail & Kirana Store Calculator
export interface RetailKiranaInput {
  subType: 'loose_weight' | 'carton_margin';
  // Loose item
  ratePerKg?: number;
  targetGrams?: number;
  targetMoney?: number;
  mode?: 'grams_to_rupees' | 'rupees_to_grams';
  // Carton margin
  cartonCost?: number;
  unitsInCarton?: number;
  mrpPerUnit?: number;
}
export interface RetailKiranaResult {
  // Loose
  calculatedValue: number; // Rupees or Grams depending on mode
  unitRatePerGram?: number;
  // Carton
  costPerUnit?: number;
  totalCartonMrp?: number;
  cartonProfit?: number;
  cartonMarginPercent?: number;
  profitPerUnit?: number;
}
export function calculateRetailKirana(input: RetailKiranaInput): RetailKiranaResult {
  if (input.subType === 'loose_weight') {
    const ratePerKg = Math.max(0, input.ratePerKg || 0);
    const ratePerGram = ratePerKg / 1000;

    if (input.mode === 'rupees_to_grams') {
      const money = Math.max(0, input.targetMoney || 0);
      const grams = ratePerKg > 0 ? (money / ratePerKg) * 1000 : 0;
      return {
        calculatedValue: grams,
        unitRatePerGram: ratePerGram,
      };
    } else {
      const grams = Math.max(0, input.targetGrams || 0);
      const rupees = grams * ratePerGram;
      return {
        calculatedValue: rupees,
        unitRatePerGram: ratePerGram,
      };
    }
  } else {
    const cartonCost = Math.max(0, input.cartonCost || 0);
    const units = Math.max(1, input.unitsInCarton || 1);
    const mrp = Math.max(0, input.mrpPerUnit || 0);

    const costPerUnit = cartonCost / units;
    const totalCartonMrp = units * mrp;
    const cartonProfit = totalCartonMrp - cartonCost;
    const cartonMarginPercent = totalCartonMrp > 0 ? (cartonProfit / totalCartonMrp) * 100 : 0;
    const profitPerUnit = mrp - costPerUnit;

    return {
      calculatedValue: cartonProfit,
      costPerUnit,
      totalCartonMrp,
      cartonProfit,
      cartonMarginPercent,
      profitPerUnit,
    };
  }
}

// 9. Inventory & Stock Valuation
export interface InventoryInput {
  annualDemand: number;
  orderingCostPerOrder: number;
  holdingCostPerUnitYear: number;
  leadTimeDays: number;
  dailyUsageRate: number;
  safetyStock: number;
  avgInventoryValue: number;
  cogs: number;
}
export interface InventoryResult {
  eoq: number;
  ordersPerYear: number;
  reorderLevel: number;
  stockTurnoverRatio: number;
  daysSalesOfInventory: number;
}
export function calculateInventory(input: InventoryInput): InventoryResult {
  const D = Math.max(0, input.annualDemand || 0);
  const S = Math.max(0, input.orderingCostPerOrder || 0);
  const H = Math.max(0.001, input.holdingCostPerUnitYear || 0.001);

  // EOQ = sqrt( (2 * D * S) / H )
  const eoq = Math.round(Math.sqrt((2 * D * S) / H));
  const ordersPerYear = eoq > 0 ? +(D / eoq).toFixed(1) : 0;

  // Reorder Level = (Daily Usage * Lead Time) + Safety Stock
  const reorderLevel = Math.round(
    (input.dailyUsageRate || 0) * (input.leadTimeDays || 0) + (input.safetyStock || 0)
  );

  // Turnover = COGS / Avg Inventory Value
  const cogs = Math.max(0, input.cogs || 0);
  const avgInv = Math.max(1, input.avgInventoryValue || 1);
  const stockTurnoverRatio = +(cogs / avgInv).toFixed(2);
  const daysSalesOfInventory = stockTurnoverRatio > 0 ? Math.round(365 / stockTurnoverRatio) : 0;

  return {
    eoq,
    ordersPerYear,
    reorderLevel,
    stockTurnoverRatio,
    daysSalesOfInventory,
  };
}

// 10. Business Finance & Break-Even
export interface BusinessFinanceInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  receivables: number;
  inventoryValue: number;
  payables: number;
  cashBalance: number;
  monthlyBurnRate: number;
}
export interface BusinessFinanceResult {
  contributionMargin: number;
  contributionMarginRatio: number; // P/V ratio %
  breakEvenUnits: number;
  breakEvenSales: number;
  workingCapital: number;
  cashRunwayMonths: number;
}
export function calculateBusinessFinance(input: BusinessFinanceInput): BusinessFinanceResult {
  const FC = Math.max(0, input.fixedCosts || 0);
  const VC = Math.max(0, input.variableCostPerUnit || 0);
  const SP = Math.max(0, input.sellingPricePerUnit || 0);

  const contributionMargin = SP - VC;
  const contributionMarginRatio = SP > 0 ? (contributionMargin / SP) * 100 : 0;

  let breakEvenUnits = 0;
  let breakEvenSales = 0;

  if (contributionMargin > 0) {
    breakEvenUnits = Math.ceil(FC / contributionMargin);
    breakEvenSales = breakEvenUnits * SP;
  }

  // Working Capital = Receivables + Inventory - Payables
  const workingCapital = (input.receivables || 0) + (input.inventoryValue || 0) - (input.payables || 0);

  // Runway = Cash / Monthly Burn
  const burn = Math.max(0, input.monthlyBurnRate || 0);
  const cash = Math.max(0, input.cashBalance || 0);
  const cashRunwayMonths = burn > 0 ? +(cash / burn).toFixed(1) : 999;

  return {
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenSales,
    workingCapital,
    cashRunwayMonths,
  };
}

// 11. Agriculture & Mandi (किसान एवं मंडी व्यापारी)
export interface AgricultureMandiInput {
  mode: 'mandi_payout' | 'cultivation_cost';
  // Mandi
  weightQuintals?: number;
  ratePerQuintal?: number;
  bagCount?: number;
  hamaliPerBag?: number;
  mandiCessPercent?: number; // APMC Cess / Arhatiya Commission %
  weighingCharges?: number;
  // Cultivation
  acreArea?: number;
  seedCost?: number;
  fertilizerCost?: number;
  pesticideCost?: number;
  dieselTractorCost?: number;
  laborCost?: number;
  irrigationCost?: number;
  expectedYieldQuintalsPerAcre?: number;
  expectedMarketRatePerQuintal?: number;
}
export interface AgricultureMandiResult {
  // Mandi
  grossSaleValue?: number;
  totalHamali?: number;
  totalCess?: number;
  totalDeductions?: number;
  netFarmerPayout?: number;
  netRatePerQuintal?: number;
  // Cultivation
  totalCultivationCost?: number;
  costPerAcre?: number;
  expectedTotalYield?: number;
  expectedGrossRevenue?: number;
  netFarmerProfit?: number;
  profitPerAcre?: number;
}
export function calculateAgricultureMandi(input: AgricultureMandiInput): AgricultureMandiResult {
  if (input.mode === 'mandi_payout') {
    const weight = Math.max(0, input.weightQuintals || 0);
    const rate = Math.max(0, input.ratePerQuintal || 0);
    const bags = Math.max(0, input.bagCount || Math.ceil(weight * 2)); // default 50kg bags
    const hamali = bags * Math.max(0, input.hamaliPerBag || 0);
    const weighing = Math.max(0, input.weighingCharges || 0);

    const grossSaleValue = weight * rate;
    const cessRate = Math.max(0, input.mandiCessPercent || 0);
    const totalCess = (grossSaleValue * cessRate) / 100;
    const totalDeductions = hamali + totalCess + weighing;
    const netFarmerPayout = Math.max(0, grossSaleValue - totalDeductions);
    const netRatePerQuintal = weight > 0 ? netFarmerPayout / weight : 0;

    return {
      grossSaleValue,
      totalHamali: hamali,
      totalCess,
      totalDeductions,
      netFarmerPayout,
      netRatePerQuintal,
    };
  } else {
    const acres = Math.max(1, input.acreArea || 1);
    const seeds = (input.seedCost || 0) * acres;
    const fert = (input.fertilizerCost || 0) * acres;
    const pest = (input.pesticideCost || 0) * acres;
    const tractor = (input.dieselTractorCost || 0) * acres;
    const labor = (input.laborCost || 0) * acres;
    const irrig = (input.irrigationCost || 0) * acres;

    const totalCultivationCost = seeds + fert + pest + tractor + labor + irrig;
    const costPerAcre = totalCultivationCost / acres;

    const yieldPerAcre = Math.max(0, input.expectedYieldQuintalsPerAcre || 0);
    const expectedTotalYield = yieldPerAcre * acres;
    const marketRate = Math.max(0, input.expectedMarketRatePerQuintal || 0);

    const expectedGrossRevenue = expectedTotalYield * marketRate;
    const netFarmerProfit = expectedGrossRevenue - totalCultivationCost;
    const profitPerAcre = netFarmerProfit / acres;

    return {
      totalCultivationCost,
      costPerAcre,
      expectedTotalYield,
      expectedGrossRevenue,
      netFarmerProfit,
      profitPerAcre,
    };
  }
}

// 12. Construction & Civil Works
export interface ConstructionInput {
  subType: 'concrete_mix' | 'brickwork' | 'builtup_cost';
  // Concrete
  volumeCuM?: number;
  grade?: 'M15' | 'M20' | 'M25'; // M15 (1:2:4), M20 (1:1.5:3), M25 (1:1:2)
  // Brickwork
  wallLengthFt?: number;
  wallHeightFt?: number;
  wallThicknessInches?: 4.5 | 9;
  // Builtup cost
  areaSqFt?: number;
  ratePerSqFt?: number;
}
export interface ConstructionResult {
  cementBags: number;
  sandCuFt: number;
  aggregateCuFt: number;
  totalBricks?: number;
  mortarCementBags?: number;
  mortarSandCuFt?: number;
  totalBuiltupCost?: number;
}
export function calculateConstruction(input: ConstructionInput): ConstructionResult {
  if (input.subType === 'concrete_mix') {
    const wetVol = Math.max(0, input.volumeCuM || 0);
    // Dry volume factor in Indian construction is 1.54
    const dryVol = wetVol * 1.54;

    let cRatio = 1;
    let sRatio = 2;
    let aRatio = 4;

    if (input.grade === 'M20') {
      sRatio = 1.5;
      aRatio = 3;
    } else if (input.grade === 'M25') {
      sRatio = 1;
      aRatio = 2;
    }

    const totalRatio = cRatio + sRatio + aRatio;
    const cementVol = (cRatio / totalRatio) * dryVol;
    // 1 bag cement = 0.0347 cu.m or 50 kg
    const cementBags = Math.ceil(cementVol / 0.0347);

    // 1 cu.m = 35.3147 cu.ft
    const sandVolCuM = (sRatio / totalRatio) * dryVol;
    const sandCuFt = +(sandVolCuM * 35.3147).toFixed(1);

    const aggVolCuM = (aRatio / totalRatio) * dryVol;
    const aggregateCuFt = +(aggVolCuM * 35.3147).toFixed(1);

    return { cementBags, sandCuFt, aggregateCuFt };
  } else if (input.subType === 'brickwork') {
    const length = Math.max(0, input.wallLengthFt || 0);
    const height = Math.max(0, input.wallHeightFt || 0);
    const wallArea = length * height;
    const thickness = input.wallThicknessInches || 9;

    // Standard Indian modular brick: 9" wall takes ~10.5 bricks per sq ft; 4.5" wall takes ~5 bricks per sq ft
    const bricksPerSqFt = thickness === 4.5 ? 4.8 : 9.6;
    const nominalBricks = wallArea * bricksPerSqFt;
    // 5% wastage
    const totalBricks = Math.ceil(nominalBricks * 1.05);

    // Mortar estimation: 9" wall ~1.2 bags cement per 100 sq ft, sand ~14 cu.ft per 100 sq ft
    const factor = wallArea / 100;
    const mortarCementBags = Math.ceil(factor * (thickness === 4.5 ? 0.6 : 1.25));
    const mortarSandCuFt = +(factor * (thickness === 4.5 ? 6 : 13.5)).toFixed(1);

    return {
      cementBags: mortarCementBags,
      sandCuFt: mortarSandCuFt,
      aggregateCuFt: 0,
      totalBricks,
      mortarCementBags,
      mortarSandCuFt,
    };
  } else {
    const area = Math.max(0, input.areaSqFt || 0);
    const rate = Math.max(0, input.ratePerSqFt || 0);
    const totalBuiltupCost = area * rate;
    return {
      cementBags: 0,
      sandCuFt: 0,
      aggregateCuFt: 0,
      totalBuiltupCost,
    };
  }
}

// 13. Transport & Fleet Logistics
export interface TransportInput {
  distanceKm: number;
  mileageKmPerLitre: number;
  fuelPricePerLitre: number;
  tollCharges: number;
  driverBhatta: number;
  loadingUnloading: number;
  otherOverheads: number;
  freightRateQuote: number;
  cargoTonnage: number;
}
export interface TransportResult {
  fuelLitresNeeded: number;
  totalFuelCost: number;
  totalTripExpense: number;
  netTripProfit: number;
  costPerKm: number;
  costPerTonKm: number;
  profitMarginPercent: number;
}
export function calculateTransport(input: TransportInput): TransportResult {
  const km = Math.max(0, input.distanceKm || 0);
  const mileage = Math.max(0.5, input.mileageKmPerLitre || 1);
  const fuelPrice = Math.max(0, input.fuelPricePerLitre || 0);

  const fuelLitresNeeded = +(km / mileage).toFixed(2);
  const totalFuelCost = +(fuelLitresNeeded * fuelPrice).toFixed(2);

  const totalTripExpense =
    totalFuelCost +
    Math.max(0, input.tollCharges || 0) +
    Math.max(0, input.driverBhatta || 0) +
    Math.max(0, input.loadingUnloading || 0) +
    Math.max(0, input.otherOverheads || 0);

  const freight = Math.max(0, input.freightRateQuote || 0);
  const netTripProfit = freight - totalTripExpense;

  const costPerKm = km > 0 ? +(totalTripExpense / km).toFixed(2) : 0;
  const tonnage = Math.max(1, input.cargoTonnage || 1);
  const tonKm = km * tonnage;
  const costPerTonKm = tonKm > 0 ? +(totalTripExpense / tonKm).toFixed(2) : 0;
  const profitMarginPercent = freight > 0 ? +((netTripProfit / freight) * 100).toFixed(2) : 0;

  return {
    fuelLitresNeeded,
    totalFuelCost,
    totalTripExpense,
    netTripProfit,
    costPerKm,
    costPerTonKm,
    profitMarginPercent,
  };
}

// 14. Restaurant & F&B Calculator
export interface RestaurantInput {
  subType: 'food_cost_ratio' | 'table_turnover';
  // Food cost
  ingredientCostPerDish?: number;
  sellingPricePerDish?: number;
  dailyDishQuantity?: number;
  // Table turnover
  totalSeats?: number;
  avgSpendPerCustomer?: number;
  tableTurnsPerDay?: number;
  operatingDaysMonth?: number;
}
export interface RestaurantResult {
  foodCostPercentage?: number;
  grossProfitPerDish?: number;
  monthlyDishProfit?: number;
  dailyRevenuePotential?: number;
  monthlyRevenuePotential?: number;
  isFoodCostHealthy?: boolean; // 28% to 35% is standard
}
export function calculateRestaurant(input: RestaurantInput): RestaurantResult {
  if (input.subType === 'food_cost_ratio') {
    const cost = Math.max(0, input.ingredientCostPerDish || 0);
    const sp = Math.max(0, input.sellingPricePerDish || 0);
    const qty = Math.max(0, input.dailyDishQuantity || 0);

    const foodCostPercentage = sp > 0 ? +((cost / sp) * 100).toFixed(1) : 0;
    const grossProfitPerDish = sp - cost;
    const monthlyDishProfit = grossProfitPerDish * qty * 30;
    const isFoodCostHealthy = foodCostPercentage >= 25 && foodCostPercentage <= 35;

    return {
      foodCostPercentage,
      grossProfitPerDish,
      monthlyDishProfit,
      isFoodCostHealthy,
    };
  } else {
    const seats = Math.max(0, input.totalSeats || 0);
    const spend = Math.max(0, input.avgSpendPerCustomer || 0);
    const turns = Math.max(0, input.tableTurnsPerDay || 0);
    const days = Math.max(1, input.operatingDaysMonth || 30);

    const dailyRevenuePotential = seats * turns * spend;
    const monthlyRevenuePotential = dailyRevenuePotential * days;

    return {
      dailyRevenuePotential,
      monthlyRevenuePotential,
    };
  }
}

// 15. E-commerce Seller (Amazon/Flipkart/Meesho)
export interface EcommerceInput {
  sellingPrice: number;
  productCost: number;
  packagingCost: number;
  shippingFee: number;
  referralCommissionPercent: number;
  fixedClosingFee: number;
  paymentGatewayPercent: number; // typically 2%
  expectedReturnRatePercent: number; // e.g. 10% returns
  reverseShippingOnReturn: number;
}
export interface EcommerceResult {
  marketplaceCommission: number;
  paymentGatewayFee: number;
  gstOnMarketplaceFees: number; // 18% GST on services
  totalMarketplaceDeductions: number;
  netPayoutToBank: number;
  netProfitPerDeliveredOrder: number;
  rtoLossBufferPerUnit: number;
  effectiveNetProfit: number;
  netMarginPercent: number;
}
export function calculateEcommerce(input: EcommerceInput): EcommerceResult {
  const sp = Math.max(0, input.sellingPrice || 0);
  const cost = Math.max(0, input.productCost || 0);
  const pack = Math.max(0, input.packagingCost || 0);
  const ship = Math.max(0, input.shippingFee || 0);
  const commPercent = Math.max(0, input.referralCommissionPercent || 0);
  const fixedFee = Math.max(0, input.fixedClosingFee || 0);
  const pgPercent = Math.max(0, input.paymentGatewayPercent || 2);

  const marketplaceCommission = (sp * commPercent) / 100;
  const paymentGatewayFee = (sp * pgPercent) / 100;

  // Total fees charged by marketplace subject to 18% GST (CGST 9% + SGST 9%)
  const taxableServiceFees = marketplaceCommission + fixedFee + ship + paymentGatewayFee;
  const gstOnMarketplaceFees = (taxableServiceFees * 18) / 100;

  const totalMarketplaceDeductions = taxableServiceFees + gstOnMarketplaceFees;
  const netPayoutToBank = sp - totalMarketplaceDeductions;

  const netProfitPerDeliveredOrder = netPayoutToBank - cost - pack;

  // Return / RTO loss buffer calculation
  const returnRate = Math.min(100, Math.max(0, input.expectedReturnRatePercent || 0)) / 100;
  const reverseShip = Math.max(0, input.reverseShippingOnReturn || ship);
  // On return: seller loses forward + reverse shipping + packaging cost
  const lossPerReturn = ship + reverseShip + pack;
  const rtoLossBufferPerUnit = lossPerReturn * returnRate;

  const effectiveNetProfit = netProfitPerDeliveredOrder - rtoLossBufferPerUnit;
  const netMarginPercent = sp > 0 ? (effectiveNetProfit / sp) * 100 : 0;

  return {
    marketplaceCommission,
    paymentGatewayFee,
    gstOnMarketplaceFees,
    totalMarketplaceDeductions,
    netPayoutToBank,
    netProfitPerDeliveredOrder,
    rtoLossBufferPerUnit,
    effectiveNetProfit,
    netMarginPercent,
  };
}

// 16. Digital Marketing & Ads (ROAS & CAC)
export interface MarketingInput {
  adSpend: number;
  conversions: number; // purchases or qualified leads
  revenueGenerated: number;
  impressions?: number;
  clicks?: number;
  avgCustomerLifetimeValue?: number;
}
export interface MarketingResult {
  cac: number; // Customer Acquisition Cost
  roas: number; // Return on Ad Spend (multiplier e.g. 3.5x)
  roasPercent: number;
  profitAfterAdSpend: number;
  ctr: number; // Click Through Rate %
  cpc: number; // Cost Per Click
  cpm: number; // Cost Per Mille
  conversionRate: number; // %
  ltvToCacRatio: number; // Healthy > 3.0
}
export function calculateMarketing(input: MarketingInput): MarketingResult {
  const spend = Math.max(0, input.adSpend || 0);
  const conv = Math.max(0, input.conversions || 0);
  const rev = Math.max(0, input.revenueGenerated || 0);
  const clicks = Math.max(0, input.clicks || 0);
  const impressions = Math.max(0, input.impressions || 0);
  const ltv = Math.max(0, input.avgCustomerLifetimeValue || 0);

  const cac = conv > 0 ? spend / conv : 0;
  const roas = spend > 0 ? rev / spend : 0;
  const roasPercent = roas * 100;
  const profitAfterAdSpend = rev - spend;

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const conversionRate = clicks > 0 ? (conv / clicks) * 100 : 0;
  const ltvToCacRatio = cac > 0 ? +(ltv / cac).toFixed(2) : 0;

  return {
    cac,
    roas: +roas.toFixed(2),
    roasPercent: +roasPercent.toFixed(1),
    profitAfterAdSpend,
    ctr: +ctr.toFixed(2),
    cpc: +cpc.toFixed(2),
    cpm: +cpm.toFixed(2),
    conversionRate: +conversionRate.toFixed(2),
    ltvToCacRatio,
  };
}

// 17. Salary & Payroll (Indian Pay Structure)
export interface SalaryInput {
  monthlyGrossSalary: number;
  basicPayPercent: number; // usually 40% - 50%
  hraPercent: number; // usually 20% - 25%
  isEpUncapped: boolean; // 12% on actual basic or capped at ₹15,000 wage ceiling
  professionalTax: number; // standard ₹200/mo
  estimatedMonthlyTds: number;
  yearsOfServiceForGratuity?: number;
}
export interface SalaryResult {
  basicPay: number;
  hra: number;
  specialAllowance: number;
  employeePf: number;
  employerPf: number;
  professionalTax: number;
  monthlyTds: number;
  totalDeductions: number;
  netInHandSalary: number;
  gratuityAmount?: number;
}
export function calculateSalary(input: SalaryInput): SalaryResult {
  const gross = Math.max(0, input.monthlyGrossSalary || 0);
  const basicPct = Math.min(100, Math.max(10, input.basicPayPercent || 40));
  const hraPct = Math.min(100, Math.max(0, input.hraPercent || 20));

  const basicPay = (gross * basicPct) / 100;
  const hra = (gross * hraPct) / 100;
  const specialAllowance = Math.max(0, gross - (basicPay + hra));

  // EPF wage ceiling is ₹15,000 / month in India
  const pfBasicBase = input.isEpUncapped ? basicPay : Math.min(basicPay, 15000);
  const employeePf = Math.round((pfBasicBase * 12) / 100);
  const employerPf = employeePf; // Standard 12% match (split into EPS 8.33% and EPF 3.67%)

  const pt = Math.max(0, input.professionalTax || 200);
  const tds = Math.max(0, input.estimatedMonthlyTds || 0);

  const totalDeductions = employeePf + pt + tds;
  const netInHandSalary = Math.max(0, gross - totalDeductions);

  // Gratuity in India under Gratuity Act 1972: (15 * Last drawn basic * Tenure in completed years) / 26
  let gratuityAmount = 0;
  const years = Math.max(0, input.yearsOfServiceForGratuity || 0);
  if (years >= 5) {
    gratuityAmount = Math.round((15 * basicPay * years) / 26);
  }

  return {
    basicPay,
    hra,
    specialAllowance,
    employeePf,
    employerPf,
    professionalTax: pt,
    monthlyTds: tds,
    totalDeductions,
    netInHandSalary,
    gratuityAmount,
  };
}

// 18. Real Estate & Property Yield
export interface RealEstateInput {
  propertyValue: number;
  monthlyRentalIncome: number;
  annualPropertyTax: number;
  annualMaintenance: number;
  stampDutyPercent: number; // 5% - 7%
  registrationPercent: number; // 1%
}
export interface RealEstateResult {
  grossAnnualRent: number;
  grossRentalYieldPercent: number;
  netAnnualRent: number;
  netRentalYieldPercent: number;
  stampDutyAmount: number;
  registrationAmount: number;
  totalAcquisitionCost: number;
}
export function calculateRealEstate(input: RealEstateInput): RealEstateResult {
  const value = Math.max(0, input.propertyValue || 0);
  const rent = Math.max(0, input.monthlyRentalIncome || 0);
  const tax = Math.max(0, input.annualPropertyTax || 0);
  const maint = Math.max(0, input.annualMaintenance || 0);

  const grossAnnualRent = rent * 12;
  const grossRentalYieldPercent = value > 0 ? +((grossAnnualRent / value) * 100).toFixed(2) : 0;

  const netAnnualRent = grossAnnualRent - tax - maint;
  const netRentalYieldPercent = value > 0 ? +((netAnnualRent / value) * 100).toFixed(2) : 0;

  const stampDutyRate = Math.max(0, input.stampDutyPercent || 6);
  const regRate = Math.max(0, input.registrationPercent || 1);

  const stampDutyAmount = (value * stampDutyRate) / 100;
  const registrationAmount = (value * regRate) / 100;
  const totalAcquisitionCost = value + stampDutyAmount + registrationAmount;

  return {
    grossAnnualRent,
    grossRentalYieldPercent,
    netAnnualRent,
    netRentalYieldPercent,
    stampDutyAmount,
    registrationAmount,
    totalAcquisitionCost,
  };
}

// 19. Manufacturing & Job Work
export interface ManufacturingInput {
  rawMaterialPerUnit: number;
  directLaborPerUnit: number;
  machineHourlyRate: number;
  machineHoursPerUnit: number;
  factoryOverheadPerUnit: number;
  scrapPercentage: number;
  targetMarginPercent: number;
  batchQuantity: number;
}
export interface ManufacturingResult {
  baseUnitCost: number;
  scrapCostPerUnit: number;
  totalUnitCost: number;
  totalBatchCost: number;
  recommendedSellingPricePerUnit: number;
  totalBatchQuote: number;
  batchGrossProfit: number;
}
export function calculateManufacturing(input: ManufacturingInput): ManufacturingResult {
  const rm = Math.max(0, input.rawMaterialPerUnit || 0);
  const dl = Math.max(0, input.directLaborPerUnit || 0);
  const machineRate = Math.max(0, input.machineHourlyRate || 0);
  const machineHours = Math.max(0, input.machineHoursPerUnit || 0);
  const machineCost = machineRate * machineHours;
  const overhead = Math.max(0, input.factoryOverheadPerUnit || 0);

  const baseUnitCost = rm + dl + machineCost + overhead;
  const scrapPct = Math.max(0, input.scrapPercentage || 0);
  const scrapCostPerUnit = (baseUnitCost * scrapPct) / 100;
  const totalUnitCost = baseUnitCost + scrapCostPerUnit;

  const qty = Math.max(1, input.batchQuantity || 1);
  const totalBatchCost = totalUnitCost * qty;

  const marginPct = Math.min(95, Math.max(0, input.targetMarginPercent || 20));
  const recommendedSellingPricePerUnit = marginPct < 100 ? totalUnitCost / (1 - marginPct / 100) : totalUnitCost * 1.25;

  const totalBatchQuote = recommendedSellingPricePerUnit * qty;
  const batchGrossProfit = totalBatchQuote - totalBatchCost;

  return {
    baseUnitCost: +baseUnitCost.toFixed(2),
    scrapCostPerUnit: +scrapCostPerUnit.toFixed(2),
    totalUnitCost: +totalUnitCost.toFixed(2),
    totalBatchCost: +totalBatchCost.toFixed(2),
    recommendedSellingPricePerUnit: +recommendedSellingPricePerUnit.toFixed(2),
    totalBatchQuote: +totalBatchQuote.toFixed(2),
    batchGrossProfit: +batchGrossProfit.toFixed(2),
  };
}

// 20. Freelancing & Professional Fees
export interface FreelancingInput {
  desiredMonthlyIncome: number;
  monthlyBusinessOverheads: number;
  billableHoursPerWeek: number;
  paidWeeksOffPerYear: number;
  taxBufferPercent: number; // typically 10% under 44ADA
  apply194jTds: boolean; // Section 194J 10% or 2% TDS
  tdsRate: number;
}
export interface FreelancingResult {
  requiredAnnualRevenue: number;
  effectiveWorkingWeeks: number;
  totalBillableHoursPerYear: number;
  hourlyRate: number;
  dayRate: number;
  invoiceAmountFor100k: number;
  tdsDeductionOn100k: number;
  netInHandFrom100k: number;
}
export function calculateFreelancing(input: FreelancingInput): FreelancingResult {
  const monthlyTakeHome = Math.max(0, input.desiredMonthlyIncome || 0);
  const overheads = Math.max(0, input.monthlyBusinessOverheads || 0);
  const taxPct = Math.min(50, Math.max(0, input.taxBufferPercent || 10));

  const monthlyGrossNeeded = (monthlyTakeHome + overheads) / (1 - taxPct / 100);
  const requiredAnnualRevenue = monthlyGrossNeeded * 12;

  const weeksOff = Math.min(50, Math.max(0, input.paidWeeksOffPerYear || 4));
  const effectiveWorkingWeeks = Math.max(1, 52 - weeksOff);
  const weeklyHours = Math.max(1, input.billableHoursPerWeek || 25);
  const totalBillableHoursPerYear = effectiveWorkingWeeks * weeklyHours;

  const hourlyRate = Math.ceil(requiredAnnualRevenue / totalBillableHoursPerYear);
  const dayRate = hourlyRate * 8;

  const tdsRate = input.apply194jTds ? Math.max(0, input.tdsRate || 10) : 0;
  const invoiceSample = 100000;
  const tdsDeductionOn100k = (invoiceSample * tdsRate) / 100;
  const netInHandFrom100k = invoiceSample - tdsDeductionOn100k;

  return {
    requiredAnnualRevenue: Math.round(requiredAnnualRevenue),
    effectiveWorkingWeeks,
    totalBillableHoursPerYear,
    hourlyRate,
    dayRate,
    invoiceAmountFor100k: invoiceSample,
    tdsDeductionOn100k,
    netInHandFrom100k,
  };
}

// 21. Coaching & Tuition Classes
export interface CoachingInput {
  numberOfBatches: number;
  studentsPerBatch: number;
  monthlyFeePerStudent: number;
  teacherSalaryPerBatch: number;
  classroomRentMonthly: number;
  electricityAndAcMonthly: number;
  notesPrintingPerStudent: number;
  miscExpenses: number;
}
export interface CoachingResult {
  totalStudents: number;
  grossMonthlyRevenue: number;
  facultyExpenses: number;
  totalPrintingCost: number;
  totalMonthlyExpenses: number;
  netMonthlyProfit: number;
  profitMarginPercent: number;
  profitPerStudent: number;
}
export function calculateCoaching(input: CoachingInput): CoachingResult {
  const batches = Math.max(1, input.numberOfBatches || 1);
  const studentsPerBatch = Math.max(0, input.studentsPerBatch || 0);
  const fee = Math.max(0, input.monthlyFeePerStudent || 0);

  const totalStudents = batches * studentsPerBatch;
  const grossMonthlyRevenue = totalStudents * fee;

  const facultyExpenses = batches * Math.max(0, input.teacherSalaryPerBatch || 0);
  const printing = totalStudents * Math.max(0, input.notesPrintingPerStudent || 0);

  const totalMonthlyExpenses =
    facultyExpenses +
    printing +
    Math.max(0, input.classroomRentMonthly || 0) +
    Math.max(0, input.electricityAndAcMonthly || 0) +
    Math.max(0, input.miscExpenses || 0);

  const netMonthlyProfit = grossMonthlyRevenue - totalMonthlyExpenses;
  const profitMarginPercent = grossMonthlyRevenue > 0 ? (netMonthlyProfit / grossMonthlyRevenue) * 100 : 0;
  const profitPerStudent = totalStudents > 0 ? netMonthlyProfit / totalStudents : 0;

  return {
    totalStudents,
    grossMonthlyRevenue,
    facultyExpenses,
    totalPrintingCost: printing,
    totalMonthlyExpenses,
    netMonthlyProfit,
    profitMarginPercent: +profitMarginPercent.toFixed(1),
    profitPerStudent: Math.round(profitPerStudent),
  };
}
