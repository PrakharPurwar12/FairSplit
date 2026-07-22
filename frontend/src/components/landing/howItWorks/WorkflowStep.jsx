import React from 'react';
import { motion } from 'framer-motion';

const WorkflowStep = ({ data, index }) => {
  const Icon = data.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white dark:bg-card border border-white dark:border-border p-8 md:p-10 rounded-2xl dark:rounded-sm hover:bg-gray-50/50 dark:hover:bg-surface-2 transition-all duration-300 group shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05),0_4px_6px_-2px_rgba(6,81,237,0.02)] hover:shadow-[0_8px_30px_rgb(6,81,237,0.08)] dark:shadow-none dark:hover:shadow-none`}
    >
      {/* Decorative Background Number */}
      <div className={`absolute top-6 right-6 md:top-1/2 md:-translate-y-1/2 ${isEven ? 'md:right-10 md:left-auto' : 'md:left-10 md:right-auto'} text-7xl md:text-[140px] font-black text-gray-100 dark:text-text/[0.03] z-0 group-hover:text-gray-200 dark:group-hover:text-primary/[0.05] transition-colors pointer-events-none leading-none select-none`}>
        {data.step}
      </div>
      
      {/* Content Container (z-10 ensures it sits above the decorative number) */}
      <div className="relative z-10 w-16 h-16 rounded-xl dark:rounded-sm bg-indigo-50 dark:bg-surface border border-indigo-100 dark:border-border flex items-center justify-center shrink-0 shadow-sm dark:shadow-none mt-4 md:mt-0">
        <Icon className="w-8 h-8 text-indigo-600 dark:text-primary" strokeWidth={1.5} />
      </div>

      <div className={`relative z-10 flex flex-col flex-1 text-center ${isEven ? 'md:text-left md:pr-24' : 'md:text-right md:pl-24'}`}>
         <h3 className="text-2xl font-bold text-gray-900 dark:text-text mb-3">
          {data.title}
         </h3>
         <p className="text-gray-600 dark:text-text-secondary leading-relaxed text-sm font-medium dark:font-light">
          {data.description}
         </p>
      </div>
    </motion.div>
  );
};

export default WorkflowStep;
