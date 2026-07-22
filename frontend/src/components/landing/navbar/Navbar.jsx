import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import ThemeToggle from '../../common/ThemeToggle';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-white/40 dark:bg-surface/80 backdrop-blur-2xl dark:backdrop-blur-xl border border-white/40 dark:border-border shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-2xl rounded-full h-16 flex items-center transition-all duration-300"
    >
      <div className="w-full flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-primary dark:to-accent rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 dark:shadow-lg dark:shadow-primary/20 group-hover:shadow-indigo-500/40 dark:group-hover:shadow-primary/40 transition-all duration-300 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
             <Network className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-text">FairSplit</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600 dark:text-text-secondary">
          <a href="#features" className="hover:text-gray-900 dark:hover:text-text transition-colors hover:text-shadow-sm">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-text transition-colors">Workflow</a>
          <a href="#modules" className="hover:text-gray-900 dark:hover:text-text transition-colors">Modules</a>
          <Link to="/dashboard" className="hover:text-gray-900 dark:hover:text-text transition-colors">Dashboard</Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-text hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-full bg-white/50 dark:bg-surface border border-white/60 dark:border-border shadow-sm dark:shadow-none hover:bg-white/80 dark:hover:bg-surface-2">
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-bold bg-gray-900 dark:bg-primary text-white px-5 py-2 rounded-full hover:bg-black dark:hover:bg-primary-hover transition-all shadow-md dark:shadow-none hover:shadow-lg hover:scale-105 duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
