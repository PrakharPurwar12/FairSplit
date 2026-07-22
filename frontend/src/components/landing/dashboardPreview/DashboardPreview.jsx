import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, BarChart3, Check } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-50 dark:bg-transparent border border-indigo-200 dark:border-indigo-500/30 dark:glass shadow-sm dark:shadow-none">
            <span className="text-[10px] sm:text-xs font-bold text-indigo-700 dark:text-info uppercase tracking-widest">Platform Interface</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-text mb-6 tracking-tight">
            The Command Center for AI Teams
          </h2>
          <p className="text-lg text-gray-600 dark:text-text-secondary max-w-2xl mx-auto font-light">
            Everything you need to monitor, manage, and optimize your projects in one unified, intelligent interface.
          </p>
        </div>

        {/* Dashboard Showcase UI */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full bg-[#F8FAFC] dark:bg-bg rounded-2xl p-2 border border-gray-200 dark:border-border shadow-[0_12px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-2xl overflow-hidden relative"
        >
          <div className="bg-white dark:bg-card rounded-xl w-full h-full border border-gray-100 dark:border-transparent flex flex-col overflow-hidden shadow-sm dark:shadow-none">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-5 border-b border-gray-100 dark:border-border bg-white dark:bg-transparent">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 dark:bg-info/20 text-white dark:text-info flex items-center justify-center shadow-md dark:shadow-none">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-text leading-tight">Project Alpha</h3>
                  <p className="text-xs text-gray-500 dark:text-text-secondary font-medium">Sprint 12 • 4 days remaining</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <span className="px-3 py-1 bg-emerald-50 dark:bg-success/10 text-emerald-600 dark:text-success text-[11px] font-bold rounded-md uppercase tracking-wide border border-emerald-100 dark:border-success/20 flex items-center gap-1.5 shadow-sm dark:shadow-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-success animate-pulse"></span>
                  On Track
                </span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-transparent dark:glass text-indigo-700 dark:text-text text-[11px] font-bold rounded-md uppercase tracking-wide border border-indigo-100 dark:border-border shadow-sm dark:shadow-none">
                  AI Enabled
                </span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#FAFBFC] dark:bg-transparent">
              
              {/* Left Column */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Project Health */}
                <div className="bg-white dark:bg-surface rounded-xl p-6 border border-gray-200 dark:border-border relative overflow-hidden group hover:border-indigo-300 dark:hover:bg-surface-2 transition-colors shadow-sm dark:shadow-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-info/10 blur-2xl rounded-full"></div>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-4">Project Health</p>
                  <div className="flex items-end justify-between">
                    <h4 className="text-4xl font-extrabold text-gray-900 dark:text-text">92<span className="text-xl text-gray-400 dark:text-text-muted">%</span></h4>
                    <BarChart3 size={28} className="text-indigo-600 dark:text-info mb-1" />
                  </div>
                  <div className="mt-5 w-full h-1.5 bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 dark:bg-indigo-500 w-[92%]"></div>
                  </div>
                </div>

                {/* Team Balance */}
                <div className="bg-white dark:bg-surface rounded-xl p-6 border border-gray-200 dark:border-border relative overflow-hidden group hover:border-purple-300 dark:hover:bg-surface-2 transition-colors shadow-sm dark:shadow-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 dark:bg-purple-500/10 blur-2xl rounded-full"></div>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-4">Team Balance</p>
                  <div className="flex items-end justify-between">
                    <h4 className="text-4xl font-extrabold text-gray-900 dark:text-text">98<span className="text-xl text-gray-400 dark:text-text-muted">%</span></h4>
                    <div className="flex -space-x-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white dark:border-[#0f172a]"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-[#0f172a]"></div>
                      <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white dark:border-[#0f172a]"></div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-success mt-5 font-bold dark:font-medium">Optimal distribution</p>
                </div>

                {/* Workload Distribution */}
                <div className="md:col-span-2 bg-white dark:bg-surface rounded-xl p-6 border border-gray-200 dark:border-border relative overflow-hidden shadow-sm dark:shadow-none">
                  <p className="text-[11px] font-bold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-5">Workload Distribution</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group cursor-default">
                      <span className="text-xs font-bold w-12 text-gray-900 dark:text-text-secondary group-hover:text-indigo-600 transition-colors">Alice</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 dark:bg-danger w-[95%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-rose-600 dark:text-danger w-8 text-right">95%</span>
                    </div>
                    <div className="flex items-center gap-4 group cursor-default">
                      <span className="text-xs font-bold w-12 text-gray-900 dark:text-text-secondary group-hover:text-indigo-600 transition-colors">John</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 dark:bg-indigo-400 w-[45%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 dark:text-text-secondary w-8 text-right">45%</span>
                    </div>
                    <div className="flex items-center gap-4 group cursor-default">
                      <span className="text-xs font-bold w-12 text-gray-900 dark:text-text-secondary group-hover:text-indigo-600 transition-colors">Sarah</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 dark:bg-success w-[60%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 dark:text-text-secondary w-8 text-right">60%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                
                {/* Risk Score */}
                <div className="bg-[#FFF5F5] dark:bg-danger/10 rounded-xl p-6 border border-rose-100 dark:border-danger/20 relative overflow-hidden shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="text-rose-600 dark:text-danger" size={16} />
                    <p className="text-[10px] font-bold text-rose-600 dark:text-danger uppercase tracking-widest">Risk Alert</p>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-text mb-1">High Risk</h4>
                  <p className="text-xs text-gray-600 dark:text-danger/80 font-medium">API Integration falling behind schedule.</p>
                </div>

                {/* AI Recommendation */}
                <div className="bg-white dark:bg-card rounded-xl p-5 border border-indigo-100 dark:border-border relative overflow-hidden flex-1 shadow-[0_4px_20px_rgb(79,70,229,0.06)] dark:shadow-none flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-surface flex items-center justify-center border border-indigo-100 dark:border-transparent">
                      <Check size={14} strokeWidth={3} className="text-indigo-600 dark:text-text-secondary"/>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-text-secondary uppercase tracking-widest">AI Action</p>
                  </div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-text mb-2">Rebalance Workload</h5>
                  <p className="text-xs text-gray-600 dark:text-text-secondary mb-6 font-medium dark:font-light leading-relaxed">
                    Alice is at 95% capacity. Suggesting to reassign 'Auth Module' to John to prevent delay.
                  </p>
                  <button className="mt-auto w-full text-[11px] font-bold bg-indigo-600 dark:bg-primary text-white py-2.5 rounded-lg hover:bg-indigo-700 dark:hover:bg-primary-hover transition-colors shadow-sm dark:shadow-none">
                    Apply Fix
                  </button>
                </div>

              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default DashboardPreview;
