import { useState, useEffect } from 'react';
import { FinancialHealthBreakdown, PersonaType, LanguageType } from '../types';
import { TrendingUp, HelpCircle, ShieldCheck, CreditCard, ChevronDown, Award } from 'lucide-react';
import { LOCALIZATION } from '../data';

interface FinancialHealthProps {
  score: number;
  breakdown: FinancialHealthBreakdown;
  explanation: string;
  persona: PersonaType;
  language: LanguageType;
}

export default function FinancialHealth({
  score: initialScore,
  breakdown,
  explanation,
  persona,
  language,
}: FinancialHealthProps) {
  const [score, setScore] = useState(initialScore);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(false);

  // Sync score when persona changes
  useEffect(() => {
    setScore(initialScore);
  }, [initialScore, persona]);

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'stroke-emerald-500 text-emerald-600 dark:text-emerald-450';
    if (val >= 60) return 'stroke-amber-500 text-amber-600 dark:text-amber-450';
    return 'stroke-red-500 text-red-600 dark:text-red-455';
  };

  const getScoreBgColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30';
    if (val >= 60) return 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-900/30';
    return 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border-red-100 dark:border-red-900/30';
  };

  // SVG Gauge calculations
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Render translations
  const tHealth = LOCALIZATION.financialScore[language];
  const tExplain = LOCALIZATION.explainWhy[language];

  return (
    <div id="financial-health-card" className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4 transition-colors duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          {tHealth}
        </span>
        <button
          onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          {showBreakdownDetails ? 'Hide details' : 'Show breakdown'}
          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showBreakdownDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Score View */}
      <div className="flex items-center gap-5">
        {/* Circle SVG Gauge */}
        <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-850 fill-none"
              strokeWidth={strokeWidth}
            />
            {/* Active Gauge */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(score).split(' ')[0]}`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span id="health-score-value" className="text-2xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {score}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">Score</span>
          </div>
        </div>

        {/* Info & Micro Recommendations */}
        <div className="flex flex-col gap-1.5">
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${getScoreBgColor(score)}`}>
            {score >= 80 ? '⭐ Excellent standing' : score >= 60 ? '⚡ Healthy' : '⚠️ Action required'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>

      {/* Expandable Breakdown Slider & Chart */}
      {showBreakdownDetails && (
        <div className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 mt-1">
          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-450">Monthly CashFlow Metrics</h4>

          <div className="flex flex-col gap-2">
            {/* Income */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">🟢 Income</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">₹{breakdown.income.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Expenses */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">🔴 Expenses</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">₹{breakdown.expenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (breakdown.expenses / breakdown.income) * 100)}%` }}
                />
              </div>
            </div>

            {/* Savings */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">🔵 Savings Rate</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">₹{breakdown.savings.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (breakdown.savings / breakdown.income) * 100)}%` }}
                />
              </div>
            </div>

            {/* Debt */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">🟠 Debt Ratio</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">₹{breakdown.debt.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (breakdown.debt / breakdown.income) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-2 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Saarthi refreshes this daily based on your UPI & card statements.</span>
          </div>
        </div>
      )}
    </div>
  );
}
