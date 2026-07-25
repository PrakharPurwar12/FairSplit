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
  X
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { Link } from 'react-router-dom';

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
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className={`flex items-center gap-2 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl leading-none">F</span>
            </div>
            <span className={`font-bold text-xl text-gray-900 dark:text-white truncate transition-opacity duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
              FairSplit
            </span>
          </Link>
          
          {/* Mobile close button */}
          <button 
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Desktop Collapse button */}
        <div className="hidden lg:flex items-center justify-end p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors w-full flex justify-center"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
