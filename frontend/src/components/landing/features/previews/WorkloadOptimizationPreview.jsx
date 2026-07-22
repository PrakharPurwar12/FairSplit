import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowRight } from 'lucide-react';

const WorkloadOptimizationPreview = () => {
  return (
    <div className="w-full bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 -left-20 w-40 h-40 bg-emerald-100/50 dark:bg-success/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-text flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-success" />
          Current Sprint Workload
        </h3>
        <span className="text-[10px] font-medium px-2 py-1 bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded text-gray-500 dark:text-text/70 shadow-sm dark:shadow-none">
          Last synced: Just now
        </span>
      </div>

      {/* Workload Bars */}
      <div className="flex flex-col gap-4">
        {/* Person 1 - Overloaded */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-900 dark:text-text/80 font-semibold">Alex Morgan</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">120% (Overbooked)</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-surface rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
            <div className="h-full bg-rose-500" style={{ width: '20%' }}></div>
          </div>
        </div>

        {/* Person 2 - Optimal */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-900 dark:text-text/80 font-semibold">Jordan Lee</span>
            <span className="text-emerald-600 dark:text-success font-bold">85% (Optimal)</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Person 3 - Underutilized */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-900 dark:text-text/80 font-semibold">Taylor Swift</span>
            <span className="text-amber-600 dark:text-warning font-bold">45% (Available)</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="mt-2 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-success/20 rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden shadow-sm dark:shadow-none">
        <div className="flex gap-2">
          <AlertTriangle className="w-4 h-4 text-emerald-600 dark:text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-700 dark:text-emerald-100 font-medium leading-relaxed">
              Alex is overbooked by 8 hours. Reassigning "API Integration" to Taylor will balance the sprint.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white dark:bg-surface-2/40 rounded-md p-2 border border-gray-200 dark:border-border shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 dark:text-text-muted font-medium">Task:</span>
            <span className="text-xs text-gray-900 dark:text-text/90 font-semibold">API Integration (8h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-rose-500 dark:text-rose-400 line-through font-medium">Alex</span>
            <ArrowRight className="w-3 h-3 text-gray-300 dark:text-text-muted" />
            <span className="text-[10px] text-emerald-600 dark:text-success font-bold">Taylor</span>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <button className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded transition-colors font-bold border border-emerald-200 dark:border-success/20 shadow-sm dark:shadow-none">
            Apply Reassignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkloadOptimizationPreview;
