import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ badge, title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto text-center px-4"
    >
      <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-50 dark:bg-transparent border border-indigo-200 dark:border-indigo-500/30 dark:glass shadow-sm dark:shadow-none">
        <span className="text-[10px] sm:text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">{badge}</span>
      </div>
      
      <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-text mb-6 tracking-tight">
        {title}
      </h2>
      
      <p className="text-lg md:text-xl text-gray-600 dark:text-text-secondary font-light leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default SectionHeader;
