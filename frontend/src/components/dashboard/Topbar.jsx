import React from 'react';
import { Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import ProjectSwitcher from './ProjectSwitcher';
import NotificationButton from './NotificationButton';
import UserMenu from './UserMenu';
import ThemeToggle from '../common/ThemeToggle';

const Topbar = ({ toggleMobileSidebar, selectedProjectId, onProjectSelect }) => {
  return (
    <header className="flex-shrink-0 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        
        {/* Left section */}
        <div className="flex items-center">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 -ml-2 mr-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <SearchBar />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <ProjectSwitcher 
            selectedProjectId={selectedProjectId}
            onProjectSelect={onProjectSelect}
          />
          <div className="hidden sm:block border-l border-gray-200 dark:border-gray-700 h-6"></div>
          <ThemeToggle />
          <NotificationButton />
          <UserMenu />
        </div>
        
      </div>
    </header>
  );
};

export default Topbar;
