import React from 'react';
import { Lightbulb, Zap, Shuffle, CheckCircle2 } from 'lucide-react';

const AIRecommendationsPreview = () => {
  return (
    <div className="w-full bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-100/50 dark:bg-warning/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-text flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500 dark:text-warning" />
          AI Insights
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {/* Suggestion 1 */}
        <div className="bg-amber-50 dark:bg-amber-500/[0.05] border border-amber-200 dark:border-warning/20 rounded-lg p-4 flex gap-3 relative overflow-hidden group shadow-sm dark:shadow-none">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 dark:bg-amber-500/50 group-hover:bg-amber-500 dark:group-hover:bg-amber-400 transition-colors"></div>
          <Zap className="w-4 h-4 text-amber-500 dark:text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900 dark:text-text mb-1">Optimize Resource Allocation</h4>
            <p className="text-[10px] text-gray-600 dark:text-text-secondary leading-relaxed mb-3 font-medium">
              Design team has 20% unused capacity this sprint. Moving 3 frontend QA tasks to them will accelerate the launch.
            </p>
            <div className="flex gap-2">
              <button className="bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-3 py-1.5 rounded transition-colors border border-amber-200 dark:border-warning/20 shadow-sm dark:shadow-none">
                Apply Optimization
              </button>
              <button className="bg-white dark:bg-surface hover:bg-gray-50 dark:hover:bg-surface-2 text-gray-600 dark:text-text-secondary text-[10px] font-semibold px-3 py-1.5 rounded transition-colors border border-gray-200 dark:border-border shadow-sm dark:shadow-none">
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion 2 */}
        <div className="bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border hover:border-gray-300 dark:hover:border-border transition-colors rounded-lg p-4 flex gap-3 group shadow-sm dark:shadow-none">
          <Shuffle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900 dark:text-text/90 mb-1">Skill Mismatch Detected</h4>
            <p className="text-[10px] text-gray-600 dark:text-text-muted leading-relaxed mb-3 font-medium">
              "Database Migration" is assigned to a junior dev. Reassigning to senior dev reduces risk by 45%.
            </p>
            <button className="bg-white dark:bg-surface hover:bg-gray-100 dark:hover:bg-surface-2 text-gray-700 dark:text-text/80 text-[10px] font-semibold px-3 py-1.5 rounded transition-colors border border-gray-200 dark:border-border flex items-center gap-1.5 shadow-sm dark:shadow-none">
              Review Reassignment
            </button>
          </div>
        </div>
      </div>

      {/* Applied Insights */}
      <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-100 dark:border-border">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
        <span className="text-[10px] text-gray-500 dark:text-text-muted font-medium">3 AI insights automatically applied this week</span>
      </div>
    </div>
  );
};

export default AIRecommendationsPreview;
