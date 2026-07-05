import { useState, FormEvent } from 'react';
import { LOCALIZATION } from '../data';
import { LanguageType, PersonaType } from '../types';
import { QrCode, Smartphone, CreditCard, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentsProps {
  persona: PersonaType;
  language: LanguageType;
  onPaymentSuccess: (amount: number, description: string, category: 'upi' | 'rent') => void;
}

export default function Payments({ persona, language, onPaymentSuccess }: PaymentsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'qr' | 'upi'>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'amount' | 'success'>('idle');
  const [scanAmount, setScanAmount] = useState('40');
  const [scannedMerchant, setScannedMerchant] = useState('Chai Point Cafe, Delhi');

  const handleSendUPI = (e: FormEvent) => {
    e.preventDefault();
    if (!upiId || !upiAmount) return;
    onPaymentSuccess(Number(upiAmount), `UPI to ${upiId}`, 'upi');
    setUpiId('');
    setUpiAmount('');
    alert(`Successfully transferred ₹${upiAmount} to ${upiId}!`);
  };

  const handleQRScanPay = () => {
    onPaymentSuccess(Number(scanAmount), `Scan & Pay: ${scannedMerchant}`, 'upi');
    setScanState('success');
    setTimeout(() => {
      setScanState('idle');
    }, 2000);
  };

  const tQuickPay = LOCALIZATION.quickPay[language];
  const tSendMoney = LOCALIZATION.sendMoney[language];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4 transition-colors duration-300">
      {/* Title */}
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <CreditCard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        {tQuickPay}
      </span>

      {/* Sub Tabs */}
      <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveSubTab('upi')}
          className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'upi'
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {tSendMoney}
        </button>
        <button
          onClick={() => setActiveSubTab('qr')}
          className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'qr'
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Scan QR
        </button>
      </div>

      {/* Content Panes */}
      <div className="min-h-[160px]">
        {activeSubTab === 'upi' && (
          <form onSubmit={handleSendUPI} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Receiver UPI ID / Phone</label>
              <input
                type="text"
                placeholder="e.g. upi-friend@sbi or 9876543210"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-750 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Amount (INR)</label>
              <input
                type="number"
                placeholder="e.g. ₹500"
                value={upiAmount}
                onChange={(e) => setUpiAmount(e.target.value)}
                required
                min="1"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-750 font-mono transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <span>Verify & Send Money</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {activeSubTab === 'qr' && (
          <div className="flex flex-col gap-3">
            {scanState === 'idle' && (
              <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-50 dark:bg-slate-800/35 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 gap-2">
                <QrCode className="w-10 h-10 text-[#5C2D91]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Scan QR Code</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Scan any UPI QR code instantly for safe payments</p>
                </div>
                <button
                  onClick={() => setScanState('scanning')}
                  className="bg-[#5C2D91] hover:bg-[#4A1E7A] text-white font-bold py-1.5 px-4 rounded-lg text-[10px] transition cursor-pointer shadow"
                >
                  Scan QR
                </button>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                {/* Animated Scanner Laser */}
                <motion.div
                  animate={{ y: [0, 160, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                  className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#f43f5e] z-10"
                />

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950/80 to-slate-950 z-0" />

                <div className="relative text-center p-4 z-20 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 border-2 border-dashed border-white rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold">Aligning with QR Code...</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setScannedMerchant('Chai Point Cafe, Delhi');
                        setScanAmount('40');
                        setScanState('amount');
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white text-[9px] py-1 px-2.5 rounded border border-white/20 font-bold cursor-pointer"
                    >
                      Scan Cafe (₹40)
                    </button>
                    <button
                      onClick={() => {
                        setScannedMerchant('Vijay Sales Electronics, Mumbai');
                        setScanAmount('45000');
                        setScanState('amount');
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white text-[9px] py-1 px-2.5 rounded border border-white/20 font-bold cursor-pointer"
                    >
                      Scan Electronics (₹45k)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {scanState === 'amount' && (
              <div className="bg-indigo-50 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">Paying Merchant</span>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-150">{scannedMerchant}</h4>
                  </div>
                  <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/35 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">UPI Verified</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">AMOUNT</span>
                    <div className="text-lg font-black font-mono text-indigo-700 dark:text-indigo-450">₹{scanAmount}</div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setScanState('idle')}
                      className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 py-1.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleQRScanPay}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-4 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Approve Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {scanState === 'success' && (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 gap-2">
                <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-450 bg-white dark:bg-slate-900 rounded-full p-2 border border-emerald-200 dark:border-emerald-800 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Payment Transferred Safely</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-450">Simulated secure UPI debit completed</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
