import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const AIInsightCard = ({ isLoading = true }) => {
  return (
    <div className="relative min-h-[260px] p-6 sm:p-8 rounded-2xl border border-blue-200/50 dark:border-blue-500/20 shadow-sm overflow-hidden flex flex-col group">
      
      {/* Dynamic Background Mesh / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 dark:from-blue-900/10 dark:via-[#111111] dark:to-indigo-900/10 -z-10"></div>
      
      {/* Animated glowing orbs for premium feel */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10 mb-6 shrink-0">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">AI Insights</h2>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500/90 dark:text-gray-400/90 max-w-xl leading-relaxed">
              Your AI assistant is analyzing project health, workload distribution and deadline risks.
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-500/20 shrink-0">
          <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300 uppercase">AI Engine</span>
        </div>
      </div>

      {/* Content Area / Loading Skeletons */}
      <div className="relative z-10 flex-1 flex flex-col justify-center mt-2">
        {isLoading ? (
          <div className="relative w-full h-full">
            {/* Centered Loading text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">Analyzing project data...</span>
              </motion.div>
            </div>

            {/* Faded skeleton lines to look like recommendations being generated */}
            <div className="space-y-4 opacity-40 dark:opacity-30">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-[90%] bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700 rounded animate-pulse"></div>
                  <div className="h-3 w-[60%] bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-[75%] bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-700 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-3 w-[40%] bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-700 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Real insight content goes here later */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightCard;
