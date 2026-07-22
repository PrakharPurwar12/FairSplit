import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UserCircle } from 'lucide-react';

const TaskAllocationPreview = () => {
  return (
    <div className="w-full bg-white dark:bg-surface rounded-xl border border-gray-200 dark:border-border p-6 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-100 dark:border-border pb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-text flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></span>
            Frontend Architecture Refactoring
          </h3>
          <p className="text-xs text-gray-500 dark:text-text-muted mt-1 font-medium">Epic: Q3 Technical Debt</p>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-none">
          <Sparkles className="w-3 h-3" />
          AI Suggested
        </div>
      </div>

      {/* Candidate List */}
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-400 dark:text-text-muted uppercase tracking-wider font-bold">Recommended Assignees</p>
        
        {/* Candidate 1 */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border hover:border-blue-200 hover:bg-blue-50/30 dark:hover:bg-surface-2 transition-all group cursor-pointer shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserCircle className="w-8 h-8 text-gray-400 dark:text-text-muted" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#09090b]"></div>
            </div>
            <div>
              <p className="text-sm text-gray-900 dark:text-text font-semibold">Sarah Jenkins</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] text-gray-500 dark:text-text-muted font-medium">React Expert</p>
                <span className="text-gray-300 dark:text-text-muted text-[10px]">•</span>
                <p className="text-[10px] text-emerald-600 dark:text-success font-medium">High Capacity</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">98%</span>
              <span className="text-[10px] text-gray-400 dark:text-text-muted font-medium">Match</span>
            </div>
            <button className="bg-white dark:bg-surface-2 hover:bg-gray-50 dark:hover:bg-surface-2 text-gray-700 dark:text-text text-xs px-3 py-1.5 rounded-md font-semibold transition-colors opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none">
              Assign
            </button>
          </div>
        </div>

        {/* Candidate 2 */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-100 dark:hover:bg-surface transition-all group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="relative">
              <UserCircle className="w-8 h-8 text-gray-300 dark:text-text-muted" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-[#09090b]"></div>
            </div>
            <div>
              <p className="text-sm text-gray-700 dark:text-text/80 font-medium">David Chen</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] text-gray-500 dark:text-text-muted font-medium">Frontend Dev</p>
                <span className="text-gray-300 dark:text-text-muted text-[10px]">•</span>
                <p className="text-[10px] text-amber-600 dark:text-warning font-medium">Med Capacity</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-600 dark:text-text/70 font-bold">82%</span>
              <span className="text-[10px] text-gray-400 dark:text-text-muted font-medium">Match</span>
            </div>
            <button className="bg-white dark:bg-surface-2 hover:bg-gray-50 dark:hover:bg-surface-2 text-gray-700 dark:text-text text-xs px-3 py-1.5 rounded-md font-semibold transition-colors opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none">
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAllocationPreview;
