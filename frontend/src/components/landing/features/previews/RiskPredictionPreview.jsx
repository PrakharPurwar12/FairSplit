import React from 'react';
import { ShieldAlert, AlertCircle, Clock } from 'lucide-react';

const RiskPredictionPreview = () => {
  return (
    <div className="w-full bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-rose-100/50 dark:bg-danger/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-text flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-danger" />
          Project Health Risk
        </h3>
        <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-danger/10 text-rose-600 dark:text-danger px-2 py-1 rounded text-[10px] font-bold border border-rose-100 dark:border-danger/20 shadow-sm dark:shadow-none">
          <AlertCircle className="w-3 h-3" />
          High Risk Detected
        </div>
      </div>

      {/* Risk Score */}
      <div className="flex items-end gap-4 border-b border-gray-100 dark:border-border pb-5">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" className="stroke-gray-100 dark:stroke-[#27272a]" strokeWidth="6" />
            <circle cx="32" cy="32" r="28" fill="none" className="stroke-rose-500 dark:stroke-[#f43f5e] drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" strokeWidth="6" strokeDasharray="175" strokeDashoffset="40" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-text">78%</span>
          </div>
        </div>
        <div className="flex-1 pb-1">
          <p className="text-xs text-rose-600 dark:text-danger font-bold mb-1">Delay Probability</p>
          <p className="text-[10px] text-gray-500 dark:text-text-muted leading-relaxed font-medium">
            Based on current velocity and remaining dependencies, the Mobile App Launch is highly likely to miss the Oct 15 deadline.
          </p>
        </div>
      </div>

      {/* Timeline Warning */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 dark:text-text-secondary font-semibold">Timeline Forecast</span>
          <span className="text-gray-400 dark:text-text-muted font-medium">2 weeks remaining</span>
        </div>
        
        <div className="relative pt-4 pb-2">
          {/* Timeline bar */}
          <div className="h-1.5 w-full bg-gray-100 dark:bg-surface rounded-full relative">
            <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
            {/* Projected delay */}
            <div className="absolute top-0 left-[45%] h-full bg-rose-200 dark:bg-rose-500/30 rounded-r-full border-y border-r border-rose-300 dark:border-rose-500/50" style={{ width: '30%' }}></div>
          </div>
          
          {/* Deadline Marker */}
          <div className="absolute top-0 left-[65%] flex flex-col items-center -translate-x-1/2">
            <div className="bg-white dark:bg-surface-2 text-gray-700 dark:text-text text-[9px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-border-light mb-1 whitespace-nowrap shadow-sm dark:shadow-none font-medium">
              Oct 15 (Deadline)
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-border-light"></div>
          </div>

          {/* Forecasted Completion */}
          <div className="absolute top-6 left-[75%] flex flex-col items-center -translate-x-1/2">
            <div className="w-px h-3 bg-rose-300 dark:bg-rose-500/50"></div>
            <div className="bg-rose-50 dark:bg-danger/10 text-rose-600 dark:text-danger text-[9px] px-1.5 py-0.5 rounded border border-rose-200 dark:border-danger/20 mt-1 whitespace-nowrap font-bold">
              Oct 22 (Forecast)
            </div>
          </div>
        </div>
      </div>

      {/* Mitigation */}
      <div className="mt-2 bg-gray-50 dark:bg-surface border border-gray-200 dark:border-border rounded-lg p-3 flex justify-between items-center shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs text-gray-700 dark:text-text/80 font-medium">Shift 2 backend tasks to resolve bottleneck</span>
        </div>
        <button className="text-[10px] bg-white dark:bg-surface-2 hover:bg-gray-100 dark:hover:bg-surface-2 text-gray-900 dark:text-text px-3 py-1.5 rounded transition-colors font-bold border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none">
          Review
        </button>
      </div>
    </div>
  );
};

export default RiskPredictionPreview;
