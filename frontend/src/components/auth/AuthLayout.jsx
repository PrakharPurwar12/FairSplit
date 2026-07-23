import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import { ShieldCheck, Activity, BrainCircuit, Users, BarChart3, CheckCircle2 } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-bg text-text font-sans flex relative transition-colors duration-300">
      
      {/* Left Panel: Premium Brand Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-2 dark:bg-[#09090b] border-r border-border flex-col justify-between p-10 overflow-hidden">
        
        {/* Soft Ambient Lighting Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-info/5 blur-[120px] rounded-full"></div>
          {/* Subtle noise overlay (light theme only for clean dark theme) */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay hidden dark:block" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>

        {/* Top Header */}
        <div className="z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="FairSplit Logo" className="h-8 w-auto object-contain" />
            </div>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
            All systems operational
          </div>
        </div>

        {/* Center Content */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 max-w-md mt-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface shadow-sm mb-6">
            <BrainCircuit size={14} className="text-primary" />
            <span className="text-xs font-medium text-text-secondary">AI-Powered Project Management</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Build smarter teams.<br/>
            <span className="text-text-muted">Balance workloads instantly.</span>
          </h1>
          
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            Intelligently assign tasks, predict project risks, and optimize team health with our advanced AI engine.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text shadow-sm">
                <Users size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Intelligent Team Formation</h4>
                <p className="text-xs font-medium text-text-muted mt-0.5">Match skills perfectly.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text shadow-sm">
                <BarChart3 size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Predictive Risk Analysis</h4>
                <p className="text-xs font-medium text-text-muted mt-0.5">Catch burnout early.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text shadow-sm">
                <Activity size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Dynamic Workload Balancing</h4>
                <p className="text-xs font-medium text-text-muted mt-0.5">Optimize continuously.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <div className="z-10 flex items-center justify-between text-xs font-medium text-text-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Enterprise-grade security
          </div>
          <span>v2.1.0</span>
        </div>
      </div>

      {/* Right Panel: Authentication Card Focus */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-bg items-center justify-center p-6 sm:p-8">
        
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center justify-center bg-white rounded-2xl p-2 shadow-sm transition-transform hover:scale-105">
              <img src="/logo.png" alt="FairSplit Logo" className="h-12 w-auto object-contain" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-surface border border-border rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl p-6 sm:p-8 w-full relative overflow-hidden">
            {/* Subtle card lighting for depth */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"></div>
            
            <div className="mb-6 text-left">
              <h2 className="text-2xl font-bold tracking-tight mb-1 text-text">{title}</h2>
              <p className="text-sm font-medium text-text-secondary">{subtitle}</p>
            </div>

            {children}

          </div>
          
          <div className="mt-6 flex justify-center gap-6 text-xs font-medium text-text-muted">
            <a href="#" className="hover:text-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
