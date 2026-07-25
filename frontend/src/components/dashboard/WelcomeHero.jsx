import React from 'react';
import { Plus, Layout } from 'lucide-react';

const WelcomeHero = ({ userName, isLoading = true }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          {greeting},{' '}
          {isLoading ? (
            <div className="h-9 w-36 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
          ) : (
            <span>{userName}</span>
          )}
          <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="text-[15px] sm:text-base text-gray-500/90 dark:text-gray-400/90 font-medium">
          Manage your AI-powered projects with real-time insights.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm shadow-blue-600/20 active:translate-y-0">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Project
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 hover:-translate-y-0.5 dark:hover:bg-white/5 transition-all shadow-sm active:translate-y-0">
          <Layout className="w-4 h-4" strokeWidth={2} />
          View Projects
        </button>
      </div>
    </div>
  );
};

export default WelcomeHero;
