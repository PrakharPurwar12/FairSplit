import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ModuleCard = ({ module }) => {
  const Icon = module.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      className="group relative bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl dark:rounded-sm p-8 hover:bg-white dark:hover:bg-surface-2 transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] -translate-y-0 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-xl dark:rounded-sm flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 border border-gray-200 dark:border-border shadow-sm dark:shadow-none ${module.colorClass.includes('border') ? module.colorClass : 'bg-gray-50 dark:bg-surface text-gray-700 dark:text-text'}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className={`px-3 py-1 rounded-full dark:rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-sm dark:shadow-none ${module.tagClass}`}>
          {module.tag}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-text mb-3 leading-snug relative z-10">
        {module.title}
      </h3>
      <p className="text-gray-600 dark:text-text-secondary leading-relaxed text-sm flex-1 mb-6 relative z-10 font-medium dark:font-light">
        {module.description}
      </p>
      
      <div className="mt-auto pt-5 border-t border-gray-100 dark:border-border relative z-10">
        <h4 className="text-[11px] font-bold text-gray-400 dark:text-text-muted uppercase tracking-wider mb-3">Key Capabilities</h4>
        <ul className="space-y-2.5">
          {module.capabilities?.map((cap, idx) => (
            <li key={idx} className="flex items-center text-[13px] text-gray-600 dark:text-text-secondary font-semibold dark:font-medium leading-tight">
              <Check className="w-3.5 h-3.5 mr-2.5 text-emerald-500 dark:text-success shrink-0" strokeWidth={3} />
              {cap}
            </li>
          ))}
        </ul>
      </div>

      {/* Sharp minimal accent line on hover */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default ModuleCard;
