import { useState, useEffect } from 'react';
import { PersonaType, LanguageType, UserProfile, Goal, InsurancePolicy } from './types';
import { INITIAL_PROFILES, LOCALIZATION } from './data';
import Header from './components/Header';
import DemoControls from './components/DemoControls';
import FraudModal from './components/FraudModal';
import FinancialHealth from './components/FinancialHealth';
import SecurityScore from './components/SecurityScore';
import AssistantChat from './components/AssistantChat';
import Payments from './components/Payments';
import PayBills from './components/PayBills';
import Investments from './components/Investments';
import Insurance from './components/Insurance';
import RelationshipSummary from './components/RelationshipSummary';
import Confetti from './components/Confetti';

import {
  Sparkles,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Award,
  CreditCard,
  Mic,
  PhoneCall,
  Volume2,
  ChevronRight,
  Zap,
  Info,
  CheckCircle2,
  Lock,
  Compass,
  Layers,
  X,
  Plus,
  Landmark,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [persona, setPersona] = useState<PersonaType>('professional');
  const [language, setLanguage] = useState<LanguageType>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'copilot' | 'summary'>('home');

  // Ensure dark mode is fully disabled and class is removed from the root
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Load profile states
  const [profiles, setProfiles] = useState<Record<PersonaType, UserProfile>>(INITIAL_PROFILES);
  const currentProfile = profiles[persona];

  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState<boolean>(false);

  // Reset balance view when swapping persona
  useEffect(() => {
    setShowBalance(false);
    setIsCheckingBalance(false);
  }, [persona]);

  // Simulated triggers state
  const [triggers, setTriggers] = useState({
    salaryCredited: false,
    travelBooked: false,
    fraudTriggered: false,
    billDue: false,
    pocketMoneyCredited: false,
  });

  // Modal & effect triggers
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [showDemoSidebarMobile, setShowDemoSidebarMobile] = useState(false);
  const [expandedWhyCard, setExpandedWhyCard] = useState<string | null>(null);

  // Time & Status bar state
  const [currentTime, setCurrentTime] = useState('10:15');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Update dynamic events inside profile states based on trigger changes
  useEffect(() => {
    // Reset any temporary state transitions on persona change
    setExpandedWhyCard(null);
  }, [persona]);

  // Helper actions
  const handleSimulateSalary = () => {
    setTriggers(prev => ({ ...prev, salaryCredited: true }));
    // Update professional profile values
    setProfiles(prev => {
      const updated = { ...prev };
      updated.professional.balance += 120000;
      updated.professional.financialScore = 91; // score goes up!
      updated.professional.scoreExplanation = "Excellent! Depositing your salary directly raised your score. Shift excess cash into savings goals.";
      // Prepend a transaction
      updated.professional.transactions = [
        { id: `salary-${Date.now()}`, date: '2026-06-30', description: 'Simulated Salary Credited', amount: 120000, type: 'credit', category: 'salary' },
        ...updated.professional.transactions
      ];
      // Add a next best action for salary
      updated.professional.actions = [
        {
          id: 'salary-sip-action',
          title: 'Start ₹15,000 Index SIP',
          description: 'Deploy ₹15,000 from your credited salary to outpace inflation automatically.',
          actionText: 'Execute SIP Nudge',
          category: 'investment',
          whyReason: 'Your monthly salary has been credited. Our algorithm suggests allocating 12.5% of your ₹1.2L income directly into SBI Nifty 50 Index Fund to maximize tax benefits.',
          triggerType: 'salary_credit'
        },
        ...updated.professional.actions
      ];
      return updated;
    });
    setShowSuccessToast('Salary credited! Account Balance updated.');
    setShowConfetti(true);
  };

  const handleSimulateTravel = () => {
    setTriggers(prev => ({ ...prev, travelBooked: true }));
    setShowSuccessToast('Flight ticket booking detected by Saarthi!');
  };

  const handleSimulatePocketMoney = () => {
    setTriggers(prev => ({ ...prev, pocketMoneyCredited: true }));
    setProfiles(prev => {
      const updated = { ...prev };
      updated.student.balance += 10000;
      updated.student.financialScore = 74;
      updated.student.scoreExplanation = "Pocket money credited! Build solid saving habits by keeping auto-roundups active.";
      updated.student.transactions = [
        { id: `pocket-${Date.now()}`, date: '2026-06-30', description: 'Pocket Money Received', amount: 10000, type: 'credit', category: 'salary' },
        ...updated.student.transactions
      ];
      return updated;
    });
    setShowSuccessToast('Pocket money credited safely!');
    setShowConfetti(true);
  };

  const handleSimulateBillDue = () => {
    setTriggers(prev => ({ ...prev, billDue: true }));
    setShowSuccessToast('Electricity Bill generated. Safe AutoPay trigger armed.');
  };

  const handleSimulateFraud = () => {
    setTriggers(prev => ({ ...prev, fraudTriggered: true }));
    setIsFraudModalOpen(true);
  };

  const handleReset = () => {
    setTriggers({
      salaryCredited: false,
      travelBooked: false,
      fraudTriggered: false,
      billDue: false,
      pocketMoneyCredited: false,
    });
    // Deep copy initial data
    setProfiles(JSON.parse(JSON.stringify(INITIAL_PROFILES)));
    setShowSuccessToast('Demo states re-synchronized successfully.');
    setIsFraudModalOpen(false);
  };

  // Callback when fraud modal succeeds/blocks
  const handleFraudCompletion = (amount: number, isLegitimate: boolean) => {
    if (isLegitimate) {
      setProfiles(prev => {
        const updated = { ...prev };
        // Add approved transaction
        updated[persona].transactions = [
          { id: `fraud-tx-${Date.now()}`, date: '2026-06-30', description: 'Vijay Sales Electronics Approved', amount: amount, type: 'debit', category: 'dining' },
          ...updated[persona].transactions
        ];
        updated[persona].balance -= amount;
        return updated;
      });
      setShowSuccessToast('Unusual transaction approved & completed!');
      setShowConfetti(true);
    } else {
      setShowSuccessToast('Card locked. Secure support handoff initiated.');
    }
    setTriggers(prev => ({ ...prev, fraudTriggered: false }));
  };

  // Add money to goals
  const handleAddMoneyToGoal = (goalId: string, amount: number) => {
    setProfiles(prev => {
      const updated = { ...prev };
      updated[persona].goals = updated[persona].goals.map(g => {
        if (g.id === goalId) {
          const newCurrent = Math.min(g.target, g.current + amount);
          // Check if goal completed
          if (newCurrent >= g.target) {
            setShowConfetti(true);
            setShowSuccessToast(`Congratulations! You reached your goal: "${g.name}"! 🎉`);
            // Complete associated badges
            updated[persona].badges = updated[persona].badges.map(b =>
              b.id === 'badge-2' ? { ...b, completed: true } : b
            );
          }
          return { ...g, current: newCurrent };
        }
        return g;
      });
      return updated;
    });
  };

  // Add custom savings goal
  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    setProfiles(prev => {
      const updated = { ...prev };
      const createdGoal: Goal = {
        ...newGoal,
        id: `custom-goal-${Date.now()}`
      };
      updated[persona].goals.push(createdGoal);
      return updated;
    });
    setShowSuccessToast(`Goal "${newGoal.name}" started with Saarthi!`);
  };

  // Add insurance policy
  const handleAddPolicy = (policy: InsurancePolicy) => {
    setProfiles(prev => {
      const updated = { ...prev };
      updated[persona].policies.push(policy);
      // Mark first insurance badge completed
      updated[persona].badges = updated[persona].badges.map(b =>
        b.id === 'badge-3' ? { ...b, completed: true } : b
      );
      return updated;
    });
    setShowSuccessToast(`Travel insurance policy added to account!`);
    setShowConfetti(true);
  };

  // General payments completion (e.g. from payments tab)
  const handlePaymentSuccess = (amount: number, description: string, category: 'upi' | 'rent') => {
    setProfiles(prev => {
      const updated = { ...prev };
      updated[persona].balance -= amount;
      updated[persona].transactions = [
        { id: `pay-${Date.now()}`, date: '2026-06-30', description: description, amount: amount, type: 'debit', category: category },
        ...updated[persona].transactions
      ];

      // Gamification Check off for UPI Rookie badge
      updated[persona].badges = updated[persona].badges.map(b => {
        if (b.id === 'badge-1' && !b.completed) {
          setShowConfetti(true);
          setShowSuccessToast('Completed! "UPI Rookie" Badge Unlocked! 🏆');
          return { ...b, completed: true };
        }
        return b;
      });

      return updated;
    });
    setShowSuccessToast('Payment sent securely.');
  };

  // Call support callback
  const handleCallSupport = () => {
    setShowSuccessToast('Assigned Manager is dialing your verified line...');
  };

  // Next-best-action execution triggers
  const handleExecuteAction = (actionId: string, category: string) => {
    if (category === 'investment') {
      setActiveTab('copilot'); // Switch to assistant to chat/discuss SIP
      setShowSuccessToast('Saarthi: Lets set up your SIP allocation in chat.');
    } else if (category === 'insurance') {
      // Trigger travel cover purchase
      const newPolicy: InsurancePolicy = {
        id: `pol-travel-${Date.now()}`,
        name: 'SBI SafeTravel Elite',
        type: 'travel',
        coverage: 1000000,
        premium: 290,
        expiry: '2026-07-15',
        status: 'active',
      };
      handleAddPolicy(newPolicy);
    } else {
      setShowSuccessToast('Executing personalized security check-up...');
    }
  };

  return (
    <div id="root-container" className="min-h-screen bg-sbi-bg font-sans text-slate-800 p-0 sm:p-6 lg:p-8 flex flex-col items-center justify-center transition-colors duration-300">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Success Toasts */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 z-50 bg-[#5C2D91] text-white px-5 py-3 rounded-2xl shadow-xl font-bold border border-blue-400/30 flex items-center gap-2.5 text-xs text-center"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{showSuccessToast}</span>
            <button
              onClick={() => setShowSuccessToast(null)}
              className="text-white/70 hover:text-white ml-2 p-0.5 hover:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: Smartphone Core Container (7 cols) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-center">
          {/* Mock Smartphone outer chassis */}
          <div className="relative bg-slate-950 border-[10px] border-slate-900 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(92,45,145,0.18)] overflow-hidden w-full max-w-[410px] h-[780px] flex flex-col">
            
            {/* Dynamic Smartphone Camera punch-hole/Dynamic Island */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-40 flex items-center justify-between px-3 text-white">
              <span className="text-[7px] text-slate-400 font-mono tracking-widest">YONO</span>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            </div>

            {/* Simulated Mobile Status bar */}
            <div className="bg-[#5C2D91] text-white/90 h-10 px-6 pt-5 pb-2 flex items-center justify-between text-[11px] font-bold z-30 shrink-0">
              <span>{currentTime}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-black">5G</span>
                <span>📶</span>
                <span>🔋 98%</span>
              </div>
            </div>

            {/* App Header Component inside phone */}
            <Header
              persona={persona}
              language={language}
              onLanguageChange={setLanguage}
              badges={currentProfile.badges}
              onTabChange={setActiveTab}
              activeTab={activeTab}
              userAvatar={currentProfile.avatar}
              userName={currentProfile.name}
              balance={currentProfile.balance}
              accountNo={currentProfile.accountNo}
              branch={currentProfile.branch}
              transactions={currentProfile.transactions}
              triggers={triggers}
            />

            {/* Live Translating Welcome bar */}
            <div className="bg-[#5C2D91] text-white px-4 py-2 flex items-center justify-between shrink-0 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">
                  {LOCALIZATION.welcome[language]}, {currentProfile.name.split(' ')[0]}
                </span>
                <span className="text-xs">👋</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Secure</span>
              </div>
            </div>

            {/* Main Application Frame Scrollable */}
            <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-16">
              
              {/* Tab 1: Home View */}
              {activeTab === 'home' && (
                <div className={`p-4 flex flex-col gap-4 ${persona === 'senior' ? 'text-lg gap-6' : 'text-sm'}`}>
                  
                  {/* Quick Payment Section on Top */}
                  <Payments
                    persona={persona}
                    language={language}
                    onPaymentSuccess={handlePaymentSuccess}
                  />

                  {/* Separate Pay Bills Section */}
                  <PayBills
                    persona={persona}
                    language={language}
                    onPaymentSuccess={handlePaymentSuccess}
                  />

                  {/* Dedicated Secure Balance Checker Widget */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-6 -mt-6 -z-0 opacity-40 pointer-events-none" />
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-[#5C2D91] rounded-xl">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 leading-none">SBI Secure Vault</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Unified Balance Query</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Saarthi Shield Active
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 z-10">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Available Balance</span>
                        <div className="text-2xl font-black font-mono tracking-tight text-slate-800 mt-1 flex items-center gap-2 min-h-[32px]">
                          {isCheckingBalance ? (
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-sans font-bold">
                              <Loader2 className="w-4 h-4 text-[#5C2D91] animate-spin" />
                              <span>Authenticating Safely...</span>
                            </div>
                          ) : showBalance ? (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-[#5C2D91]"
                            >
                              ₹{currentProfile.balance.toLocaleString('en-IN')}
                            </motion.span>
                          ) : (
                            <span className="text-slate-300 font-sans font-medium text-xl select-none">••••••</span>
                          )}
                        </div>
                      </div>

                      <button
                        id="check-balance-btn"
                        onClick={() => {
                          if (showBalance) {
                            setShowBalance(false);
                          } else {
                            setIsCheckingBalance(true);
                            setTimeout(() => {
                              setIsCheckingBalance(false);
                              setShowBalance(true);
                            }, 800);
                          }
                        }}
                        disabled={isCheckingBalance}
                        className="flex items-center justify-center gap-2 bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition shadow-sm hover:shadow active:scale-98 cursor-pointer disabled:opacity-80"
                      >
                        {isCheckingBalance ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : showBalance ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide Balance</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Check Bank Balance</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      🔒 Your balance query is secured with 256-bit encryption. Click to securely display or conceal your active ledger savings.
                    </p>
                  </div>

                  {/* Adaptive Home Screen Layout reordering based on active persona */}
                  
                  {/* PERSONA: SENIOR/RURAL ADAPTIVE LAYOUT */}
                  {persona === 'senior' && (
                    <>
                      {/* 1. Large simplified balance display */}
                      <div className="bg-gradient-to-br from-[#003d7c] to-[#0151a1] text-white rounded-3xl p-6 shadow-md border-2 border-amber-400">
                        <span className="text-xs uppercase tracking-wider text-blue-200 block font-black">
                          {LOCALIZATION.balance[language]}
                        </span>
                        <div className="text-3xl font-black font-mono tracking-tight mt-1">
                          {showBalance ? `₹${currentProfile.balance.toLocaleString('en-IN')}` : '₹ ••••••'}
                        </div>
                        <div className="mt-4 flex items-center gap-2 bg-black/20 p-2.5 rounded-xl border border-white/10 text-xs">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>{LOCALIZATION.pensionStatus[language]}</span>
                        </div>
                      </div>

                      {/* 2. Direct Voice Assistance Huge Trigger Button */}
                      <button
                        id="senior-voice-trigger"
                        onClick={() => setActiveTab('copilot')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center gap-3 border-2 border-emerald-400 transition transform hover:scale-102 cursor-pointer"
                      >
                        <Mic className="w-12 h-12 text-white animate-pulse" />
                        <span className="text-lg font-black tracking-tight uppercase">{LOCALIZATION.voiceTalk[language]}</span>
                        <span className="text-[11px] text-emerald-100 font-semibold">{LOCALIZATION.voicePrompts[language]}</span>
                      </button>

                      {/* Interactive App Security Shield Score */}
                      <SecurityScore
                        persona={persona}
                        language={language}
                      />

                      {/* 3. Next Best Action card (Digital Life Certificate) */}
                      {currentProfile.actions.map((act) => (
                        <div
                          key={act.id}
                          className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md flex flex-col gap-3"
                        >
                          <span className="bg-amber-400 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider self-start">
                            {LOCALIZATION.suggestionLabel[language]}
                          </span>
                          <h4 className="text-base font-black text-slate-800 leading-tight">
                            {act.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {act.description}
                          </p>

                          <div className="border-t border-slate-100 pt-3 mt-1 flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedWhyCard(expandedWhyCard === act.id ? null : act.id)}
                              className="text-[11px] text-blue-600 font-bold hover:underline flex items-center justify-between cursor-pointer"
                            >
                              <span>{LOCALIZATION.explainWhy[language]}</span>
                              <span>{expandedWhyCard === act.id ? '▲' : '▼'}</span>
                            </button>
                            {expandedWhyCard === act.id && (
                              <p className="text-xs bg-blue-50/80 text-blue-900 p-3 rounded-2xl border border-blue-100 leading-relaxed font-semibold">
                                {act.whyReason}
                              </p>
                            )}
                          </div>

                          <button
                            id={`nba-btn-${act.id}`}
                            onClick={() => handleExecuteAction(act.id, act.category)}
                            className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-bold py-3.5 px-4 rounded-2xl text-xs transition"
                          >
                            {act.actionText}
                          </button>
                        </div>
                      ))}

                      {/* 4. One-Tap Quick Call Branch support */}
                      <button
                        id="senior-call-branch"
                        onClick={handleCallSupport}
                        className="bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-3xl shadow-md flex items-center justify-between border border-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <PhoneCall className="w-6 h-6 text-emerald-400 animate-pulse" />
                          <div className="text-left">
                            <h5 className="font-bold text-xs uppercase text-slate-400">Emergency support</h5>
                            <h4 className="text-sm font-black">{LOCALIZATION.callOfficer[language]}</h4>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </button>
                    </>
                  )}


                  {/* PERSONA: STUDENT ADAPTIVE LAYOUT */}
                  {persona === 'student' && (
                    <>
                      {/* 1. Quick balance overview casual */}
                      <div className="bg-gradient-to-br from-pink-500 to-indigo-600 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        <span className="text-[10px] uppercase tracking-wider text-pink-100 block font-bold">
                          Pocket Budget Check
                        </span>
                        <div className="text-2xl font-black font-mono tracking-tight mt-0.5">
                          {showBalance ? `₹${currentProfile.balance.toLocaleString('en-IN')}` : '₹ ••••••'}
                        </div>
                        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full mt-2 inline-block">
                          🎓 Student Special Cashback Active
                        </span>
                      </div>

                      {/* Interactive App Security Shield Score */}
                      <SecurityScore
                        persona={persona}
                        language={language}
                      />

                      {/* 2. Next Best Action (Micro-SIP nudge) */}
                      {currentProfile.actions.map((act) => (
                        <div
                          key={act.id}
                          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3"
                        >
                          <div className="flex justify-between items-center">
                            <span className="bg-indigo-50 text-indigo-700 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                              Saarthi Micro-SIP Starter Nudge
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 leading-tight">
                            {act.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            {act.description}
                          </p>

                          <div className="border-t border-slate-100 pt-2 flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedWhyCard(expandedWhyCard === act.id ? null : act.id)}
                              className="text-[10px] text-blue-600 font-bold hover:underline flex items-center justify-between cursor-pointer"
                            >
                              <span>{LOCALIZATION.explainWhy[language]}</span>
                              <span>{expandedWhyCard === act.id ? '▲' : '▼'}</span>
                            </button>
                            {expandedWhyCard === act.id && (
                              <p className="text-[11px] bg-blue-50/80 text-blue-900 p-2.5 rounded-xl border border-blue-100 leading-relaxed font-semibold">
                                {act.whyReason}
                              </p>
                            )}
                          </div>

                          <button
                            id={`nba-btn-${act.id}`}
                            onClick={() => handleExecuteAction(act.id, act.category)}
                            className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-bold py-2 px-3 rounded-xl text-xs transition"
                          >
                            {act.actionText}
                          </button>
                        </div>
                      ))}

                      {/* 3. Achievements / Badge Progress */}
                      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-pink-500" />
                          Your Achievements & Milestones
                        </span>

                        <div className="flex flex-col gap-2">
                          {currentProfile.badges.map((b) => (
                            <div
                              key={b.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{b.iconName === 'Zap' ? '⚡' : b.iconName === 'TrendingUp' ? '📈' : '📄'}</span>
                                <div>
                                  <h5 className="text-[11px] font-black text-slate-700">{b.name}</h5>
                                  <p className="text-[9px] text-slate-400 font-medium">{b.description}</p>
                                </div>
                              </div>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${b.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                {b.completed ? 'Earned 🏆' : 'Locked'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. Goals Planner */}
                      <Investments
                        language={language}
                        goals={currentProfile.goals}
                        onAddMoneyToGoal={handleAddMoneyToGoal}
                        onAddGoal={handleAddGoal}
                      />
                    </>
                  )}


                  {/* PERSONA: PROFESSIONAL ADAPTIVE LAYOUT */}
                  {persona === 'professional' && (
                    <>
                      {/* 1. Financial Health gauge score block */}
                      <FinancialHealth
                        score={currentProfile.financialScore}
                        breakdown={currentProfile.healthBreakdown}
                        explanation={currentProfile.scoreExplanation}
                        persona={persona}
                        language={language}
                      />

                      {/* Interactive App Security Shield Score */}
                      <SecurityScore
                        persona={persona}
                        language={language}
                      />

                      {/* 2. Custom Next Best Action cards based on triggers */}
                      {currentProfile.actions.map((act) => (
                        <div
                          key={act.id}
                          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden"
                        >
                          <div className="flex justify-between items-center">
                            <span className="bg-blue-50 text-blue-700 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                              {LOCALIZATION.nextBestAction[language]}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 leading-tight">
                            {act.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            {act.description}
                          </p>

                          {/* Explainable AI link */}
                          <div className="border-t border-slate-100 pt-2 flex flex-col gap-2">
                            <button
                              onClick={() => setExpandedWhyCard(expandedWhyCard === act.id ? null : act.id)}
                              className="text-[10px] text-blue-600 font-bold hover:underline flex items-center justify-between cursor-pointer"
                            >
                              <span>{LOCALIZATION.explainWhy[language]}</span>
                              <span>{expandedWhyCard === act.id ? '▲' : '▼'}</span>
                            </button>
                            {expandedWhyCard === act.id && (
                              <p className="text-[11px] bg-blue-50/80 text-blue-900 p-2.5 rounded-xl border border-blue-100 leading-relaxed font-semibold">
                                {act.whyReason}
                              </p>
                            )}
                          </div>

                          <button
                            id={`nba-btn-${act.id}`}
                            onClick={() => handleExecuteAction(act.id, act.category)}
                            className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-bold py-2 px-3 rounded-xl text-xs transition"
                          >
                            {act.actionText}
                          </button>
                        </div>
                      ))}

                      {/* 4. Goal Planner (Europe/Emergency fund trackers) */}
                      <Investments
                        language={language}
                        goals={currentProfile.goals}
                        onAddMoneyToGoal={handleAddMoneyToGoal}
                        onAddGoal={handleAddGoal}
                      />

                      {/* 5. Insurance Cover */}
                      <Insurance
                        language={language}
                        policies={currentProfile.policies}
                        travelTriggerActive={triggers.travelBooked}
                        onAddPolicy={handleAddPolicy}
                      />
                    </>
                  )}

                </div>
              )}

              {/* Tab 2: Saarthi AI Copilot Assistant */}
              {activeTab === 'copilot' && (
                <div className="p-4 flex flex-col gap-4">
                  <AssistantChat
                    persona={persona}
                    language={language}
                    profile={currentProfile}
                    onLaunchGoalPlanner={() => setActiveTab('home')}
                    onCallBranch={handleCallSupport}
                  />
                </div>
              )}

              {/* Tab 3: Summary / All services */}
              {activeTab === 'summary' && (
                <div className="p-4 flex flex-col gap-4">
                  <RelationshipSummary
                    language={language}
                    profile={currentProfile}
                  />
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/85 shadow-sm flex flex-col gap-2 transition-colors duration-300">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Statement History</span>
                    <div className="flex flex-col gap-2 mt-1">
                      {currentProfile.transactions.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750/50">
                          <div>
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{tx.description}</h4>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500">{tx.date}</span>
                          </div>
                          <span className={`text-xs font-black font-mono ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Simulated Phone Navigation Bottom Bar - Light Blue Pill Tab Design */}
            <div className="absolute bottom-0 left-0 right-0 bg-blue-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-blue-100/60 dark:border-slate-800 h-16 grid grid-cols-3 items-center justify-center text-center z-30 shrink-0 transition-all duration-300 shadow-[0_-4px_20px_rgba(92,45,145,0.05)] px-1">
              <button
                id="tab-home-btn"
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  activeTab === 'home' 
                    ? 'bg-[#5C2D91]/10 text-[#5C2D91] font-black scale-102 shadow-xs border border-[#5C2D91]/15' 
                    : 'text-slate-450 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className="text-sm">🏠</span>
                <span className="text-[9px] font-bold">Home</span>
              </button>
              <button
                id="tab-copilot-btn"
                onClick={() => setActiveTab('copilot')}
                className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  activeTab === 'copilot' 
                    ? 'bg-indigo-100/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-black scale-102 shadow-xs border border-indigo-200/30' 
                    : 'text-slate-450 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className="text-sm">✨</span>
                <span className="text-[9px] font-bold">Saarthi</span>
              </button>
              <button
                id="tab-summary-btn"
                onClick={() => setActiveTab('summary')}
                className={`flex flex-col items-center gap-1 py-1.5 px-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  activeTab === 'summary' 
                    ? 'bg-cyan-100/80 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 font-black scale-102 shadow-xs border border-cyan-200/30' 
                    : 'text-slate-450 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className="text-sm">📄</span>
                <span className="text-[9px] font-bold">Summary</span>
              </button>
            </div>

          </div>

          {/* Floating Hackathon panel toggle for Mobile Screens */}
          <button
            id="mobile-demo-drawer-btn"
            onClick={() => setShowDemoSidebarMobile(true)}
            className="mt-4 lg:hidden bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-full text-xs shadow-lg flex items-center gap-2 border border-slate-700 animate-pulse transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Open Demo Control Panel
          </button>
        </div>

        {/* RIGHT: Hackathon Demo Studio (5 cols - visible on Desktop) */}
        <div className="col-span-1 lg:col-span-5 h-full">
          <div className="hidden lg:block h-full">
            <DemoControls
              currentPersona={persona}
              setPersona={setPersona}
              currentLanguage={language}
              setLanguage={setLanguage}
              onSimulateSalary={handleSimulateSalary}
              onSimulateTravel={handleSimulateTravel}
              onSimulateFraud={handleSimulateFraud}
              onSimulateBillDue={handleSimulateBillDue}
              onSimulatePocketMoney={handleSimulatePocketMoney}
              onReset={handleReset}
              activeTriggers={triggers}
            />
          </div>
        </div>
      </div>

      {/* Floating Drawer overlay for Mobile demo panel */}
      <AnimatePresence>
        {showDemoSidebarMobile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-slate-900 w-[300px] h-full shadow-2xl relative flex flex-col"
            >
              <button
                onClick={() => setShowDemoSidebarMobile(false)}
                className="absolute right-4 top-4 bg-slate-800 text-slate-400 hover:text-white p-2 rounded-full border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="h-full overflow-y-auto">
                <DemoControls
                  currentPersona={persona}
                  setPersona={setPersona}
                  currentLanguage={language}
                  setLanguage={setLanguage}
                  onSimulateSalary={handleSimulateSalary}
                  onSimulateTravel={handleSimulateTravel}
                  onSimulateFraud={handleSimulateFraud}
                  onSimulateBillDue={handleSimulateBillDue}
                  onSimulatePocketMoney={handleSimulatePocketMoney}
                  onReset={handleReset}
                  activeTriggers={triggers}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fraud modal popup */}
      <FraudModal
        isOpen={isFraudModalOpen}
        onClose={() => setIsFraudModalOpen(false)}
        onSuccess={handleFraudCompletion}
      />
    </div>
  );
}
