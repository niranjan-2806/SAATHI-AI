import { useState, FormEvent } from 'react';
import { LOCALIZATION } from '../data';
import { LanguageType, Goal } from '../types';
import { Landmark, TrendingUp, PiggyBank, Plus, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvestmentsProps {
  language: LanguageType;
  goals: Goal[];
  onAddMoneyToGoal: (goalId: string, amount: number) => void;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

export default function Investments({ language, goals, onAddMoneyToGoal, onAddGoal }: InvestmentsProps) {
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'bike' | 'education' | 'emergency' | 'general'>('general');

  // Trigger recommendation card details
  const [showRecCardDetails, setShowRecCardDetails] = useState<string | null>(null);

  const handleCreateGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget || !newGoalDeadline) return;
    onAddGoal({
      name: newGoalName,
      target: Number(newGoalTarget),
      current: 0,
      deadline: newGoalDeadline,
      category: newGoalCategory,
    });
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalDeadline('');
    setNewGoalCategory('general');
    setShowAddGoalForm(false);
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'education': return '📚';
      case 'bike': return '🏍️';
      case 'emergency': return '🚨';
      default: return '🎯';
    }
  };

  const tGoals = LOCALIZATION.savingsPlanner[language];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-blue-600" />
          {tGoals}
        </span>
        <button
          onClick={() => setShowAddGoalForm(!showAddGoalForm)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> New Goal
        </button>
      </div>

      {/* Goal Creation Expandable Form */}
      <AnimatePresence>
        {showAddGoalForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateGoal}
            className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 flex flex-col gap-2.5"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Buy a Bike"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  required
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-medium outline-none text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Target (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  required
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-medium outline-none text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Target Date</label>
                <input
                  type="text"
                  placeholder="Dec 2026"
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  required
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-medium outline-none text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-medium outline-none text-slate-800 cursor-pointer"
                >
                  <option value="general">🎯 General</option>
                  <option value="bike">🏍️ Bike / Vehicle</option>
                  <option value="education">📚 Study / Laptop</option>
                  <option value="emergency">🚨 Emergency Fund</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px] transition cursor-pointer"
            >
              Start Saving with Saarthi AI
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goal Cards List */}
      <div className="flex flex-col gap-3">
        {goals.map((g) => {
          const progress = Math.min(100, Math.floor((g.current / g.target) * 100));
          return (
            <div
              key={g.id}
              className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryEmoji(g.category)}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-700">{g.name}</h4>
                    <span className="text-[9px] text-slate-400">Target: {g.deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAddMoneyToGoal(g.id, 5000)}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-1 px-2.5 rounded-lg text-[9px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add ₹5,000
                </button>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                  <span>₹{g.current.toLocaleString('en-IN')} saved</span>
                  <span>{progress}% of ₹{g.target.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Saarthi automated advice line */}
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-lg border border-slate-100 text-[9px] text-slate-500 font-medium">
                <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse shrink-0" />
                <span>
                  {progress < 40
                    ? `Adding ₹200 auto-sweep daily gets you to this target 1 month earlier.`
                    : `Excellent! On track. Saarthi recommends a lump sum SIP top-up.`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
