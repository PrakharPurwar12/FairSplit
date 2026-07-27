import React from 'react';
import { Sparkles, Cpu, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AIInsightCard = ({ riskData = null, isLoading = true, error = null }) => {
  const navigate = useNavigate();

  const getRiskStatus = () => {
    if (!riskData) return { label: 'AI Analysis Pending', color: 'text-gray-500 bg-gray-100 dark:bg-white/5 border-gray-200' };
    const pct = riskData.high_risk_percentage;
    if (pct > 30) {
      return { 
        label: 'High Risk Alert', 
        color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50' 
      };
    }
    if (pct > 10) {
      return { 
        label: 'Moderate Risk', 
        color: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/50' 
      };
    }
    return { 
      label: 'Healthy timeline', 
      color: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50' 
    };
  };

  const status = getRiskStatus();

  return (
    <div className="relative min-h-[260px] p-6 sm:p-8 rounded-2xl border border-blue-200/50 dark:border-blue-500/20 shadow-sm overflow-hidden flex flex-col group h-full justify-between">
      
      {/* Dynamic Background Mesh / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 dark:from-blue-900/10 dark:via-[#111111] dark:to-indigo-900/10 -z-10"></div>
      
      {/* Animated glowing orbs for premium feel */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10 mb-5 shrink-0">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">AI Insights</h2>
            <p className="text-[13px] sm:text-sm font-medium text-gray-500/90 dark:text-gray-400/90 max-w-xl leading-relaxed">
              Your AI assistant is analyzing project health, workload distribution and deadline risks.
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-500/20 shrink-0">
          <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300 uppercase">AI Engine</span>
        </div>
      </div>

      {/* Content Area / Loading Skeletons */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">Analyzing project data...</span>
              </motion.div>
            </div>

            <div className="space-y-4 opacity-40 dark:opacity-30">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-[90%] bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700 rounded animate-pulse"></div>
                  <div className="h-3 w-[60%] bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-[75%] bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-700 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-3 w-[40%] bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-700 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Prediction engine unavailable.</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Please ensure the backend predictor is set up.</p>
          </div>
        ) : !riskData ? (
          <div className="flex flex-col items-center justify-center py-4 text-center text-gray-400">
            <HelpCircle className="w-8 h-8 mb-2" />
            <span className="text-xs">Select a project from the switcher to view AI insights.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status and confidence */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${status.color}`}>
                {status.label}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                Model Confidence: <strong className="text-gray-700 dark:text-gray-300">{(riskData.average_confidence * 100).toFixed(0)}%</strong>
              </span>
            </div>

            {/* Insights recommendations list */}
            <div className="space-y-3">
              {riskData.high_risk_tasks.length > 0 ? (
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    System detected <strong className="text-red-500">{riskData.high_risk_tasks.length} task(s)</strong> with High Delivery Risk. This may lead to timeline delays.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    All deadlines are currently healthy. No delivery risk detected across any tasks.
                  </div>
                </div>
              )}

              {riskData.high_risk_tasks.length > 0 && (
                <div className="flex items-start gap-2.5">
                  <Cpu className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Task redistribution is recommended. Reallocate workload to balance difficulty score and log hours.
                  </div>
                </div>
              )}
            </div>

            {/* View prediction details link */}
            {riskData.high_risk_tasks.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => navigate('/prediction')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-blue-600/10"
                >
                  View Suggested Reductions
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightCard;
