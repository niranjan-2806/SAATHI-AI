import { useState } from 'react';
import { LOCALIZATION } from '../data';
import { LanguageType, PersonaType } from '../types';
import { CreditCard, Info, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayBillsProps {
  persona: PersonaType;
  language: LanguageType;
  onPaymentSuccess: (amount: number, description: string, category: 'upi' | 'rent') => void;
}

export default function PayBills({ persona, language, onPaymentSuccess }: PayBillsProps) {
  // Bill autopay states
  const [autopayElectricity, setAutopayElectricity] = useState(false);
  const [autopayWifi, setAutopayWifi] = useState(false);
  const [showAutopayExplain, setShowAutopayExplain] = useState<string | null>(null);

  // Bill list
  const [bills, setBills] = useState([
    { id: 'bill-1', name: 'Electricity (Bescom)', due: 'Due in 4 days', amount: 2450, paid: false },
    { id: 'bill-2', name: 'Airtel Broadband', due: 'Due in 11 days', amount: 999, paid: false },
  ]);

  const handlePayBill = (id: string, amount: number, name: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, paid: true, due: 'Paid Successfully' } : b));
    onPaymentSuccess(amount, `Bill Paid: ${name}`, 'rent');
  };

  const tPayBill = LOCALIZATION.payBill[language];
  const tAutopay = LOCALIZATION.autopay[language];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4 transition-colors duration-300">
      {/* Title */}
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <CreditCard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        {tPayBill}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-3">
        {/* Bills List */}
        <div className="flex flex-col gap-2">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between transition-colors duration-300"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{bill.name}</h4>
                <span className={`text-[10px] font-semibold ${bill.paid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {bill.due}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-100">₹{bill.amount}</span>
                <button
                  disabled={bill.paid}
                  onClick={() => handlePayBill(bill.id, bill.amount, bill.name)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                    bill.paid
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 cursor-not-allowed'
                      : 'bg-[#5C2D91] hover:bg-[#4A1E7A] text-white shadow'
                  }`}
                >
                  {bill.paid ? 'Paid ✓' : 'Pay Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Autopay Setup */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {tAutopay} (YONO Smart-Scheduler)
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Electricity Autopay */}
            <div className="bg-slate-50 dark:bg-slate-800/45 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Electricity</span>
                <input
                  type="checkbox"
                  checked={autopayElectricity}
                  onChange={(e) => {
                    setAutopayElectricity(e.target.checked);
                    if (e.target.checked) setShowAutopayExplain('electricity');
                    else setShowAutopayExplain(null);
                  }}
                  className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                />
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">Save late fees auto-checked</span>
            </div>

            {/* Broadband Autopay */}
            <div className="bg-slate-50 dark:bg-slate-800/45 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Broadband</span>
                <input
                  type="checkbox"
                  checked={autopayWifi}
                  onChange={(e) => {
                    setAutopayWifi(e.target.checked);
                    if (e.target.checked) setShowAutopayExplain('wifi');
                    else setShowAutopayExplain(null);
                  }}
                  className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                />
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">Auto-debit wifi monthly</span>
            </div>
          </div>

          {/* Explainer message on trigger */}
          <AnimatePresence>
            {showAutopayExplain && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30 text-[10px] leading-relaxed flex gap-1.5"
              >
                <Info className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <b>Saarthi Smart Guard Enabled:</b> Future bills for{' '}
                  {showAutopayExplain === 'electricity' ? 'Electricity' : 'Broadband'} will be scanned automatically
                  from SMS. We will execute payment 1 day before the deadline, keeping ₹1,000 threshold reserves.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
