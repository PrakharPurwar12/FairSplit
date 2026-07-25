import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="flex-1 max-w-xl hidden md:flex items-center px-4">
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search projects, tasks, or ask AI..."
          className="block w-full pl-9 pr-12 py-2 border border-gray-200/70 dark:border-white/10 rounded-lg leading-5 bg-gray-50/50 dark:bg-[#1A1A1A] text-[13px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all duration-200 shadow-sm shadow-black/5"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] px-1.5 text-[10px] font-medium text-gray-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
