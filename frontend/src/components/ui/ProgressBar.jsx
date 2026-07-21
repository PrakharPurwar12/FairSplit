import { motion } from 'framer-motion';

export const ProgressBar = ({ label, percentage, colorClass, textClass }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold w-9 text-gray-700">{label}</span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div 
        className={`h-full ${colorClass} rounded-full`}
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      />
    </div>
    <span className={`text-xs font-bold ${textClass} w-7 text-right`}>{percentage}%</span>
  </div>
);
