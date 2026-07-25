import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col h-full min-h-[60vh] justify-center items-center text-center space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {greeting} <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="text-[15px] sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Select a project from the top navigation to view AI insights, team workload, and risk analytics.
        </p>
      </div>

      {/* Decorative premium element */}
      <div className="relative w-full max-w-2xl mt-12 aspect-[2/1] rounded-2xl border border-gray-200/50 dark:border-white/5 bg-gradient-to-b from-gray-50/50 to-white dark:from-white/[0.02] dark:to-transparent overflow-hidden shadow-sm flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="relative text-gray-400 dark:text-gray-600 text-sm font-medium">
          Dashboard widgets will appear here
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
