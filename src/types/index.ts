export type Language = 'en' | 'hi';

export type CalculatorCategory =
  | 'basic'
  | 'profit_loss'
  | 'margin_markup'
  | 'discount'
  | 'gst'
  | 'emi'
  | 'expenses'
  | 'retail_kirana'
  | 'inventory'
  | 'business_finance'
  | 'agriculture'
  | 'construction'
  | 'transport'
  | 'restaurant'
  | 'ecommerce'
  | 'marketing'
  | 'salary'
  | 'real_estate'
  | 'manufacturing'
  | 'freelancing'
  | 'coaching';

export interface CalculatorMeta {
  id: CalculatorCategory;
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  group: 'core' | 'trade' | 'finance' | 'industry' | 'services';
  icon: string;
  badge?: string;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  calculatorId: CalculatorCategory;
  title: string;
  inputsSummary: string;
  resultSummary: string;
  details: Record<string, string | number>;
}

export interface TestResult {
  id: string;
  name: string;
  calculatorId: CalculatorCategory;
  expected: string;
  actual: string;
  passed: boolean;
  notes?: string;
}
