import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Activity, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const icons = [ShieldAlert, Zap, Activity, Users, CheckCircle];
const colors = [
  'bg-rose-100 text-rose-500 border-rose-100/50',
  'bg-emerald-100 text-emerald-500 border-emerald-100/50',
  'bg-blue-100 text-blue-500 border-blue-100/50',
  'bg-indigo-100 text-indigo-500 border-indigo-100/50',
  'bg-purple-100 text-purple-500 border-purple-100/50'
];

export const ActivityCard = ({ activities, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activities.length]);

  const currentActivity = activities[currentIndex];
  const Icon = icons[currentIndex % icons.length];
  const colorScheme = colors[currentIndex % colors.length];

  return (
    <div className={`absolute -left-8 bottom-12 w-52 z-30 hidden xl:block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`py-3 px-4 shadow-xl border bg-white/95 rounded-[16px] backdrop-blur-md ${colorScheme}`}
        >
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center shrink-0 shadow-sm">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">{currentActivity.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{currentActivity.description}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
