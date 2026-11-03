/**
 * BizCalc Pro - Indian Numbering System & Currency Formatters
 */

export function formatINR(val: number, includeDecimals = true): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals && absVal % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(absVal);

  return isNegative ? `-${formatted}` : formatted;
}

export function formatNumberIN(val: number, decimals = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  const absVal = Math.abs(val);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: absVal % 1 !== 0 ? Math.min(2, decimals) : 0,
    maximumFractionDigits: decimals,
  }).format(absVal);
  return val < 0 ? `-${formatted}` : formatted;
}

export function formatCompactINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '₹0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  } else if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)} K`;
  }
  return `${sign}₹${abs.toFixed(0)}`;
}

export function formatPercent(val: number, decimals = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0%';
  return `${val >= 0 ? '' : ''}${val.toFixed(decimals)}%`;
}

// Convert numbers into Indian Lakhs / Crores words in English and Hindi
export function numberToWordsIN(num: number, lang: 'en' | 'hi' = 'en'): string {
  const rounded = Math.round(Math.abs(num));
  if (rounded === 0) return lang === 'hi' ? 'शून्य रुपये' : 'Zero Rupees';

  const unitsEn = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensEn = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const unitsHi = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
    'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
  const tensHi = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

  function convertTwoDigitsEn(n: number): string {
    if (n < 20) return unitsEn[n];
    return tensEn[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + unitsEn[n % 10] : '');
  }

  function convertTwoDigitsHi(n: number): string {
    if (n < 20) return unitsHi[n];
    return tensHi[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + unitsHi[n % 10] : '');
  }

  const crores = Math.floor(rounded / 10000000);
  const lakhs = Math.floor((rounded % 10000000) / 100000);
  const thousands = Math.floor((rounded % 100000) / 1000);
  const hundreds = Math.floor((rounded % 1000) / 100);
  const remainder = rounded % 100;

  if (lang === 'hi') {
    const parts: string[] = [];
    if (crores > 0) parts.push(`${convertTwoDigitsHi(crores)} करोड़`);
    if (lakhs > 0) parts.push(`${convertTwoDigitsHi(lakhs)} लाख`);
    if (thousands > 0) parts.push(`${convertTwoDigitsHi(thousands)} हज़ार`);
    if (hundreds > 0) parts.push(`${unitsHi[hundreds]} सौ`);
    if (remainder > 0) parts.push(convertTwoDigitsHi(remainder));
    return `${parts.join(' ')} रुपये मात्र`;
  }

  const parts: string[] = [];
  if (crores > 0) parts.push(`${convertTwoDigitsEn(crores)} Crore`);
  if (lakhs > 0) parts.push(`${convertTwoDigitsEn(lakhs)} Lakh`);
  if (thousands > 0) parts.push(`${convertTwoDigitsEn(thousands)} Thousand`);
  if (hundreds > 0) parts.push(`${unitsEn[hundreds]} Hundred`);
  if (remainder > 0) parts.push(convertTwoDigitsEn(remainder));
  return `${parts.join(' ')} Rupees Only`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
