import React from 'react';
import { BarChart3, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const AnalyticsPreview = () => {
  return (
    <div className="w-full bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/50 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-text flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600 dark:text-purple-400" />
          Real-Time Analytics
        </h3>
        <select className="bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border text-gray-600 dark:text-text/70 text-[10px] rounded px-2 py-1 outline-none shadow-sm dark:shadow-none">
          <option>Last 7 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded-lg p-3 shadow-sm dark:shadow-none">
          <p className="text-[10px] text-gray-500 dark:text-text-muted mb-1 font-semibold">Velocity</p>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-text">42 pts</span>
            <span className="text-[10px] text-emerald-600 dark:text-success flex items-center mb-0.5 font-bold">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded-lg p-3 shadow-sm dark:shadow-none">
          <p className="text-[10px] text-gray-500 dark:text-text-muted mb-1 font-semibold">Blockers</p>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-text">2</span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 flex items-center mb-0.5 font-bold">
              +1 from yesterday
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-700 dark:text-text/80">Team Productivity Trend</p>
          <TrendingUp className="w-3 h-3 text-gray-400 dark:text-text-muted" />
        </div>
        
        <div className="flex items-end justify-between h-24 pt-2 border-b border-gray-200 dark:border-border pb-1">
          {[35, 45, 30, 60, 75, 55, 80].map((height, i) => (
            <div key={i} className="w-[10%] flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-full bg-blue-100 dark:bg-surface-2 group-hover:bg-blue-500 dark:group-hover:bg-purple-500/50 transition-colors rounded-t-sm relative" style={{ height: `${height}%` }}>
                {/* Tooltip on hover */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-surface-2 text-white dark:text-text text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-gray-700 dark:border-border-light font-medium">
                  {height} pts
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-gray-400 dark:text-text-muted px-1 font-medium">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Active Members */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-border pt-4 mt-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400 dark:text-text-muted" />
          <span className="text-xs text-gray-600 dark:text-text/70 font-medium">8 Active Members</span>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#1a1a1a] border-2 border-white dark:border-[#09090b] flex items-center justify-center text-[8px] text-gray-600 dark:text-text-secondary font-bold">
              U{i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPreview;
