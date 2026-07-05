import { useState } from 'react';
import { LOCALIZATION } from '../data';
import { LanguageType, InsurancePolicy } from '../types';
import { ShieldCheck, Plus, Umbrella, HeartPulse, ChevronRight, Activity, Plane, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InsuranceProps {
  language: LanguageType;
  policies: InsurancePolicy[];
  travelTriggerActive: boolean;
  onAddPolicy: (policy: InsurancePolicy) => void;
}

export default function Insurance({
  language,
  policies,
  travelTriggerActive,
  onAddPolicy,
}: InsuranceProps) {
  const [purchasedTravel, setPurchasedTravel] = useState(false);

  const handleBuyTravelCover = () => {
    const newPolicy: InsurancePolicy = {
      id: `pol-travel-${Date.now()}`,
      name: 'SBI SafeTravel Elite',
      type: 'travel',
      coverage: 1000000,
      premium: 290,
      expiry: '2026-07-15',
      status: 'active',
    };
    onAddPolicy(newPolicy);
    setPurchasedTravel(true);
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'health': return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'travel': return <Plane className="w-5 h-5 text-blue-600" />;
      default: return <Umbrella className="w-5 h-5 text-purple-600" />;
    }
  };

  const tInsurance = LOCALIZATION.insuranceHub[language];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-4">
      {/* Title */}
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <Umbrella className="w-3.5 h-3.5 text-blue-600" />
        {tInsurance}
      </span>

      {/* Trigger-Based Next Best Cover Recommendation */}
      <AnimatePresence>
        {travelTriggerActive && !purchasedTravel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-indigo-900 text-white p-4 rounded-xl border border-indigo-950 flex flex-col gap-3 shadow-md relative overflow-hidden"
          >
            {/* Background pattern decoration */}
            <div className="absolute right-0 bottom-0 text-white/5 pointer-events-none transform translate-x-4 translate-y-4">
              <Plane className="w-28 h-28" />
            </div>

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Live Smart Detection
                </span>
                <h4 className="text-xs font-black mt-1.5 font-sans">Indigo Flight Ticket Cover Detected</h4>
                <p className="text-[11px] text-indigo-200 mt-1 leading-relaxed">
                  Protect your upcoming trip to Mumbai. SBI SafeTravel Elite provides ₹10 Lakh medical emergency, flight cancellation & baggage insurance.
                </p>
              </div>
            </div>

            <div className="bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800/80 flex justify-between items-center text-xs">
              <div>
                <span className="text-indigo-300 block text-[9px] uppercase font-bold">PREMIUM</span>
                <span className="font-extrabold text-white">₹290 one-time fee</span>
              </div>
              <button
                onClick={handleBuyTravelCover}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] shadow transition cursor-pointer"
              >
                Add Cover Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Successfully Purchased notification */}
      {purchasedTravel && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 bg-white rounded-full p-0.5 border border-emerald-300" />
          <span><b>SBI SafeTravel Activated!</b> Your flight booking is fully secured. Policy sent to your mail.</span>
        </div>
      )}

      {/* Policy list */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">My Active Coverages</span>
        {policies.length === 0 ? (
          <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Umbrella className="w-6 h-6 text-slate-300 mx-auto mb-1" />
            <p className="text-xs text-slate-500 font-medium">No active insurance policies. Contact Saarthi to view options.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {policies.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-xl border border-slate-100">
                    {getPolicyIcon(p.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-700">{p.name}</h4>
                    <span className="text-[9px] text-slate-400">Coverage: ₹{p.coverage.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-800 block">₹{p.premium}/mo</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
