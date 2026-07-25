import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center h-10 px-3 mb-1 rounded-md transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50'
        } ${isCollapsed ? 'justify-center' : 'justify-start'}`
      }
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {/* Active Background Glow */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-pill"
              className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-md"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          <div className="relative flex items-center w-full z-10">
            <Icon 
              className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
              } ${isCollapsed ? '' : 'mr-3'}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 0 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden tracking-tight"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
