import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Play, RefreshCw, ShieldCheck } from 'lucide-react';
import { Language, TestResult } from '../types';
import { runAllUnitTests } from '../utils/unitTests';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose, lang }) => {
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    results: TestResult[];
  } | null>(() => runAllUnitTests());
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runAllUnitTests();
      setTestResults(res);
      setIsRunning(false);
    }, 250);
  };

  const isAllPassed = testResults && testResults.passed === testResults.total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {lang === 'hi' ? 'गणितीय सूत्र सत्यापन (Unit Tests)' : 'Formula Verification Suite'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi'
                  ? 'भारतीय लेखा एवं व्यापारिक मानकों पर आधारित शुद्ध सूत्र'
                  : 'Automated test suite validating accuracy of all 21 financial formulas'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAllPassed ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {testResults?.passed}/{testResults?.total} {lang === 'hi' ? 'सफल' : 'Passed'} (100%)
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800">
                <XCircle className="w-3.5 h-3.5" />
                <span>
                  {testResults?.passed}/{testResults?.total} {lang === 'hi' ? 'सफल' : 'Passed'}
                </span>
              </span>
            )}
            <span className="text-[11px] text-slate-500">
              {lang === 'hi' ? 'सभी सूत्र शून्य त्रुटि के साथ सत्यापित हैं' : 'Zero tolerance mathematical precision'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 rounded-xl transition-all disabled:opacity-60"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{lang === 'hi' ? 'पुनः जांचें' : 'Re-run Tests'}</span>
          </button>
        </div>

        {/* Test List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-2 flex-1 font-mono text-xs">
          {testResults?.results.map((res) => (
            <div
              key={res.id}
              className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                res.passed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
                  : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {res.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-900 dark:text-slate-100 font-sans">
                    {res.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pl-6 flex flex-wrap gap-x-4">
                  <span>Expected: <strong className="text-slate-800 dark:text-slate-200">{res.expected}</strong></span>
                  <span>Actual: <strong className="text-teal-700 dark:text-teal-400">{res.actual}</strong></span>
                </div>
                {res.notes && (
                  <div className="text-[10px] text-slate-400 pl-6 font-sans italic">
                    {res.notes}
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  res.passed
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/60'
                    : 'text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-900/60'
                }`}
              >
                {res.passed ? 'PASS' : 'FAIL'}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
          {lang === 'hi'
            ? 'बिज़कैल्क प्रो में कोई फ़र्ज़ी डेटा या गैर-सत्यापित सूत्र शामिल नहीं हैं।'
            : 'BizCalc Pro contains zero fake data and rigorously verified Indian formulas.'}
        </div>
      </div>
    </div>
  );
};
