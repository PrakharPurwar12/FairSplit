import React, { useState, useEffect } from 'react';
import { Plus, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDynamicGreeting } from '../../utils/greeting';

const WelcomeHero = ({ userName, isLoading = true }) => {
  const [greetingInfo, setGreetingInfo] = useState(getDynamicGreeting());
  const navigate = useNavigate();

  // Optional: update greeting if the component stays mounted across hour boundaries
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingInfo(getDynamicGreeting());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const formattedName = typeof userName === 'string' ? userName.trim() : '';
  const greetingText = formattedName ? `${greetingInfo.text}, ${formattedName}` : greetingInfo.text;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          {isLoading ? (
            <>
              <span>{greetingInfo.text}</span>
              <div className="h-9 w-36 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
            </>
          ) : (
            <span>{greetingText}</span>
          )}
          <span className="inline-block animate-wave origin-bottom-right">{greetingInfo.emoji}</span>
        </h1>
        <p className="text-[15px] sm:text-base text-gray-500/90 dark:text-gray-400/90 font-medium">
          {greetingInfo.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button 
          onClick={() => navigate('/projects?create=true')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm shadow-blue-600/20 active:translate-y-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Project
        </button>
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 hover:-translate-y-0.5 dark:hover:bg-white/5 transition-all shadow-sm active:translate-y-0 cursor-pointer"
        >
          <Layout className="w-4 h-4" strokeWidth={2} />
          View Projects
        </button>
      </div>
    </div>
  );
};

export default WelcomeHero;
