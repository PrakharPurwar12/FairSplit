import React from 'react';
import { Plus, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeHero = ({ userName, isLoading = true }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 w-full">
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          {greeting},{' '}
          {isLoading ? (
            <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse"></div>
          ) : (
            <span>{userName}</span>
          )}
          <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="text-[15px] text-gray-500 dark:text-gray-400">
          Manage your AI-powered projects with real-time insights.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-200 border border-gray-200/70 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm">
          <Layout className="w-4 h-4" />
          View Projects
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>
    </div>
  );
};

export default WelcomeHero;
