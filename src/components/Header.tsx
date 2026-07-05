import { useState, useEffect, useRef } from 'react';
import { PersonaType, LanguageType, Transaction, Badge } from '../types';
import { 
  Landmark, 
  Bell, 
  Menu, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Info, 
  AlertTriangle, 
  TrendingUp, 
  CreditCard, 
  CheckCircle2, 
  Check, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  QrCode,
  Settings,
  Award,
  Languages,
  ChevronRight,
  Lock,
  ShieldCheck,
  Trophy,
  Copy,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  persona: PersonaType;
  language: LanguageType;
  onLanguageChange: (lang: LanguageType) => void;
  badges: Badge[];
  activeTab: 'home' | 'copilot' | 'summary';
  onTabChange: (tab: 'home' | 'copilot' | 'summary') => void;
  userAvatar: string;
  userName: string;
  balance: number;
  accountNo?: string;
  branch?: string;
  transactions?: Transaction[];
  triggers?: {
    salaryCredited: boolean;
    travelBooked: boolean;
    fraudTriggered: boolean;
    billDue: boolean;
    pocketMoneyCredited: boolean;
  };
}

export default function Header({
  persona,
  language,
  onLanguageChange,
  badges,
  activeTab,
  onTabChange,
  userAvatar,
  userName,
  balance,
  accountNo = "SBI-******2940",
  branch = "IIT Delhi Campus Branch",
  transactions = [],
  triggers = {
    salaryCredited: false,
    travelBooked: false,
    fraudTriggered: false,
    billDue: false,
    pocketMoneyCredited: false,
  },
}: HeaderProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'transactions'>('alerts');
  const [allRead, setAllRead] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'qr' | 'settings' | 'badges' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [copiedUpId, setCopiedUpId] = useState(false);

  // Settings sub-tab state
  const [settingsTab, setSettingsTab] = useState<'account' | 'fraud' | 'consent' | 'language'>('account');
  // Interactive Fraud Shield Sensitivity state
  const [fraudSensitivity, setFraudSensitivity] = useState<'Low' | 'Standard' | 'Maximum'>('Maximum');
  // Interactive Consent signals state
  const [consents, setConsents] = useState([
    { id: 'tx', name: 'Transaction History Analyzer', desc: 'Identifies high-expenditure patterns & savings opportunities', enabled: true },
    { id: 'sms', name: 'SMS Smart Bill Scrapper', desc: 'Auto-detects due bills (Bescom, Wifi) to prevent late fees', enabled: true },
    { id: 'gps', name: 'GPS Location Safeguard', desc: 'Flags out-of-pattern card transactions (e.g., fraudulent debits in other cities)', enabled: true },
    { id: 'gamify', name: 'Gamification & Milestones', desc: 'Tracks UPI & SIP activity to unlock milestone cashbacks', enabled: true },
  ]);
  const [whatsAppLogs, setWhatsAppLogs] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  // Phone, email, and about me section states (reactive to persona)
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  useEffect(() => {
    if (persona === 'student') {
      setPhone('+91 98765 43210');
      setEmail('kabir.mehta@iitd.ac.in');
      setAboutMe('Sophomore studying Computer Science at IIT Delhi. Passionate about coding, budget-conscious traveling, and building smart tech.');
    } else if (persona === 'professional') {
      setPhone('+91 90123 45678');
      setEmail('ananya.sharma@techcorp.com');
      setAboutMe('Senior Software Engineer in Bengaluru. Enthusiastic about passive investing, mutual funds, personal finance optimization, and trekking.');
    } else if (persona === 'senior') {
      setPhone('+91 94321 09876');
      setEmail('ramesh.prasad32@gmail.com');
      setAboutMe('Retired Government Officer living in Patna. Disciplined saver, enjoying quiet retirement, gardening, and tracking family milestones.');
    }
  }, [persona]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Whenever a new trigger occurs, restore the unread dot badge
  useEffect(() => {
    setAllRead(false);
  }, [
    triggers.salaryCredited,
    triggers.travelBooked,
    triggers.fraudTriggered,
    triggers.billDue,
    triggers.pocketMoneyCredited,
    transactions.length
  ]);

  // Themes colors based on persona
  const getThemeColors = () => {
    switch (persona) {
      case 'student':
        return 'from-sbi-blue via-indigo-900 to-pink-600';
      case 'senior':
        return 'from-sbi-blue via-indigo-900 to-pink-600 border-b-4 border-accent-gold';
      default:
        return 'from-sbi-blue via-indigo-900 to-pink-600'; // classic YONO purple
    }
  };

  // Compile active system alerts based on simulation triggers
  const getAlertNotifications = () => {
    const alerts = [];

    if (triggers.fraudTriggered) {
      alerts.push({
        id: 'notif-fraud',
        title: '🔒 CRITICAL: Security Threat Blocked',
        description: 'An unusual, out-of-pattern card swipe of ₹28,000 at Vijay Sales, Mumbai was auto-blocked by Saarthi AI. Action is required immediately!',
        type: 'fraud',
        severity: 'high',
        time: 'Just now',
      });
    }

    if (triggers.salaryCredited) {
      alerts.push({
        id: 'notif-salary',
        title: '💰 Salary Credited Successfully',
        description: `₹1,20,000 has been credited. Saarthi suggests deploying ₹15,000 into SBI Bluechip Index Fund SIP to maximize inflation-beating yields.`,
        type: 'salary',
        severity: 'success',
        time: 'Today',
      });
    }

    if (triggers.pocketMoneyCredited) {
      alerts.push({
        id: 'notif-pocket',
        title: '🎓 Pocket Money Credited',
        description: '₹10,000 has been credited safely to Kabir\'s pocket wallet. Micro-SIP options for ₹500 are now armed.',
        type: 'student',
        severity: 'success',
        time: 'Today',
      });
    }

    if (triggers.billDue) {
      alerts.push({
        id: 'notif-bill',
        title: '⚡ Electricity Bill Due (₹2,450)',
        description: 'Safe AutoPay trigger armed via YONO Smart-Scheduler. Payment will be processed automatically in 5 days.',
        type: 'bill',
        severity: 'warning',
        time: 'Today',
      });
    }

    if (triggers.travelBooked) {
      alerts.push({
        id: 'notif-travel',
        title: '✈️ Flight Booking Detected',
        description: 'Indigo Airlines ticket transaction completed. Saarthi recommends protecting your upcoming flight with SBI Travel Cover (₹290 premium).',
        type: 'travel',
        severity: 'info',
        time: 'Yesterday',
      });
    }

    // Default general notifications to make the tray look lively and informative
    alerts.push({
      id: 'notif-default-1',
      title: '🛡️ Saarthi AI Smart Protection Active',
      description: 'Your login credentials, daily transactions, and connected UPI IDs are monitored securely under end-to-end sandbox shielding.',
      type: 'security',
      severity: 'normal',
      time: 'Continuous',
    });

    alerts.push({
      id: 'notif-default-2',
      title: '📈 Monthly Financial Score Refreshed',
      description: `Your score stands at ${persona === 'senior' ? '92 (Excellent)' : persona === 'professional' ? '84 (Very Healthy)' : '65 (Average)'}. Check the breakdown for suggestions.`,
      type: 'health',
      severity: 'normal',
      time: '1 day ago',
    });

    return alerts;
  };

  const alertNotifications = getAlertNotifications();

  // Badge count calculation
  const getBadgeCount = () => {
    if (allRead) return 0;
    let count = 0;
    if (triggers.fraudTriggered) count++;
    if (triggers.salaryCredited) count++;
    if (triggers.pocketMoneyCredited) count++;
    if (triggers.billDue) count++;
    if (triggers.travelBooked) count++;
    
    // Add 2 unread markers for transactions if none of the above are active, to always keep user engaged
    if (count === 0 && transactions.length > 0) {
      return 2;
    }
    return count;
  };

  const badgeCount = getBadgeCount();

  const handleMarkAllAsRead = () => {
    setAllRead(true);
  };

  return (
    <div id="app-header" className={`bg-gradient-to-r ${getThemeColors()} text-white p-4 pb-3 flex flex-col gap-3 shrink-0 shadow-lg relative`}>
      {/* Top logo & buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xs font-black tracking-tight font-sans flex items-center gap-1">
              SBI Saarthi AI
              <Sparkles className="w-3 h-3 text-accent-gold animate-pulse" />
            </h1>
            <p className="text-[8px] uppercase tracking-wider text-cyan-200 font-bold">YONO Future Suite</p>
          </div>
        </div>

        {/* Right Header Buttons */}
        <div className="flex items-center gap-1.5 relative">
          <button 
            id="header-notification-bell"
            onClick={() => setShowNotif(!showNotif)}
            className={`p-1.5 hover:bg-white/10 rounded-xl transition relative cursor-pointer ${showNotif ? 'bg-white/20' : ''}`} 
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-white" />
            {badgeCount > 0 && (
              <>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-sbi-blue animate-ping" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-indigo-900 shadow">
                  {badgeCount}
                </span>
              </>
            )}
          </button>

          <div className="relative flex items-center" ref={menuRef}>
            <button 
              id="header-menu-button"
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1.5 hover:bg-white/10 rounded-xl transition cursor-pointer ${showMenu ? 'bg-white/20' : ''}`}
              title="Menu"
            >
              <Menu className="w-4 h-4 text-white" />
            </button>

            {/* Menu Dropdown Panel */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  id="header-menu-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 w-52 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 flex flex-col gap-1 text-xs"
                >
                  <button
                    id="menu-item-qrcode"
                    onClick={() => {
                      setActiveModal('qr');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition font-bold cursor-pointer text-slate-700"
                  >
                    <QrCode className="w-4 h-4 text-[#5C2D91] shrink-0" />
                    <span>Your QR Code</span>
                  </button>

                  <button
                    id="menu-item-badges"
                    onClick={() => {
                      setActiveModal('badges');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition font-bold cursor-pointer text-slate-700"
                  >
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>My Badges</span>
                  </button>

                  <button
                    id="menu-item-languages"
                    onClick={() => {
                      setActiveModal('settings');
                      setSettingsTab('language');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition font-bold cursor-pointer text-slate-700"
                  >
                    <Languages className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Language Settings</span>
                  </button>

                  <button
                    id="menu-item-settings"
                    onClick={() => {
                      setActiveModal('settings');
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition font-bold cursor-pointer text-slate-700"
                  >
                    <Settings className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Settings</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* User profile capsule */}
      <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/10 shadow-inner">
        <img
          src={userAvatar}
          alt={userName}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full border-2 border-white object-cover shadow"
        />
        <div className="flex-1">
          <h3 className={`font-black tracking-tight leading-none ${persona === 'senior' ? 'text-sm' : 'text-xs'}`}>
            {userName}
          </h3>
          <p className="text-[9px] text-cyan-200 mt-1 font-semibold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Adaptive Persona: {persona.toUpperCase()}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase font-bold text-white/70">Verified IP</span>
          <span className="text-[9px] font-mono font-bold bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
            Delhi NCR
          </span>
        </div>
      </div>

      {/* High-Fidelity Notification Popover Drawer (Mobile UI Optimized) */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            id="notifications-popover"
            ref={dropdownRef}
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-14 left-1 right-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 z-50 flex flex-col max-h-[500px] overflow-hidden transition-colors duration-300"
          >
            {/* Popover Header */}
            <div className="p-4 bg-gradient-to-r from-sbi-blue to-[#4A1E7A] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
                <div>
                  <h3 className="text-xs font-black tracking-tight">Saarthi Live Activity Feed</h3>
                  <p className="text-[9px] text-cyan-200 font-bold uppercase tracking-wider">Dynamic Sandbox Logging</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[9px] bg-white/20 hover:bg-white/30 text-white font-bold py-1 px-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  title="Mark all notifications as read"
                >
                  <Check className="w-2.5 h-2.5" />
                  Mark Read
                </button>
                <button 
                  onClick={() => setShowNotif(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Sub Tabs Selection (Alerts vs Transactions) */}
            <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-800 p-1 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <button
                onClick={() => setActiveSubTab('alerts')}
                className={`py-2 text-[10px] uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'alerts'
                    ? 'bg-white dark:bg-slate-700 text-sbi-blue dark:text-white shadow-sm'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <span>🛡️</span>
                Smart Alerts ({alertNotifications.filter(a => a.severity !== 'normal').length})
              </button>
              <button
                onClick={() => setActiveSubTab('transactions')}
                className={`py-2 text-[10px] uppercase tracking-wider font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'transactions'
                    ? 'bg-white dark:bg-slate-700 text-sbi-blue dark:text-white shadow-sm'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <span>💳</span>
                Live Ledger ({transactions.length})
              </button>
            </div>

            {/* Popover List Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50/50 dark:bg-slate-950/20 max-h-[380px]">
              
              {/* ALERTS TAB */}
              {activeSubTab === 'alerts' && (
                <div className="flex flex-col gap-2.5">
                  {alertNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-2xl border text-xs flex gap-2.5 transition-all duration-300 ${
                        notif.severity === 'high' 
                          ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-slate-800 dark:text-red-150' 
                          : notif.severity === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-slate-800 dark:text-amber-150'
                          : notif.severity === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-slate-800 dark:text-emerald-150'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.severity === 'high' ? (
                          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                        ) : notif.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        ) : notif.severity === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-extrabold text-slate-800 dark:text-white leading-tight">
                            {notif.title}
                          </h4>
                          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono whitespace-nowrap">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TRANSACTIONS TAB */}
              {activeSubTab === 'transactions' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1 mb-1 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>Recent Activity</span>
                  </div>

                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
                      No transactions recorded yet.
                    </div>
                  ) : (
                    transactions.map((tx) => {
                      const isCredit = tx.type === 'credit';
                      return (
                        <div 
                          key={tx.id}
                          className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-200 dark:hover:border-slate-700 transition duration-150"
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Icon for transaction category */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isCredit 
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}>
                              {isCredit ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            
                            {/* Transaction Details */}
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight">
                                {tx.description}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider px-1.5 py-0.2 rounded">
                                  {tx.category}
                                </span>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {tx.date}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right shrink-0">
                            <span className={`text-xs font-black font-mono tracking-tight block ${
                              isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
                            }`}>
                              {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[8px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider font-bold">
                              {isCredit ? 'Credit' : 'Debit'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>

            {/* Footer informational banner */}
            <div className="p-3 bg-slate-100 dark:bg-slate-850 border-t border-slate-150 dark:border-slate-800 text-center text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Security audited • Fully sandbox simulated for UPI 2.0</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOM POPUP MODALS (QR, SETTINGS, LANGUAGE, ACHIEVEMENTS) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            {/* Modal: QR Code */}
            {activeModal === 'qr' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white text-slate-800 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col"
              >
                <div className="bg-[#5C2D91] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-cyan-200" />
                    <span className="font-extrabold text-sm">Your Secure QR Code</span>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1 hover:bg-white/15 rounded-full transition cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center gap-4">
                  {/* QR Code Container */}
                  <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 shadow-inner relative flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center relative">
                      <svg className="w-40 h-40 text-slate-800" viewBox="0 0 100 100">
                        <rect x="0" y="0" width="25" height="25" fill="#5C2D91" />
                        <rect x="5" y="5" width="15" height="15" fill="white" />
                        <rect x="8" y="8" width="9" height="9" fill="#5C2D91" />

                        <rect x="75" y="0" width="25" height="25" fill="#5C2D91" />
                        <rect x="80" y="5" width="15" height="15" fill="white" />
                        <rect x="83" y="8" width="9" height="9" fill="#5C2D91" />

                        <rect x="0" y="75" width="25" height="25" fill="#5C2D91" />
                        <rect x="5" y="80" width="15" height="15" fill="white" />
                        <rect x="8" y="83" width="9" height="9" fill="#5C2D91" />

                        <path d="M30,5 h5 v5 h-5 z M40,0 h10 v5 h-10 z M60,0 h10 v5 h-10 z M30,15 h5 v10 h-5 z M45,10 h15 v5 h-15 z M50,20 h5 v5 h-5 z M65,15 h10 v5 h-10 z M35,30 h5 v5 h-5 z M45,35 h10 v5 h-10 z M60,30 h5 v5 h-5 z M75,30 h10 v5 h-10 z M90,30 h10 v5 h-10 z M0,35 h15 v5 h-15 z M10,45 h5 v15 h-5 z M25,45 h20 v5 h-20 z M50,45 h5 v5 h-5 z M60,45 h15 v5 h-15 z M85,45 h10 v5 h-10 z M0,55 h10 v5 h-10 z M20,55 h5 v15 h-5 z M35,55 h15 v5 h-15 z M55,55 h5 v5 h-5 z M65,55 h10 v15 h-10 z M80,55 h10 v5 h-10 z M95,55 h5 v5 h-5 z M0,70 h5 v5 h-5 z M30,65 h10 v5 h-10 z M45,65 h5 v5 h-5 z M55,65 h10 v5 h-10 z M15,75 h5 v15 h-5 z M30,75 h15 v5 h-15 z M50,75 h10 v5 h-10 z M65,75 h5 v5 h-5 z M80,75 h15 v5 h-15 z M30,85 h10 v5 h-10 z M45,85 h5 v10 h-5 z M60,85 h10 v5 h-10 z M75,85 h5 v5 h-5 z M90,85 h10 v5 h-10 z" fill="#334155" />
                        
                        <circle cx="50" cy="50" r="10" fill="#5C2D91" />
                        <circle cx="50" cy="50" r="5" fill="white" />
                        <rect x="48" y="50" width="4" height="6" fill="white" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-slate-400 font-extrabold tracking-widest mt-2 uppercase">BHIM UPI • SBI Saarthi Pay</span>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <h4 className="text-sm font-black text-slate-800">{userName}</h4>
                    <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-xl mt-1 font-mono">
                      <span>{userName.toLowerCase().replace(/\s+/g, '')}@sbi</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${userName.toLowerCase().replace(/\s+/g, '')}@sbi`);
                          setCopiedUpId(true);
                          setTimeout(() => setCopiedUpId(false), 2000);
                        }}
                        className="text-[#5C2D91] hover:text-[#4A1E7A] font-bold font-sans text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUpId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUpId ? "Copied" : "Copy"}</span>
                      </button>
                    </p>
                  </div>

                  <div className="bg-[#5C2D91]/5 border border-[#5C2D91]/10 p-3 rounded-xl text-[10px] text-left text-[#5C2D91]/90 leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#5C2D91] shrink-0 mt-0.5" />
                    <span>Scan this UPI QR code using BHIM SBI Pay, Google Pay, PhonePe, or Paytm to receive securely audited funds in your SBI account.</span>
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-extrabold text-xs py-3 rounded-xl transition shadow cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}

            {/* Modal: Badges (Achievements) */}
            {activeModal === 'badges' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white text-slate-800 rounded-3xl overflow-hidden max-w-sm w-full h-[520px] shadow-2xl border border-slate-100 flex flex-col"
              >
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-200 animate-pulse" />
                    <div>
                      <span className="font-extrabold text-sm block">My Milestones</span>
                      <span className="text-[9px] uppercase font-bold text-amber-100 tracking-wider">SBI Saarthi Rewards</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1 hover:bg-white/15 rounded-full transition cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="p-4 bg-amber-50 border-b border-amber-100/50 flex justify-between items-center text-xs text-amber-800 shrink-0">
                  <span className="font-bold">Total Badges Earned</span>
                  <span className="font-black bg-amber-200/60 px-2 py-0.5 rounded-full text-amber-900 font-mono">
                    {badges.filter(b => b.completed).length} / {badges.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
                  {badges.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">
                      No badges registered for this adaptive persona.
                    </div>
                  ) : (
                    badges.map((badge) => {
                      const isCompleted = badge.completed;
                      return (
                        <div 
                          key={badge.id}
                          className={`p-3.5 rounded-2xl border text-xs flex gap-3 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-white border-slate-100 shadow-sm' 
                              : 'bg-slate-100/40 border-slate-150 text-slate-450'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md shadow-amber-500/10' 
                              : 'bg-slate-200 text-slate-400'
                          }`}>
                            {isCompleted ? (
                              <Award className="w-6 h-6" />
                            ) : (
                              <Lock className="w-4.5 h-4.5" />
                            )}
                          </div>

                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <h4 className={`font-extrabold ${isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                                {badge.name}
                              </h4>
                              {isCompleted ? (
                                <span className="text-[8px] bg-emerald-50 text-emerald-600 font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-emerald-100">
                                  Unlocked
                                </span>
                              ) : (
                                <span className="text-[8px] bg-slate-200 text-slate-550 font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                                  Locked
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] leading-relaxed ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-extrabold text-xs py-3 rounded-xl transition shadow cursor-pointer"
                  >
                    Close Milestones
                  </button>
                </div>
              </motion.div>
            )}

            {/* Modal: Settings */}
            {activeModal === 'settings' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white text-slate-800 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col"
              >
                {/* Modal Header */}
                <div className="bg-[#5C2D91] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-200" />
                    <span className="font-extrabold text-sm">Saarthi App Settings</span>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1 hover:bg-white/15 rounded-full transition cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Settings Tab Selector */}
                <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50 p-1 text-[9.5px] font-bold">
                  <button
                    onClick={() => setSettingsTab('account')}
                    className={`py-2 rounded-xl transition text-center cursor-pointer ${
                      settingsTab === 'account'
                        ? 'bg-white text-[#5C2D91] shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    👤 Account
                  </button>
                  <button
                    onClick={() => setSettingsTab('fraud')}
                    className={`py-2 rounded-xl transition text-center cursor-pointer ${
                      settingsTab === 'fraud'
                        ? 'bg-white text-[#5C2D91] shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🛡️ AI Shield
                  </button>
                  <button
                    onClick={() => setSettingsTab('consent')}
                    className={`py-2 rounded-xl transition text-center cursor-pointer ${
                      settingsTab === 'consent'
                        ? 'bg-white text-[#5C2D91] shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🔒 Consent
                  </button>
                  <button
                    onClick={() => setSettingsTab('language')}
                    className={`py-2 rounded-xl transition text-center cursor-pointer ${
                      settingsTab === 'language'
                        ? 'bg-white text-[#5C2D91] shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🌐 Language
                  </button>
                </div>

                {/* Settings Content Area */}
                <div className="p-4 flex flex-col gap-4 text-xs overflow-y-auto max-h-[380px]">
                  
                  {/* TAB 1: ACCOUNT INFO */}
                  {settingsTab === 'account' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-purple-50/50 p-3.5 rounded-2xl border border-indigo-100/60">
                        <img
                          src={userAvatar}
                          alt={userName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
                        />
                        <div>
                          <span className="font-black text-slate-800 text-sm block">{userName}</span>
                          <span className="text-[9px] bg-[#5C2D91]/15 text-[#5C2D91] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider mt-0.5 inline-block">
                            {persona.toUpperCase()} PERSONA
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center border-b border-slate-200/40 pb-2">
                          <span className="text-[10px] font-bold text-slate-400">SBI ACCOUNT NO.</span>
                          <span className="font-mono font-black text-slate-700 text-xs">{accountNo}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">YONO BRANCH</span>
                          <span className="font-bold text-slate-700 text-right text-[10px]">{branch}</span>
                        </div>
                      </div>

                      {/* Phone, Email, and About Me Interactive Fields */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col gap-3">
                        <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[9px] block">
                          Profile Details
                        </span>
                        
                        {/* Phone Number Input */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Phone Number</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#5C2D91] transition"
                            placeholder="Enter phone number"
                          />
                        </div>

                        {/* Email Address Input */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#5C2D91] transition"
                            placeholder="Enter email address"
                          />
                        </div>

                        {/* About Me Textarea */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase font-sans">About Me (Saarthi Bio)</label>
                          <textarea
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            rows={3}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:border-[#5C2D91] transition resize-none leading-normal"
                            placeholder="Describe yourself to Saarthi..."
                          />
                        </div>
                      </div>

                      <div className="text-[9px] text-slate-400 font-medium leading-relaxed p-2 text-center bg-slate-50 rounded-xl">
                        🔒 Safe & Secure Demo Account. This is a fully functional simulation of an SBI YONO companion service.
                      </div>
                    </div>
                  )}

                  {/* TAB 2: AI FRAUD SHIELD SENSITIVITY */}
                  {settingsTab === 'fraud' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-600 uppercase tracking-wider text-[9px]">Sensitivity Level</span>
                          <span className="text-[10px] font-extrabold bg-purple-50 text-[#5C2D91] border border-purple-100 px-1.5 py-0.5 rounded-full uppercase">
                            {fraudSensitivity} Mode
                          </span>
                        </div>
                        <div className="grid grid-cols-3 bg-slate-50 p-1 rounded-xl border border-slate-150">
                          {['Low', 'Standard', 'Maximum'].map((lvl) => {
                            const isActive = lvl === fraudSensitivity;
                            return (
                              <button
                                key={lvl}
                                onClick={() => setFraudSensitivity(lvl as 'Low' | 'Standard' | 'Maximum')}
                                className={`py-2 text-[10px] font-bold uppercase rounded-lg text-center transition cursor-pointer ${
                                  isActive 
                                    ? 'bg-[#5C2D91] text-white shadow-sm font-black' 
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                        <div className="p-2.5 bg-indigo-50/40 text-indigo-900 border border-indigo-100/50 rounded-xl text-[10px] font-medium leading-relaxed animate-none">
                          {fraudSensitivity === 'Low' && (
                            <span>🛡️ <b>Low Alert Mode:</b> Flags only extremely high-risk card and UPI transfers. Fewer security warnings.</span>
                          )}
                          {fraudSensitivity === 'Standard' && (
                            <span>🛡️ <b>Balanced Mode:</b> Smart contextual protection. Auto-detects moderate location anomalies and high-velocity UPI transfers.</span>
                          )}
                          {fraudSensitivity === 'Maximum' && (
                            <span>🛡️ <b>Strict Guard Mode:</b> Real-time machine-learning monitoring. Scans all velocity, merchant locations, and instantly halts transactions outside your city.</span>
                          )}
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-col gap-2.5 pt-1">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">WhatsApp Real-time Logs</span>
                            <span className="text-[9px] text-slate-400 font-medium">Receive sandbox fraud block reports instantly</span>
                          </div>
                          <button
                            onClick={() => setWhatsAppLogs(!whatsAppLogs)}
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 flex items-center ${whatsAppLogs ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">Biometric Fingerprint</span>
                            <span className="text-[9px] text-slate-400 font-medium">Require validation for unusual transactions</span>
                          </div>
                          <button
                            onClick={() => setBiometrics(!biometrics)}
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 flex items-center ${biometrics ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONSENTS (MOVED FROM BOTTOM) */}
                  {settingsTab === 'consent' && (
                    <div className="flex flex-col gap-3">
                      {/* Certified Trust Badge */}
                      <div className="bg-emerald-50/80 text-emerald-800 p-3 rounded-2xl border border-emerald-100/60 text-[10px] flex gap-2 items-start">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="leading-normal font-medium">
                          <b>SBI Trust Certified:</b> Your data signals are processed strictly on-device. SBI never sells, shares, or transfers your financial data.
                        </div>
                      </div>

                      {/* Toggles list */}
                      <div className="flex flex-col gap-2.5">
                        {consents.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                          >
                            <div className="flex-1">
                              <h4 className="text-[11px] font-black text-slate-700">{c.name}</h4>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed font-medium">{c.desc}</p>
                            </div>

                            <button
                              id={`consent-toggle-${c.id}`}
                              onClick={() => {
                                setConsents(prev => prev.map(item => item.id === c.id ? { ...item, enabled: !item.enabled } : item));
                              }}
                              className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none shrink-0 cursor-pointer ${
                                c.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 bg-white rounded-full absolute top-1 transition-transform ${
                                  c.enabled ? 'translate-x-5.5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 text-[9px] text-amber-900 flex items-start gap-1.5 leading-normal">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>Disabling signals will instantly stop associated Saarthi AI Recommendations.</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: LANGUAGE */}
                  {settingsTab === 'language' && (
                    <div className="flex flex-col gap-2">
                      <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[9px] block mb-1">
                        Select Language (भाषा)
                      </span>
                      {[
                        { code: 'en', nativeName: 'English', script: 'English' },
                        { code: 'hi', nativeName: 'हिन्दी', script: 'Hindi' },
                        { code: 'ta', nativeName: 'தமிழ்', script: 'Tamil' },
                        { code: 'te', nativeName: 'తెలుగు', script: 'Telugu' }
                      ].map((langObj) => {
                        const isSelected = language === langObj.code;
                        return (
                          <button
                            key={langObj.code}
                            onClick={() => {
                              onLanguageChange(langObj.code as LanguageType);
                            }}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between text-left transition duration-200 cursor-pointer ${
                              isSelected 
                                ? 'border-[#5C2D91] bg-blue-50/50 text-[#5C2D91] font-black' 
                                : 'border-slate-150 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                            }`}
                          >
                            <div>
                              <span className="text-xs block">{langObj.nativeName}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{langObj.script}</span>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 bg-[#5C2D91] rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                      <div className="bg-indigo-50/40 text-indigo-950 text-[10px] text-center p-3.5 rounded-2xl border border-[#5C2D91]/10 mt-2 font-medium leading-relaxed">
                        🌐 Language selection translates the conversational Saarthi copilot, voice assist, context banners, and reports instantly.
                      </div>
                    </div>
                  )}

                </div>

                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-extrabold text-xs py-3 rounded-xl transition shadow cursor-pointer text-center"
                  >
                    Save & Close Settings
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
