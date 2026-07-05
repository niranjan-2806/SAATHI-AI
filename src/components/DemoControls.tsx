import { PersonaType, LanguageType } from '../types';
import { Sparkles, DollarSign, Plane, AlertTriangle, RefreshCw, Smartphone, Award, ShieldAlert, Languages } from 'lucide-react';

interface DemoControlsProps {
  currentPersona: PersonaType;
  setPersona: (p: PersonaType) => void;
  currentLanguage: LanguageType;
  setLanguage: (l: LanguageType) => void;
  onSimulateSalary: () => void;
  onSimulateTravel: () => void;
  onSimulateFraud: () => void;
  onSimulateBillDue: () => void;
  onSimulatePocketMoney: () => void;
  onReset: () => void;
  activeTriggers: {
    salaryCredited: boolean;
    travelBooked: boolean;
    fraudTriggered: boolean;
    billDue: boolean;
    pocketMoneyCredited: boolean;
  };
}

export default function DemoControls({
  currentPersona,
  setPersona,
  currentLanguage,
  setLanguage,
  onSimulateSalary,
  onSimulateTravel,
  onSimulateFraud,
  onSimulateBillDue,
  onSimulatePocketMoney,
  onReset,
  activeTriggers,
}: DemoControlsProps) {
  return (
    <div id="demo-controls-panel" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 rounded-2xl shadow-card-shadow border border-slate-200 dark:border-slate-800/80 flex flex-col gap-6 h-full transition-colors duration-300">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <Sparkles className="w-5 h-5 text-accent-gold" />
        <div>
          <h2 className="text-lg font-bold font-sans tracking-tight text-sbi-blue dark:text-blue-400">Saarthi Hackathon Studio</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Trigger live AI adjustments & simulated events</p>
        </div>
      </div>

      {/* Persona Quick Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" /> 1. Select Active Persona
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['student', 'professional', 'senior'] as PersonaType[]).map((p) => (
            <button
              id={`persona-btn-${p}`}
              key={p}
              onClick={() => setPersona(p)}
              className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all duration-300 flex flex-col items-center gap-1 cursor-pointer capitalize ${
                currentPersona === p
                   ? 'bg-sbi-blue dark:bg-blue-600 text-white border-sbi-blue dark:border-blue-600 shadow-md font-bold scale-102'
                   : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="text-base">
                {p === 'student' ? '🎓' : p === 'professional' ? '💼' : '👵'}
              </span>
              <span>{p === 'senior' ? 'Senior' : p}</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
          {currentPersona === 'student' && '🎓 Kabir, 20. Simple UI, pocket money nudges, high touch gamification.'}
          {currentPersona === 'professional' && '💼 Priyanka, 29. High density, autopay setup, wealth & tax optimization.'}
          {currentPersona === 'senior' && '👵 Ramesh, 69. Large high-contrast UI, voice assistant, direct human handoff.'}
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" /> 2. Toggle Language
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {([
            { code: 'en', label: 'EN' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'te', label: 'తెలుగు' }
          ] as { code: LanguageType, label: string }[]).map((l) => (
            <button
              id={`lang-btn-${l.code}`}
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                currentLanguage === l.code
                  ? 'bg-sbi-blue dark:bg-blue-600 text-white border-sbi-blue dark:border-blue-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Event Triggers */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> 3. Inject Simulated Banking Events
        </span>

        <div className="flex flex-col gap-2">
          {currentPersona === 'professional' && (
            <>
              <button
                id="trigger-salary-btn"
                onClick={onSimulateSalary}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all cursor-pointer ${
                  activeTriggers.salaryCredited
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-350 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  Salary Credited Today (+₹1,20,000)
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTriggers.salaryCredited ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                  {activeTriggers.salaryCredited ? 'Active' : 'Test'}
                </span>
              </button>

              <button
                id="trigger-travel-btn"
                onClick={onSimulateTravel}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all cursor-pointer ${
                  activeTriggers.travelBooked
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-350 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Book Flight Ticket to Mumbai (₹14,500)
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTriggers.travelBooked ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                  {activeTriggers.travelBooked ? 'Active' : 'Test'}
                </span>
              </button>
            </>
          )}

          {currentPersona === 'student' && (
            <button
              id="trigger-pocket-btn"
              onClick={onSimulatePocketMoney}
              className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all cursor-pointer ${
                activeTriggers.pocketMoneyCredited
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-350 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-pink-600 dark:text-pink-400 animate-pulse" />
                Pocket Money Credited (+₹10,000)
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTriggers.pocketMoneyCredited ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                {activeTriggers.pocketMoneyCredited ? 'Active' : 'Test'}
              </span>
            </button>
          )}

          <button
            id="trigger-bill-btn"
            onClick={onSimulateBillDue}
            className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all cursor-pointer ${
              activeTriggers.billDue
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-350 font-bold'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              Electricity Bill Generated (₹2,450)
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTriggers.billDue ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
              {activeTriggers.billDue ? 'Active' : 'Test'}
            </span>
          </button>

          <button
            id="trigger-fraud-btn"
            onClick={onSimulateFraud}
            className={`py-2.5 px-3 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all cursor-pointer ${
              activeTriggers.fraudTriggered
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 font-bold animate-pulse'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 animate-bounce" />
              Simulate Out-of-Pattern Card Debit (Fraud Lock)
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTriggers.fraudTriggered ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
              {activeTriggers.fraudTriggered ? 'Armed' : 'Test'}
            </span>
          </button>
        </div>
      </div>

      {/* Explanations of Mock Rules */}
      <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-sbi-blue dark:text-blue-400" /> Protip for Demo
        </h3>
        <p>
          Switch to <b>Senior Persona</b> to showcase our voice-first, low-density display, with large touch targets. Watch the home tiles automatically scale, translate, and prioritize biometrics & fraud safety features.
        </p>
        <button
          id="reset-demo-btn"
          onClick={onReset}
          className="mt-3 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          Reset Demo State
        </button>
      </div>
    </div>
  );
}
