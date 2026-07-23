import React from 'react';
import { motion } from 'framer-motion';

const SocialButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <motion.button
        type="button"
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 flex items-center justify-center gap-3 bg-white dark:bg-[#1C1C1E] border border-border hover:border-gray-300 dark:hover:border-gray-600 text-text font-medium py-3 px-4 rounded-xl transition-colors shadow-sm hover:shadow-md"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-sm">Google</span>
      </motion.button>
      
      <motion.button
        type="button"
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="flex-1 flex items-center justify-center gap-3 bg-white dark:bg-[#1C1C1E] border border-border hover:border-gray-300 dark:hover:border-gray-600 text-text font-medium py-3 px-4 rounded-xl transition-colors shadow-sm hover:shadow-md"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.23.73-.52v-1.84c-3.03.66-3.67-1.46-3.67-1.46-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.58 1.2 3.2.92.1-.71.38-1.2.69-1.48-2.42-.28-4.96-1.2-4.96-5.38 0-1.19.42-2.16 1.12-2.92-.11-.27-.49-1.38.11-2.88 0 0 .91-.29 2.99 1.12a10.3 10.3 0 012.72-.36c.92.01 1.86.13 2.72.36 2.08-1.41 2.99-1.12 2.99-1.12.6 1.5.22 2.61.11 2.88.7.76 1.12 1.73 1.12 2.92 0 4.19-2.55 5.09-4.98 5.37.39.34.74 1.01.74 2.03v3.01c0 .29.18.62.74.52A11 11 0 0012 1.27z"/>
        </svg>
        <span className="text-sm">GitHub</span>
      </motion.button>
    </div>
  );
};

export default SocialButtons;
