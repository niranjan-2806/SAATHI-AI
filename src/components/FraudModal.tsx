import { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, PhoneCall, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FraudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, isLegitimate: boolean) => void;
}

export default function FraudModal({ isOpen, onClose, onSuccess }: FraudModalProps) {
  const [step, setStep] = useState<'verify' | 'legitimate' | 'blocked' | 'handoff'>('verify');

  if (!isOpen) return null;

  const handleLegitimate = () => {
    setStep('legitimate');
    setTimeout(() => {
      onSuccess(45000, true);
      setStep('verify');
      onClose();
    }, 2500);
  };

  const handleReportFraud = () => {
    setStep('blocked');
  };

  const handleHandoff = () => {
    setStep('handoff');
  };

  const handleCompleteBlock = () => {
    onSuccess(45000, false);
    setStep('verify');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          id="fraud-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white text-slate-800 rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl border-2 border-red-500/30"
        >
          {/* Header Banner */}
          <div className="bg-red-600 text-white p-5 flex flex-col items-center gap-2 relative">
            <button
              onClick={() => {
                setStep('verify');
                onClose();
              }}
              className="absolute right-4 top-4 text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <ShieldAlert className="w-12 h-12 text-white animate-bounce" />
            <h3 className="text-lg font-extrabold tracking-tight font-sans">SBI Saarthi FraudShield</h3>
            <span className="bg-red-800/80 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-red-500/30">
              Immediate Action Required
            </span>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 'verify' && (
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500">We detected an out-of-pattern, high-value card transaction on your account.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                    <span className="text-xs text-slate-400">Merchant</span>
                    <span className="text-sm font-bold text-slate-700">Vijay Sales, Mumbai</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                    <span className="text-xs text-slate-400">Category</span>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Electronics</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-slate-400">Amount</span>
                    <span className="text-lg font-black text-red-600 font-mono">₹45,000.00</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <b>Why flagged:</b> This transaction originates in Mumbai, while your phone location is registered in Delhi/Bengaluru.
                  </span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <button
                    id="fraud-yes-btn"
                    onClick={handleLegitimate}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Yes, It is Me (Approve)
                  </button>
                  <button
                    id="fraud-no-btn"
                    onClick={handleReportFraud}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    No, Report Fraud & Block Card
                  </button>
                  <button
                    id="fraud-call-btn"
                    onClick={handleHandoff}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    Talk to Branch RM Now
                  </button>
                </div>
              </div>
            )}

            {step === 'legitimate' && (
              <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-slate-800">Transaction Approved</h4>
                <p className="text-xs text-slate-500 max-w-[240px]">
                  Simulated biometric approved. Saarthi has registered this device location. Have a safe purchase!
                </p>
              </div>
            )}

            {step === 'blocked' && (
              <div className="flex flex-col gap-4 text-center items-center py-2">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Card Blocked Securely</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your SBI Credit & Debit cards have been temporarily locked to prevent further unauthorized usage.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left w-full flex flex-col gap-1.5 text-xs">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    SBI Rescue Protocol Activated
                  </div>
                  <p className="text-slate-500">
                    Your Branch Relationship Manager, <b>Amit Sharma</b>, is calling you right now at <b>+91 98*** **321</b>.
                  </p>
                  <p className="text-[10px] text-amber-600 italic">
                    A secure card replacement has been requested for dispatch.
                  </p>
                </div>

                <button
                  id="fraud-block-done-btn"
                  onClick={handleCompleteBlock}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                >
                  Close & Acknowledge
                </button>
              </div>
            )}

            {step === 'handoff' && (
              <div className="flex flex-col gap-4 text-center items-center py-2">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                  <PhoneCall className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Connecting to Branch</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Initiating a secure callback to your registered phone number.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left w-full flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Branch</span>
                    <span className="font-bold text-slate-700">Patna Main Branch</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escalation Code</span>
                    <span className="font-mono font-bold text-red-600">SBI-903-FRAUD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Call ETA</span>
                    <span className="font-bold text-emerald-600 animate-pulse">Now (Calling you...)</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    id="fraud-handoff-cancel-btn"
                    onClick={() => setStep('verify')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-xs transition cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    id="fraud-handoff-close-btn"
                    onClick={handleCompleteBlock}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg text-xs transition cursor-pointer"
                  >
                    Close & Receive Call
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
