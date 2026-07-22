import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ShieldAlert, Activity, BarChart3, ChevronRight } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="pt-32 pb-0 flex flex-col items-center justify-start relative min-h-screen overflow-hidden">
      
      {/* Light Theme Layered Asymmetrical Ambient Lighting */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none block dark:hidden">
        {/* Soft, wide gradients rather than sharp blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-radial from-indigo-50/60 to-transparent blur-[100px] opacity-80"></div>
        <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-blue-50/50 to-transparent blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-violet-50/40 to-transparent blur-[120px] opacity-60"></div>
        {/* Extremely subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAwdjRoNHYtNEgweiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
      </div>

      {/* Dark Theme Cinematic Depth Lighting */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] opacity-50"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[120px] opacity-40"></div>
      </div>

      {/* Content Container (Now restricting width here, not on the section) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center flex-grow">
      
      {/* Centered Copy */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center w-full max-w-4xl z-20 mt-10"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-surface border border-gray-200 dark:border-border w-max mb-8 shadow-sm dark:shadow-none">
          <span className="text-[10px] font-bold text-gray-900 dark:text-white tracking-widest uppercase">FairSplit AI v2.0 Live</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1] font-black tracking-tighter text-gray-900 dark:text-white mb-8">
          Build Smarter Teams.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-primary dark:to-info inline-block py-1">Predict Risks.</span><br/>
          Deliver Faster.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed font-medium">
          FairSplit uses Artificial Intelligence to intelligently assign tasks, balance workloads, predict project risks, and help teams deliver projects faster.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-4 mb-20">
          <Link
            to="/register"
            className="group flex items-center gap-2 bg-gray-900 dark:bg-primary text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-black dark:hover:bg-primary-hover transition-all shadow-md dark:shadow-none hover:shadow-lg"
          >
            Get Started
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#dashboard"
            className="flex items-center gap-2 text-gray-700 dark:text-white px-8 py-4 rounded-full text-sm font-bold bg-white dark:bg-surface hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors border border-gray-200 dark:border-border shadow-sm dark:shadow-none"
          >
            View Dashboard
          </a>
        </motion.div>
      </motion.div>

      {/* Realistic Product Preview Rising from bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl relative z-30 mt-4 rounded-t-2xl overflow-hidden bg-white dark:bg-card shadow-[0_-8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.4)] border-t border-l border-r border-gray-200 dark:border-border flex-grow"
      >
        {/* Browser Chrome / Window Header */}
        <div className="bg-gray-50/90 dark:bg-surface px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-border backdrop-blur-md">
          <div className="flex gap-2 w-20">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-[#27272a]"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-[#27272a]"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-[#27272a]"></div>
          </div>
          <div className="bg-white dark:bg-bg text-gray-500 dark:text-text-muted text-[11px] font-mono px-4 py-1.5 rounded-md flex-1 max-w-xs text-center border border-gray-200 dark:border-border shadow-sm dark:shadow-none">
            app.fairsplit.ai/project-alpha
          </div>
          <div className="w-20"></div>
        </div>

        {/* Dashboard Content Mockup */}
        <div className="flex bg-[#F8FAFC] dark:bg-bg min-h-[550px]">
           
           {/* Mock Sidebar */}
           <div className="w-64 hidden md:flex flex-col gap-6 border-r border-gray-200 dark:border-border bg-[#F1F5F9] dark:bg-transparent p-5">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-surface-2 flex items-center justify-center text-white shadow-sm dark:shadow-none">
                  <div className="w-4 h-4 bg-white/30 rounded-sm"></div>
               </div>
               <div className="h-4 bg-gray-900 dark:bg-border rounded-md w-24"></div>
             </div>
             
             <div className="space-y-2 mt-4">
               <div className="h-9 bg-white dark:bg-surface-2 rounded-md w-full border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none flex items-center px-3 gap-3">
                 <div className="w-4 h-4 rounded-sm bg-indigo-500/20 dark:bg-border"></div>
                 <div className="h-2 bg-indigo-600 dark:bg-primary/50 rounded-sm w-16"></div>
               </div>
               <div className="h-9 bg-transparent dark:bg-surface rounded-md w-full flex items-center px-3 gap-3 hover:bg-gray-200/50">
                 <div className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-surface-2"></div>
                 <div className="h-2 bg-gray-500 dark:bg-border rounded-sm w-20"></div>
               </div>
               <div className="h-9 bg-transparent dark:bg-surface rounded-md w-full flex items-center px-3 gap-3 hover:bg-gray-200/50">
                 <div className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-surface-2"></div>
                 <div className="h-2 bg-gray-500 dark:bg-border rounded-sm w-14"></div>
               </div>
             </div>
             
             <div className="space-y-3 mt-8">
               <div className="h-2 bg-gray-400 dark:bg-surface-2 rounded-sm w-12 mb-2 ml-3"></div>
               <div className="h-8 bg-transparent dark:bg-surface rounded-md w-full flex items-center px-3 gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                 <div className="h-2 bg-gray-500 dark:bg-border rounded-sm w-24"></div>
               </div>
               <div className="h-8 bg-transparent dark:bg-surface rounded-md w-full flex items-center px-3 gap-3">
                 <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                 <div className="h-2 bg-gray-500 dark:bg-border rounded-sm w-16"></div>
               </div>
             </div>
           </div>
           
           {/* Mock Main Content */}
           <div className="flex-1 p-8 flex flex-col gap-6 bg-white dark:bg-transparent">
              {/* Header area */}
              <div className="flex justify-between items-end pb-4 border-b border-gray-100 dark:border-border">
                <div>
                  <div className="h-3 bg-indigo-600 dark:bg-primary/80 rounded-full w-20 mb-3"></div>
                  <div className="h-7 bg-gray-900 dark:bg-border rounded-md w-48"></div>
                </div>
                <div className="flex gap-3">
                   <div className="h-9 w-9 bg-gray-50 dark:bg-surface-2 border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none rounded-full"></div>
                   <div className="h-9 w-28 bg-gray-900 dark:bg-surface-2 shadow-sm dark:shadow-none rounded-full"></div>
                </div>
              </div>
              
              {/* Metrics row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="h-28 bg-white dark:bg-surface rounded-xl border border-gray-200 dark:border-border shadow-sm dark:shadow-none p-5 flex flex-col justify-between relative overflow-hidden group">
                   <div className="h-3 bg-gray-500 dark:bg-border rounded-md w-1/2"></div>
                   <div className="flex items-end justify-between">
                     <div className="h-8 bg-gray-900 dark:bg-border-light rounded-md w-1/3"></div>
                     <div className="h-5 w-14 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-md"></div>
                   </div>
                 </div>
                 
                 <div className="h-28 bg-white dark:bg-surface rounded-xl border border-gray-200 dark:border-border shadow-sm dark:shadow-none p-5 flex flex-col justify-between relative overflow-hidden">
                   <div className="h-3 bg-gray-500 dark:bg-border rounded-md w-1/2"></div>
                   <div className="flex items-end justify-between">
                     <div className="h-8 bg-gray-900 dark:bg-border-light rounded-md w-1/3"></div>
                     <div className="h-5 w-14 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-md"></div>
                   </div>
                 </div>
                 
                 <div className="h-28 bg-gradient-to-br from-indigo-600 to-indigo-700 dark:bg-primary/10 rounded-xl border border-indigo-500 dark:border-primary/20 shadow-md shadow-indigo-200 dark:shadow-none p-5 flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                   <div className="h-3 bg-indigo-200 dark:bg-primary/40 rounded-md w-1/2 relative z-10"></div>
                   <div className="h-8 bg-white dark:bg-primary/60 rounded-md w-1/3 relative z-10 mt-auto"></div>
                 </div>
              </div>
              
              {/* Main chart/table area */}
              <div className="flex-1 bg-white dark:bg-surface rounded-xl border border-gray-200 dark:border-border shadow-sm dark:shadow-none flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-border bg-gray-50/50 dark:bg-transparent">
                  <div className="h-3 bg-gray-800 dark:bg-border rounded-md w-32"></div>
                  <div className="flex gap-2">
                    <div className="h-7 w-20 bg-white dark:bg-surface border border-gray-200 dark:border-transparent rounded-md shadow-sm dark:shadow-none"></div>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col gap-3">
                  {/* Table Headers */}
                  <div className="flex items-center px-4 pb-2 border-b border-gray-100 dark:border-border gap-4">
                    <div className="h-2 bg-gray-400 dark:bg-border rounded-sm w-32"></div>
                    <div className="h-2 bg-gray-400 dark:bg-border rounded-sm w-16 ml-auto"></div>
                    <div className="h-2 bg-gray-400 dark:bg-border rounded-sm w-24 ml-8"></div>
                  </div>
                  
                  {/* Rows */}
                  {[
                    { color: "indigo", width: "w-24", progress: "w-3/4", bg: "bg-indigo-100 dark:bg-indigo-500/10", border: "border-indigo-200 dark:border-indigo-500/20" },
                    { color: "emerald", width: "w-32", progress: "w-1/2", bg: "bg-emerald-100 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
                    { color: "amber", width: "w-20", progress: "w-5/6", bg: "bg-amber-100 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" }
                  ].map((row, i) => (
                    <div key={i} className="h-12 bg-white dark:bg-surface rounded-lg w-full flex items-center px-4 gap-4 border border-gray-100 dark:border-transparent hover:border-gray-300 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                      <div className={`w-6 h-6 rounded-md ${row.bg} border ${row.border} flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-sm bg-${row.color}-500 dark:bg-${row.color}-400`}></div>
                      </div>
                      <div className={`h-2.5 bg-gray-800 dark:bg-border-light rounded-sm ${row.width}`}></div>
                      <div className="h-2 bg-gray-200 dark:bg-surface-2 rounded-full w-24 ml-auto overflow-hidden">
                        <div className={`h-full bg-${row.color}-500 dark:bg-${row.color}-400 ${row.progress}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </motion.div>
      </div>

    </section>
  );
};

export default Hero;
