import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const AIInsightCard = ({ isLoading = true }) => {
  return (
    <div className="relative p-6 rounded-2xl border border-blue-200/50 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-[#111111] shadow-sm mb-8 w-full group overflow-hidden">
      
      {/* Premium glow effect */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">AI Insights</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-5 w-3/4 max-w-lg bg-blue-100/50 dark:bg-blue-900/20 rounded animate-pulse"></div>
            <div className="h-4 w-full max-w-2xl bg-blue-50/50 dark:bg-blue-900/10 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 max-w-xl bg-blue-50/50 dark:bg-blue-900/10 rounded animate-pulse"></div>
            <div className="pt-2">
              <div className="h-8 w-32 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg animate-pulse"></div>
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
