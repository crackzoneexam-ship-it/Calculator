import React, { useState } from 'react';
import { Delete, RotateCcw, Copy, Check, Star } from 'lucide-react';
import { Language, CalculationHistoryItem } from '../../types';
import { formatNumberIN, copyToClipboard } from '../../utils/formatters';
import { evaluateBasicExpression } from '../../utils/calculations';
import { FormulaAccordion } from '../FormulaAccordion';

interface BasicCalculatorProps {
  lang: Language;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

export const BasicCalculator: React.FC<BasicCalculatorProps> = ({
  lang,
  onSaveHistory,
  isFavourite,
  onToggleFavourite,
}) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [recentTape, setRecentTape] = useState<string[]>([]);

  const handleDigit = (digit: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (display === 'Error') {
      setDisplay('0.');
      return;
    }
    const lastNum = display.split(/[-+×÷]/).pop() || '';
    if (!lastNum.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    const lastChar = display.trim().slice(-1);
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      setDisplay(display.slice(0, -1) + op);
    } else {
      setDisplay(display + ' ' + op + ' ');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display === 'Error' || display.length <= 1) {
      setDisplay('0');
      return;
    }
    if (display.endsWith(' ')) {
      setDisplay(display.slice(0, -3));
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    try {
      const result = evaluateBasicExpression(display);
      const formattedResult = formatNumberIN(result, 4);
      setEquation(display + ' =');
      const tapeEntry = `${display} = ${formattedResult}`;
      setRecentTape((prev) => [tapeEntry, ...prev.slice(0, 4)]);
      setGrandTotal((prev) => prev + result);

      onSaveHistory({
        calculatorId: 'basic',
        title: lang === 'hi' ? 'बेसिक कैलकुलेटर' : 'Basic Calculator',
        inputsSummary: display,
        resultSummary: formattedResult,
        details: { Expression: display, Result: result },
      });

      setDisplay(String(result));
    } catch {
      setDisplay('Error');
    }
  };

  // Quick GST addition buttons (common in Indian shops & billing counters)
  const handleApplyGst = (rate: number, isAddition = true) => {
    try {
      const current = parseFloat(display) || 0;
      let calculated = 0;
      let exprText = '';

      if (isAddition) {
        // e.g. 1000 + 18% GST = 1180
        calculated = current * (1 + rate / 100);
        exprText = `${current} + ${rate}% GST = ${calculated.toFixed(2)}`;
      } else {
        // Reverse GST: 1180 - 18% = 1000 base
        calculated = current / (1 + rate / 100);
        exprText = `${current} rev -${rate}% GST = ${calculated.toFixed(2)}`;
      }

      setEquation(exprText);
      setDisplay(String(Number(calculated.toFixed(2))));
      setRecentTape((prev) => [exprText, ...prev.slice(0, 4)]);

      onSaveHistory({
        calculatorId: 'basic',
        title: lang === 'hi' ? `जीएसटी ${rate}% गणना` : `GST ${rate}% Quick Calc`,
        inputsSummary: `${isAddition ? '+' : 'Reverse -'}${rate}% on ₹${current}`,
        resultSummary: `₹${calculated.toFixed(2)}`,
        details: { Amount: current, Rate: `${rate}%`, Final: calculated },
      });
    } catch {
      setDisplay('Error');
    }
  };

  // Memory Functions
  const handleMemoryAdd = () => {
    const val = parseFloat(display) || 0;
    setMemory((m) => m + val);
  };
  const handleMemorySub = () => {
    const val = parseFloat(display) || 0;
    setMemory((m) => m - val);
  };
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
  };
  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleCopy = async () => {
    const text = equation ? `${equation} ${display}` : display;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Title & Favourite action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {lang === 'hi' ? 'व्यापारिक बेसिक कैलकुलेटर' : 'Basic Business Calculator'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'जीएसटी टैक्स बटन, मेमोरी (M+, MR) एवं ग्रैंड टोटल (GT) सहित'
              : 'With quick GST tax buttons, memory keys, GT, and running tape'}
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

      {/* Calculator Body Container */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800 space-y-4">
        {/* Screen / Display */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-1">
          {/* Status flags: Memory, Grand Total */}
          <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono">
            <div className="flex items-center gap-2">
              {memory !== 0 && (
                <span className="px-1.5 py-0.2 bg-teal-950 border border-teal-800 rounded text-[10px]">
                  M: {memory}
                </span>
              )}
              {grandTotal !== 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-950 border border-indigo-800 rounded text-[10px]">
                  GT: {formatNumberIN(grandTotal)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Running Equation */}
          <div className="text-right text-xs text-slate-400 font-mono h-5 overflow-hidden text-ellipsis">
            {equation || recentTape[0] || ' '}
          </div>

          {/* Main digits display */}
          <div className="text-right text-3xl md:text-4xl font-mono font-bold tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            {display}
          </div>
        </div>

        {/* GST Fast Tax Strip (Popular in Indian Billing) */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
            {lang === 'hi' ? 'त्वरित जीएसटी जोड़ें (Quick GST)' : 'Quick GST Tax'}
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyGst(5, true)}
              className="min-h-[38px] bg-slate-800 hover:bg-teal-700/80 text-teal-300 hover:text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
            >
              +5%
            </button>
            <button
              type="button"
              onClick={() => handleApplyGst(12, true)}
              className="min-h-[38px] bg-slate-800 hover:bg-teal-700/80 text-teal-300 hover:text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
            >
              +12%
            </button>
            <button
              type="button"
              onClick={() => handleApplyGst(18, true)}
              className="min-h-[38px] bg-slate-800 hover:bg-teal-700/80 text-teal-300 hover:text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
            >
              +18%
            </button>
            <button
              type="button"
              onClick={() => handleApplyGst(28, true)}
              className="min-h-[38px] bg-slate-800 hover:bg-teal-700/80 text-teal-300 hover:text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
            >
              +28%
            </button>
            <button
              type="button"
              onClick={() => handleApplyGst(18, false)}
              className="min-h-[38px] bg-slate-800 hover:bg-amber-600/80 text-amber-300 hover:text-white text-[11px] font-bold rounded-xl transition-colors active:scale-95"
              title="Reverse 18% GST (Calculate base from bill)"
            >
              -18%
            </button>
          </div>
        </div>

        {/* Keypad Grid (Standard Commercial Desktop/Mobile 44px+ hitboxes) */}
        <div className="grid grid-cols-4 gap-2 text-sm font-semibold font-mono">
          {/* Row 1: Memory & Clear */}
          <button
            type="button"
            onClick={handleMemoryClear}
            className="min-h-[46px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
          >
            MC
          </button>
          <button
            type="button"
            onClick={handleMemoryRecall}
            className="min-h-[46px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
          >
            MR
          </button>
          <button
            type="button"
            onClick={handleMemorySub}
            className="min-h-[46px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
          >
            M-
          </button>
          <button
            type="button"
            onClick={handleMemoryAdd}
            className="min-h-[46px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
          >
            M+
          </button>

          {/* Row 2 */}
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[46px] bg-rose-950/70 text-rose-400 hover:bg-rose-900 border border-rose-800/40 rounded-xl transition-colors"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="min-h-[46px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOperator('%')}
            className="min-h-[46px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOperator('÷')}
            className="min-h-[46px] bg-teal-800 text-teal-100 hover:bg-teal-700 rounded-xl transition-colors text-lg"
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            type="button"
            onClick={() => handleDigit('7')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOperator('×')}
            className="min-h-[46px] bg-teal-800 text-teal-100 hover:bg-teal-700 rounded-xl transition-colors text-lg"
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            type="button"
            onClick={() => handleDigit('4')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOperator('-')}
            className="min-h-[46px] bg-teal-800 text-teal-100 hover:bg-teal-700 rounded-xl transition-colors text-lg"
          >
            -
          </button>

          {/* Row 5 */}
          <button
            type="button"
            onClick={() => handleDigit('1')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOperator('+')}
            className="min-h-[46px] bg-teal-800 text-teal-100 hover:bg-teal-700 rounded-xl transition-colors text-lg"
          >
            +
          </button>

          {/* Row 6 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleDigit('00')}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-sm"
          >
            00
          </button>
          <button
            type="button"
            onClick={handleDecimal}
            className="min-h-[46px] bg-slate-850 hover:bg-slate-700 rounded-xl transition-colors text-base"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className="min-h-[46px] bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-teal-500/20 active:scale-95 text-xl"
          >
            =
          </button>
        </div>
      </div>

      {/* Recent Calculations Tape */}
      {recentTape.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>{lang === 'hi' ? 'हालिया टेप (Tape History)' : 'Recent Tape'}</span>
            <button
              type="button"
              onClick={() => setRecentTape([])}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            {recentTape.map((t, i) => (
              <div key={i} className="text-slate-600 dark:text-slate-400 truncate">
                • {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide & Formulas */}
      <FormulaAccordion
        lang={lang}
        titleEn="Business Calculator Guide & GST Rules"
        titleHi="बेसिक कैलकुलेटर निर्देश एवं जीएसटी गणना नियम"
        formulaEn={[
          'Add GST: Final Amount = Base Amount × (1 + Rate / 100)',
          'Reverse GST (Tax Included): Base Amount = Bill Amount ÷ (1 + Rate / 100)',
          'M+ (Memory Add) adds current display to memory register; MR recalls it.',
          'GT (Grand Total) accumulates values each time = is pressed.',
        ]}
        formulaHi={[
          'जीएसटी जोड़ें: कुल बिल = मूल राशि × (1 + दर / 100)',
          'रिवर्स जीएसटी (जीएसटी बिल से मूल निकालें): मूल राशि = बिल राशि ÷ (1 + दर / 100)',
          'M+ स्क्रीन की संख्या को मेमोरी में जोड़ता है; MR उसे वापस स्क्रीन पर लाता है।',
          'GT (ग्रैंड टोटल) हर बार = दबाने पर योग जमा करता है।',
        ]}
        notesEn={[
          'Indian standard GST rates: 0%, 5%, 12%, 18%, and 28%.',
          'Use -18% for finding MRP base before GST in wholesale purchasing.',
        ]}
        notesHi={[
          'भारत में प्रचलित मुख्य जीएसटी दरें 5%, 12%, 18% और 28% हैं।',
          'थोक खरीद में बिल से टैक्स अलग करने के लिए -18% रिवर्स बटन का उपयोग करें।',
        ]}
      />
    </div>
  );
};
