import { useState, useEffect } from 'react';
import { Check, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RecommendationCard = ({ recommendation }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { text: "Scanning project...", icon: Search, color: "text-indigo-400" },
    { text: "Analyzing workload...", icon: Loader2, color: "text-purple-400", spin: true },
    { text: "Recommendation Ready", icon: Check, color: "text-indigo-600" }
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-[14px] p-4 border border-indigo-100/60 flex flex-wrap items-center justify-between gap-4 h-[76px] overflow-hidden relative">
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between w-full"
          >
            {step < 2 ? (
              <div className="flex items-center gap-3">
                <Icon size={16} className={`${current.color} ${current.spin ? 'animate-spin' : 'animate-pulse'}`} />
                <p className={`text-sm font-medium ${current.color}`}>{current.text}</p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">AI Suggestion</p>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    Reassign <b>{recommendation.task}</b> to {recommendation.to}.
                  </p>
                </div>
                <button className="text-xs font-bold bg-primary-brand text-white text-indigo-600 px-4 py-2.5 rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors">
                  Apply Fix
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
