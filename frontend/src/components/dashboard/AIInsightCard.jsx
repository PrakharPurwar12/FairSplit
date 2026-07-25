import React from 'react';
import { Sparkles } from 'lucide-react';

const AIInsightCard = ({ isLoading = true }) => {
  return (
    <div className="relative p-6 sm:p-8 rounded-2xl border border-blue-200/50 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 dark:from-blue-900/10 dark:via-[#111111] dark:to-[#111111] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(59,130,246,0.05)] w-full group overflow-hidden">
      
      {/* Premium glow effect */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[64px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-400/5 rounded-full blur-[64px] pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20 shadow-sm shadow-blue-500/10">
            <Sparkles className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">AI Insights</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4 max-w-3xl">
            <div className="h-6 w-[85%] bg-blue-100/50 dark:bg-blue-900/20 rounded-lg animate-pulse"></div>
            <div className="h-4 w-full bg-blue-50/60 dark:bg-blue-900/10 rounded-lg animate-pulse"></div>
            <div className="h-4 w-[90%] bg-blue-50/60 dark:bg-blue-900/10 rounded-lg animate-pulse"></div>
            <div className="pt-4">
              <div className="h-9 w-36 bg-blue-100/60 dark:bg-blue-900/30 rounded-xl animate-pulse"></div>
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
