import React from 'react';

const TaskDistributionChart = ({ tasks = [], isLoading = false }) => {
  const getDistribution = () => {
    const total = tasks.length;
    if (total === 0) return { todo: 0, progress: 0, review: 0, completed: 0, total: 0 };

    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    return {
      todo: Math.round((todo / total) * 100),
      progress: Math.round((progress / total) * 100),
      review: Math.round((review / total) * 100),
      completed: Math.round((completed / total) * 100),
      counts: { todo, progress, review, completed },
      total
    };
  };

  const dist = getDistribution();

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-[#111111]/80 border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[220px] justify-between">
        <div className="h-4 w-1/3 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse"></div>
        <div className="h-8 w-full bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse my-4"></div>
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#111111]/80 border border-gray-200/60 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight mb-1">
          Workload Status Distribution
        </h3>
        <p className="text-[11px] text-gray-500">
          Visual status summary across all loaded tasks.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-6 text-xs text-gray-400">
          No tasks found in this workspace.
        </div>
      ) : (
        <div className="space-y-6 my-4">
          {/* Stacked Progress Bar */}
          <div className="h-7 w-full bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden flex shadow-inner">
            {dist.completed > 0 && (
              <div 
                className="h-full bg-green-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_-1px_0_0_rgba(0,0,0,0.1)]"
                style={{ width: `${dist.completed}%` }}
                title={`Completed: ${dist.counts.completed} (${dist.completed}%)`}
              >
                {dist.completed >= 10 && `${dist.completed}%`}
              </div>
            )}
            {dist.progress > 0 && (
              <div 
                className="h-full bg-blue-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_-1px_0_0_rgba(0,0,0,0.1)]"
                style={{ width: `${dist.progress}%` }}
                title={`In Progress: ${dist.counts.progress} (${dist.progress}%)`}
              >
                {dist.progress >= 10 && `${dist.progress}%`}
              </div>
            )}
            {dist.review > 0 && (
              <div 
                className="h-full bg-yellow-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[inset_-1px_0_0_rgba(0,0,0,0.1)]"
                style={{ width: `${dist.review}%` }}
                title={`In Review: ${dist.counts.review} (${dist.review}%)`}
              >
                {dist.review >= 10 && `${dist.review}%`}
              </div>
            )}
            {dist.todo > 0 && (
              <div 
                className="h-full bg-gray-300 dark:bg-gray-700 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-200"
                style={{ width: `${dist.todo}%` }}
                title={`To Do: ${dist.counts.todo} (${dist.todo}%)`}
              >
                {dist.todo >= 10 && `${dist.todo}%`}
              </div>
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0"></span>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-semibold leading-none">Completed</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{dist.counts.completed} tasks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-semibold leading-none">In Progress</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{dist.counts.progress} tasks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0"></span>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-semibold leading-none">In Review</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{dist.counts.review} tasks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-600 shrink-0"></span>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase font-semibold leading-none">To Do</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{dist.counts.todo} tasks</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDistributionChart;
