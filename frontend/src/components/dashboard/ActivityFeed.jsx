import React from 'react';

const ActivityFeed = ({ activities = [], isLoading = false }) => {
  const getInitials = (username) => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  };

  const getRelativeTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-[#111111]/80 border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Recent Activity</h3>
        </div>
        <div className="flex-1 p-6">
          <div className="relative border-l border-gray-100 dark:border-gray-800/80 ml-3 space-y-7">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative pl-6">
                <span className="absolute -left-[5px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-[#111111]"></span>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-gray-100/80 dark:bg-white/5 rounded-md animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-100/80 dark:bg-white/5 rounded-md animate-pulse"></div>
                  </div>
                  <div className="h-4 w-48 max-w-[80%] bg-gray-100/80 dark:bg-white/5 rounded-md animate-pulse"></div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-gray-100/80 dark:bg-white/5 animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-100/80 dark:bg-white/5 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#111111]/80 border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Recent Activity</h3>
      </div>
      <div className="flex-1 p-6 overflow-y-auto max-h-[350px]">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">
            No recent activity recorded.
          </div>
        ) : (
          <div className="relative border-l border-gray-100 dark:border-gray-800/80 ml-3 space-y-6">
            {activities.map((act, index) => {
              const dotColor = 
                act.type === 'project_created' 
                  ? 'bg-blue-500' 
                  : act.type === 'task_completed' 
                    ? 'bg-green-500' 
                    : act.type === 'member_added'
                      ? 'bg-purple-500'
                      : 'bg-yellow-500';

              return (
                <div key={index} className="relative pl-6 group">
                  <span className={`absolute -left-[5px] top-1.5 flex h-2.5 w-2.5 rounded-full ${dotColor} ring-4 ring-white dark:ring-[#111111] group-hover:scale-125 transition-transform`} />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200 leading-none">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {getRelativeTime(act.time)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[9px] font-bold overflow-hidden border border-blue-500/20">
                        {getInitials(act.user)}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500">
                        @{act.user || 'system'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
