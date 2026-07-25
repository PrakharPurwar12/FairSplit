import React from 'react';

const OverviewCard = ({ title, icon: Icon, isLoading = true }) => {
  return (
    <div className="relative p-5 rounded-2xl border border-gray-200/50 dark:border-white/5 bg-white dark:bg-[#111111]/50 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
      
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 w-16 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {/* Value goes here when not loading */}
            </div>
            <div className="text-xs text-gray-500">
              {/* Trend indicator goes here when not loading */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
