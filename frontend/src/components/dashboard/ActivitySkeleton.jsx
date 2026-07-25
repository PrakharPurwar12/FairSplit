import React from 'react';

const ActivitySkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-[#111111]/50 border border-gray-200/50 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative pl-6">
              <span className="absolute -left-[5px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-[#111111]"></span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-48 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitySkeleton;
