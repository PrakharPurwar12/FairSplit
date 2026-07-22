import React from 'react';
import { Target, Trophy, ChevronUp, Star } from 'lucide-react';

const ContributionTrackingPreview = () => {
  return (
    <div className="w-full bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-border pb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-text flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Sprint Contribution
        </h3>
        <div className="bg-gray-50 dark:bg-surface rounded-full px-3 py-1 flex items-center gap-1 border border-gray-200 dark:border-border shadow-sm dark:shadow-none">
          <Trophy className="w-3 h-3 text-amber-500 dark:text-warning" />
          <span className="text-[10px] text-gray-700 dark:text-text/80 font-bold">Sprint 42</span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col gap-1">
        {/* Top Contributor */}
        <div className="flex items-center p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 shadow-sm dark:shadow-none">
          <div className="w-6 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400">1</div>
          <div className="flex-1 ml-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-900 dark:text-text flex items-center gap-1.5">
                Elena Rodriguez <Star className="w-3 h-3 text-amber-500 dark:text-warning fill-amber-500 dark:fill-amber-400" />
              </span>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">24 pts</span>
            </div>
            <div className="h-1.5 w-full bg-indigo-200 dark:bg-surface-2/50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-surface transition-colors border border-transparent hover:border-gray-100 dark:hover:border-border">
          <div className="w-6 text-center text-xs font-bold text-gray-400 dark:text-text-muted">2</div>
          <div className="flex-1 ml-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-700 dark:text-text/80">Marcus Johnson</span>
              <span className="text-xs font-bold text-gray-600 dark:text-text/70">18 pts</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 dark:bg-indigo-400/80 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-surface transition-colors border border-transparent hover:border-gray-100 dark:hover:border-border">
          <div className="w-6 text-center text-xs font-bold text-gray-400 dark:text-text-muted">3</div>
          <div className="flex-1 ml-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-700 dark:text-text/80">Sophie Chen</span>
              <div className="flex items-center gap-1">
                <ChevronUp className="w-3 h-3 text-emerald-500 dark:text-success" />
                <span className="text-xs font-bold text-gray-600 dark:text-text/70">15 pts</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-indigo-300 dark:bg-indigo-400/60 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Stat */}
      <div className="mt-2 bg-gray-50 dark:bg-bg rounded-lg p-4 border border-gray-200 dark:border-border flex items-center justify-between shadow-sm dark:shadow-none">
        <div>
          <p className="text-[10px] text-gray-500 dark:text-text-muted uppercase tracking-wider font-bold mb-0.5">Team Completion</p>
          <p className="text-lg font-black text-gray-900 dark:text-text">82%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-emerald-600 dark:text-success font-bold mb-0.5">On Track</p>
          <p className="text-xs text-gray-600 dark:text-text-secondary font-medium">42/51 tasks done</p>
        </div>
      </div>
    </div>
  );
};

export default ContributionTrackingPreview;
