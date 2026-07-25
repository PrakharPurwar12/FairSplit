import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UserMenu = ({ isLoading = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative ml-1" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2 dark:hover:ring-offset-[#111111] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
      >
        {isLoading ? (
          <div className="w-full h-full rounded-full animate-pulse bg-gray-200/80 dark:bg-white/10"></div>
        ) : (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">US</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 bg-white dark:bg-[#1A1A1A] border border-gray-200/60 dark:border-white/10 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-white">User Name</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">user@example.com</p>
                </>
              )}
            </div>
            <div className="p-1.5">
              <Link
                to="/profile"
                className="flex items-center px-2 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-[15px] h-[15px] mr-2 text-gray-400" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-2 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-[15px] h-[15px] mr-2 text-gray-400" />
                Settings
              </Link>
              <div className="border-t border-gray-100 dark:border-white/5 my-1.5 mx-1"></div>
              <button
                className="flex w-full items-center px-2 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="w-[15px] h-[15px] mr-2" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
