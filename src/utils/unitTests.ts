import { TestResult } from '../types';
import {
  evaluateBasicExpression,
  calculateProfitLoss,
  calculateMarginMarkup,
  calculateDiscount,
  calculateGST,
  calculateEMI,
  calculateExpenses,
  calculateRetailKirana,
  calculateInventory,
  calculateBusinessFinance,
  calculateAgricultureMandi,
  calculateConstruction,
  calculateTransport,
  calculateRestaurant,
  calculateEcommerce,
  calculateMarketing,
  calculateSalary,
  calculateRealEstate,
  calculateManufacturing,
  calculateFreelancing,
  calculateCoaching,
} from './calculations';

export function runAllUnitTests(): { total: number; passed: number; results: TestResult[] } {
  const results: TestResult[] = [];

  // 1. Basic Calculator
  try {
    const r1 = evaluateBasicExpression('250 + 150 * 2');
    results.push({
      id: 'basic-1',
      calculatorId: 'basic',
      name: 'Basic Calculator: Operator Precedence (250 + 150 * 2)',
      expected: '550',
      actual: String(r1),
      passed: r1 === 550,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    results.push({
      id: 'basic-1',
      calculatorId: 'basic',
      name: 'Basic Calculator: Operator Precedence',
      expected: '550',
      actual: errorMsg,
      passed: false,
    });
  }

  // 2. Profit & Loss
  const pl = calculateProfitLoss({
    costPrice: 1000,
    sellingPrice: 1500,
    quantity: 10,
    overheads: 500,
  });
  results.push({
    id: 'pl-1',
    calculatorId: 'profit_loss',
    name: 'Profit/Loss: Net Profit Calculation (CP: 1000, SP: 1500, Qty: 10, Overheads: 500)',
    expected: '4500',
    actual: String(pl.netProfit),
    passed: pl.netProfit === 4500 && pl.isProfit === true,
    notes: `Margin: ${pl.marginPercentage.toFixed(1)}%, Profit: ₹${pl.netProfit}`,
  });

  // 3. Margin & Markup
  const mm = calculateMarginMarkup({
    mode: 'from_prices',
    costPrice: 800,
    sellingPrice: 1000,
  });
  results.push({
    id: 'mm-1',
    calculatorId: 'margin_markup',
    name: 'Margin & Markup: From Cost 800 & Price 1000 (Margin 20%, Markup 25%)',
    expected: 'Margin: 20%, Markup: 25%',
    actual: `Margin: ${mm.marginPercent}%, Markup: ${mm.markupPercent}%`,
    passed: mm.marginPercent === 20 && mm.markupPercent === 25,
  });

  const mmTarget = calculateMarginMarkup({
    mode: 'from_margin',
    costPrice: 800,
    targetMargin: 20,
  });
  results.push({
    id: 'mm-2',
    calculatorId: 'margin_markup',
    name: 'Margin & Markup: Target 20% Margin on Cost 800 gives Price 1000',
    expected: '1000',
    actual: String(mmTarget.sellingPrice),
    passed: Math.round(mmTarget.sellingPrice) === 1000,
  });

  // 4. Discount
  const disc = calculateDiscount({
    mrp: 2000,
    primaryDiscountPercent: 10,
    cashDiscountPercent: 5,
    applyGst: false,
    gstRate: 0,
  });
  results.push({
    id: 'disc-1',
    calculatorId: 'discount',
    name: 'Discount: MRP 2000 with 10% Trade + 5% Cash Discount',
    expected: '1710',
    actual: String(disc.finalPayable),
    passed: disc.finalPayable === 1710 && disc.totalDiscountAmount === 290,
    notes: '2000 - 200 = 1800; 1800 - 90 = 1710',
  });

  // 5. GST
  const gstEx = calculateGST({
    amount: 10000,
    rate: 18,
    mode: 'exclusive',
    supplyType: 'intra_state',
  });
  results.push({
    id: 'gst-1',
    calculatorId: 'gst',
    name: 'GST: Exclusive 18% on ₹10,000 (CGST 900, SGST 900, Total 11800)',
    expected: 'Total: 11800, CGST: 900, SGST: 900',
    actual: `Total: ${gstEx.grossAmount}, CGST: ${gstEx.cgst}, SGST: ${gstEx.sgst}`,
    passed: gstEx.grossAmount === 11800 && gstEx.cgst === 900 && gstEx.sgst === 900,
  });

  const gstIn = calculateGST({
    amount: 11800,
    rate: 18,
    mode: 'inclusive',
    supplyType: 'intra_state',
    inputGst: 1000,
  });
  results.push({
    id: 'gst-2',
    calculatorId: 'gst',
    name: 'GST: Inclusive 18% on ₹11,800 with ₹1,000 ITC offset',
    expected: 'Base: 10000, Net Tax: 800',
    actual: `Base: ${Math.round(gstIn.baseAmount)}, Net Tax: ${Math.round(gstIn.netGstPayable)}`,
    passed: Math.round(gstIn.baseAmount) === 10000 && Math.round(gstIn.netGstPayable) === 800,
  });

  // 6. EMI
  const emi = calculateEMI({
    loanAmount: 100000,
    annualRate: 12,
    tenureMonths: 12,
  });
  const roundedEmi = Math.round(emi.monthlyEmi);
  results.push({
    id: 'emi-1',
    calculatorId: 'emi',
    name: 'EMI: ₹1 Lakh at 12% p.a. for 12 months (~₹8,885/month)',
    expected: '8885',
    actual: String(roundedEmi),
    passed: roundedEmi >= 8884 && roundedEmi <= 8886,
    notes: `Total Interest: ₹${Math.round(emi.totalInterest)}`,
  });

  // 7. Business Expenses
  const exp = calculateExpenses({
    rent: 20000,
    electricityWater: 5000,
    salaries: 40000,
    supplies: 10000,
    marketing: 5000,
    maintenance: 3000,
    refreshments: 2000,
    misc: 5000,
  });
  results.push({
    id: 'exp-1',
    calculatorId: 'expenses',
    name: 'Expenses: Monthly OPEX & Daily Break-Even Run Rate',
    expected: 'Total: 90000, Daily: 3000',
    actual: `Total: ${exp.totalMonthly}, Daily: ${exp.dailyRunRate}`,
    passed: exp.totalMonthly === 90000 && exp.dailyRunRate === 3000,
  });

  // 8. Retail Kirana
  const kiranaLoose = calculateRetailKirana({
    subType: 'loose_weight',
    mode: 'grams_to_rupees',
    ratePerKg: 80,
    targetGrams: 250,
  });
  results.push({
    id: 'kirana-1',
    calculatorId: 'retail_kirana',
    name: 'Retail Kirana: 250g sugar at ₹80/kg equals ₹20',
    expected: '20',
    actual: String(kiranaLoose.calculatedValue),
    passed: kiranaLoose.calculatedValue === 20,
  });

  // 9. Inventory EOQ
  const inv = calculateInventory({
    annualDemand: 10000,
    orderingCostPerOrder: 50,
    holdingCostPerUnitYear: 4,
    leadTimeDays: 7,
    dailyUsageRate: 30,
    safetyStock: 50,
    avgInventoryValue: 50000,
    cogs: 200000,
  });
  results.push({
    id: 'inv-1',
    calculatorId: 'inventory',
    name: 'Inventory: EOQ for Demand 10000, Order Cost 50, Holding 4 = 500 units',
    expected: '500',
    actual: String(inv.eoq),
    passed: inv.eoq === 500,
  });

  // 10. Business Finance
  const bf = calculateBusinessFinance({
    fixedCosts: 50000,
    variableCostPerUnit: 20,
    sellingPricePerUnit: 45,
    receivables: 100000,
    inventoryValue: 80000,
    payables: 60000,
    cashBalance: 150000,
    monthlyBurnRate: 50000,
  });
  results.push({
    id: 'bf-1',
    calculatorId: 'business_finance',
    name: 'Business Finance: Break-Even Units (50000 / (45 - 20) = 2000 units)',
    expected: '2000',
    actual: String(bf.breakEvenUnits),
    passed: bf.breakEvenUnits === 2000 && bf.workingCapital === 120000 && bf.cashRunwayMonths === 3,
  });

  // 11. Agriculture Mandi
  const mandi = calculateAgricultureMandi({
    mode: 'mandi_payout',
    weightQuintals: 100,
    ratePerQuintal: 3000,
    bagCount: 200,
    hamaliPerBag: 15,
    mandiCessPercent: 1.5,
    weighingCharges: 200,
  });
  // Gross: 300,000, Hamali: 3000, Cess: 4500, Weighing: 200 => Total Ded: 7700 => Net: 292,300
  results.push({
    id: 'mandi-1',
    calculatorId: 'agriculture',
    name: 'Agriculture: Mandi Payout for 100 Q @ ₹3000 with Hamali & Cess',
    expected: '292300',
    actual: String(mandi.netFarmerPayout),
    passed: mandi.netFarmerPayout === 292300,
  });

  // 12. Construction
  const constr = calculateConstruction({
    subType: 'concrete_mix',
    volumeCuM: 1,
    grade: 'M20',
  });
  results.push({
    id: 'constr-1',
    calculatorId: 'construction',
    name: 'Construction: 1 cu.m M20 mix gives ~8 cement bags',
    expected: '8',
    actual: String(constr.cementBags),
    passed: constr.cementBags >= 8 && constr.cementBags <= 9,
  });

  // 13. Transport
  const trans = calculateTransport({
    distanceKm: 500,
    mileageKmPerLitre: 4,
    fuelPricePerLitre: 90,
    tollCharges: 1500,
    driverBhatta: 1000,
    loadingUnloading: 500,
    otherOverheads: 0,
    freightRateQuote: 20000,
    cargoTonnage: 10,
  });
  // Fuel: 125 L * 90 = 11,250. Expense = 11250 + 1500 + 1000 + 500 = 14250. Profit = 5750.
  results.push({
    id: 'trans-1',
    calculatorId: 'transport',
    name: 'Transport: 500km trip profit calculation',
    expected: '5750',
    actual: String(trans.netTripProfit),
    passed: trans.netTripProfit === 5750,
  });

  // 14. Restaurant
  const rest = calculateRestaurant({
    subType: 'food_cost_ratio',
    ingredientCostPerDish: 70,
    sellingPricePerDish: 200,
  });
  results.push({
    id: 'rest-1',
    calculatorId: 'restaurant',
    name: 'Restaurant: Food Cost Ratio (70 / 200 = 35% within standard)',
    expected: '35',
    actual: String(rest.foodCostPercentage),
    passed: rest.foodCostPercentage === 35 && rest.isFoodCostHealthy === true,
  });

  // 15. E-commerce
  const ecom = calculateEcommerce({
    sellingPrice: 1000,
    productCost: 300,
    packagingCost: 30,
    shippingFee: 70,
    referralCommissionPercent: 10,
    fixedClosingFee: 20,
    paymentGatewayPercent: 2,
    expectedReturnRatePercent: 0,
    reverseShippingOnReturn: 0,
  });
  // Comm: 100, PG: 20, Ship: 70, Fixed: 20 => Subtotal fees = 210. GST (18%) = 37.8 => Ded = 247.8. Net payout = 752.2. Profit = 752.2 - 330 = 422.2
  results.push({
    id: 'ecom-1',
    calculatorId: 'ecommerce',
    name: 'E-commerce: Amazon/Flipkart net seller payout with 18% GST on services',
    expected: '752.2',
    actual: String(ecom.netPayoutToBank),
    passed: Math.abs(ecom.netPayoutToBank - 752.2) < 0.1,
  });

  // 16. Digital Marketing
  const mkt = calculateMarketing({
    adSpend: 50000,
    conversions: 250,
    revenueGenerated: 200000,
  });
  results.push({
    id: 'mkt-1',
    calculatorId: 'marketing',
    name: 'Marketing: ROAS 4.0x and CAC ₹200 on ₹50k spend & 250 orders',
    expected: 'ROAS: 4, CAC: 200',
    actual: `ROAS: ${mkt.roas}, CAC: ${mkt.cac}`,
    passed: mkt.roas === 4 && mkt.cac === 200,
  });

  // 17. Salary
  const sal = calculateSalary({
    monthlyGrossSalary: 50000,
    basicPayPercent: 50,
    hraPercent: 20,
    isEpUncapped: false,
    professionalTax: 200,
    estimatedMonthlyTds: 1000,
  });
  // Basic = 25000. Cap is 15000 => PF = 15000 * 12% = 1800. PT = 200, TDS = 1000 => In-hand = 50000 - 3000 = 47000.
  results.push({
    id: 'sal-1',
    calculatorId: 'salary',
    name: 'Salary: Gross ₹50k with PF ₹15k wage ceiling cap = In-hand ₹47,000',
    expected: '47000',
    actual: String(sal.netInHandSalary),
    passed: sal.netInHandSalary === 47000,
  });

  // 18. Real Estate
  const re = calculateRealEstate({
    propertyValue: 5000000,
    monthlyRentalIncome: 25000,
    annualPropertyTax: 10000,
    annualMaintenance: 14000,
    stampDutyPercent: 6,
    registrationPercent: 1,
  });
  results.push({
    id: 're-1',
    calculatorId: 'real_estate',
    name: 'Real Estate: Gross Yield 6.0% on ₹50 Lakh property at ₹25k rent',
    expected: '6',
    actual: String(re.grossRentalYieldPercent),
    passed: re.grossRentalYieldPercent === 6,
  });

  // 19. Manufacturing
  const mfg = calculateManufacturing({
    rawMaterialPerUnit: 100,
    directLaborPerUnit: 40,
    machineHourlyRate: 200,
    machineHoursPerUnit: 0.25, // 50
    factoryOverheadPerUnit: 10,
    scrapPercentage: 5,
    targetMarginPercent: 20,
    batchQuantity: 100,
  });
  // Base = 100 + 40 + 50 + 10 = 200. Scrap 5% = 10 => Unit cost = 210.
  results.push({
    id: 'mfg-1',
    calculatorId: 'manufacturing',
    name: 'Manufacturing: Unit cost calculation with 5% scrap factor',
    expected: '210',
    actual: String(mfg.totalUnitCost),
    passed: mfg.totalUnitCost === 210,
  });

  // 20. Freelancing
  const free = calculateFreelancing({
    desiredMonthlyIncome: 80000,
    monthlyBusinessOverheads: 10000,
    billableHoursPerWeek: 25,
    paidWeeksOffPerYear: 4,
    taxBufferPercent: 10,
    apply194jTds: true,
    tdsRate: 10,
  });
  results.push({
    id: 'free-1',
    calculatorId: 'freelancing',
    name: 'Freelancing: Required hourly rate calculation',
    expected: 'Pass (positive valid rate)',
    actual: `Hourly: ₹${free.hourlyRate}`,
    passed: free.hourlyRate > 0 && free.totalBillableHoursPerYear === 1200,
  });

  // 21. Coaching
  const coach = calculateCoaching({
    numberOfBatches: 2,
    studentsPerBatch: 25,
    monthlyFeePerStudent: 2000,
    teacherSalaryPerBatch: 15000,
    classroomRentMonthly: 20000,
    electricityAndAcMonthly: 5000,
    notesPrintingPerStudent: 100,
    miscExpenses: 2000,
  });
  // Students = 50. Revenue = 100,000. Expenses = 30000 + 5000 + 20000 + 5000 + 2000 = 62000. Net profit = 38000.
  results.push({
    id: 'coach-1',
    calculatorId: 'coaching',
    name: 'Coaching: Net Monthly Profit for 50 students across 2 batches',
    expected: '38000',
    actual: String(coach.netMonthlyProfit),
    passed: coach.netMonthlyProfit === 38000,
  });

  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    results,
  };
}
