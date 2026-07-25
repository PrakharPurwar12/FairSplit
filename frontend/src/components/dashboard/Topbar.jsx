import React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';
import ProjectSwitcher from './ProjectSwitcher';
import NotificationButton from './NotificationButton';
import UserMenu from './UserMenu';
import ThemeToggle from '../common/ThemeToggle';
import { useLocation } from 'react-router-dom';

const Topbar = ({ toggleMobileSidebar, selectedProjectId, onProjectSelect }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPath = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'Dashboard';
  
  return (
    <header className="flex-shrink-0 h-14 border-b border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        
        {/* Left section: Title & Breadcrumb */}
        <div className="flex items-center min-w-[200px]">
          <button
            onClick={toggleMobileSidebar}
            className="p-1.5 -ml-1.5 mr-3 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:flex items-center text-[13px] font-medium text-gray-500 dark:text-gray-400">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 mx-1" />
            <span className="text-gray-900 dark:text-gray-100 capitalize">
              {currentPath}
            </span>
          </div>
          
          {/* Mobile title */}
          <span className="sm:hidden font-semibold text-sm capitalize text-gray-900 dark:text-gray-100">
            {currentPath}
          </span>
        </div>

        {/* Center section: Search */}
        <div className="flex-1 flex justify-center max-w-2xl px-4">
          <SearchBar />
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-[200px] justify-end">
          <ProjectSwitcher 
            selectedProjectId={selectedProjectId}
            onProjectSelect={onProjectSelect}
          />
          <div className="hidden sm:block w-px h-4 bg-gray-200 dark:bg-white/10 mx-1"></div>
          <ThemeToggle />
          <NotificationButton />
          <UserMenu />
        </div>
        
      </div>
    </header>
  );
};

export default Topbar;
