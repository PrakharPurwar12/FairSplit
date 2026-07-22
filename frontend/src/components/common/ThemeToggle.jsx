import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-primary focus:ring-offset-2`}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <motion.div
        className={`absolute left-[3px] flex h-[26px] w-[26px] items-center justify-center rounded-full shadow-sm bg-white dark:bg-background border border-gray-100 dark:border-transparent`}
        initial={false}
        animate={{
          x: isDark ? 20 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-indigo-400 dark:text-primary-brand" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
