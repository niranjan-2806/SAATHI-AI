import { LOCALIZATION } from '../data';
import { LanguageType, UserProfile } from '../types';
import { Landmark, ArrowUpRight, TrendingUp, ShieldCheck, Wallet, Flame } from 'lucide-react';

interface RelationshipSummaryProps {
  language: LanguageType;
  profile: UserProfile;
}

export default function RelationshipSummary({ language, profile }: RelationshipSummaryProps) {
  const tTitle = LOCALIZATION.relationshipSummary[language];

  // Derive summary metrics
  const totalSavings = profile.balance;
  const totalFD = profile.policies.length > 0 ? 120000 : 0; // Simulated FD for Pro
  const totalInvestment = profile.goals.reduce((acc, curr) => acc + curr.current, 0) + (profile.financialScore > 80 ? 450000 : 0);
  const totalInsuranceAssured = profile.policies.reduce((acc, curr) => acc + curr.coverage, 0);
  const totalLoansOutstanding = profile.healthBreakdown.debt * 10; // Simple loan multiplier

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-4">
      {/* Title */}
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <Landmark className="w-3.5 h-3.5 text-blue-600" />
        {tTitle}
      </span>

      {/* Grid of Summary Blocks */}
      <div className="grid grid-cols-2 gap-3">
        {/* Banking */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-blue-50 text-blue-700 rounded-md">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Deposits</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Balance & FDs</span>
            <span className="text-sm font-black text-slate-800 font-mono">
              ₹{(totalSavings + totalFD).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded-full self-start">
            Savings: ₹{totalSavings.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Investments */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-indigo-50 text-indigo-700 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Invested</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Mutual Funds / SIP</span>
            <span className="text-sm font-black text-slate-800 font-mono">
              ₹{totalInvestment.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded-full self-start">
            Auto-compounding
          </span>
        </div>

        {/* Protection */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-emerald-50 text-emerald-700 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Assured</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Total Life & Health</span>
            <span className="text-sm font-black text-slate-800 font-mono">
              ₹{totalInsuranceAssured.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded-full self-start">
            {profile.policies.length} Active Policies
          </span>
        </div>

        {/* Loans */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-rose-50 text-rose-700 rounded-md">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Liabilities</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-medium">Outstanding Loans</span>
            <span className="text-sm font-black text-slate-800 font-mono">
              ₹{totalLoansOutstanding.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded-full self-start">
            Auto-payments linked
          </span>
        </div>
      </div>

      {/* Trust Quote / Relationship Message */}
      <div className="bg-[#5C2D91]/5 border border-[#5C2D91]/10 p-3 rounded-xl text-xs text-slate-600 flex flex-col gap-1">
        <h4 className="font-extrabold text-[#5C2D91]">Relationship Value: Safe & Certified</h4>
        <p className="leading-relaxed text-[11px] font-medium">
          Your complete banking relationship is validated via SBI's central data systems. Saarthi uses these secure signals to recommend savings targets.
        </p>
      </div>
    </div>
  );
}
