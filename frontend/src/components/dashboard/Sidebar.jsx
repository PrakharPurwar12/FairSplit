import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Cpu, 
  BarChart2, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: FolderKanban, label: 'Projects', to: '/projects' },
  { icon: CheckSquare, label: 'Tasks', to: '/tasks' },
  { icon: Users, label: 'Teams', to: '/teams' },
  { icon: Cpu, label: 'AI Allocation', to: '/ai-allocation' },
  { icon: BarChart2, label: 'Analytics', to: '/analytics' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

const Sidebar = ({ isMobileOpen, isCollapsed, toggleMobileSidebar, toggleCollapse }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#FAFAFA] dark:bg-[#111111] border-r border-gray-200/70 dark:border-white/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'} w-[280px]`}
      >
        {/* Logo area */}
        <div className="flex flex-col pt-6 pb-2 px-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-[15px] leading-tight tracking-tight text-gray-900 dark:text-white transition-opacity duration-300">
                    FairSplit
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-0.5">
                    AI Project Management
                  </span>
                </div>
              )}
            </Link>
            
            {/* Mobile close button */}
            <button 
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto pt-6 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="px-3 mb-2">
            {!isCollapsed && <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menu</span>}
          </div>
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* User Footer Area */}
        <div className="p-3 mt-auto">
          <div className={`p-2 rounded-xl border border-gray-200/60 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-sm transition-all duration-300 ${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-inner">
                JD
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#111111] rounded-full"></div>
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">John Doe</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Product Designer</span>
              </div>
            )}
            
            {!isCollapsed && (
              <Link to="/settings" className="p-1.5 shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors">
                <Settings size={16} />
              </Link>
            )}
          </div>

          {/* Desktop Collapse button */}
          <div className="hidden lg:flex items-center justify-end mt-2">
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
