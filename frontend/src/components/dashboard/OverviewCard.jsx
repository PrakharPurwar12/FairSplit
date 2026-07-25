import React from 'react';

const OverviewCard = ({ title, value, trend, icon: Icon, isLoading = true }) => {
  return (
    <div className="relative p-6 rounded-xl border border-gray-200/60 dark:border-white/5 bg-white dark:bg-[#111111]/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[140px]">
      
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex items-start justify-between w-full mb-3">
        <span className="text-sm font-medium text-gray-500/90 dark:text-gray-400/90">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100/80 dark:border-white/5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-100 dark:group-hover:border-blue-500/20 transition-colors duration-300 shrink-0">
          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
        </div>
      </div>

      <div className="relative z-10 w-full mt-auto">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 w-16 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {value}
            </div>
            {trend && (
              <div className="text-[12px] font-medium text-gray-400">
                {trend}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
