import React from 'react';
import { Bell } from 'lucide-react';

const NotificationButton = () => {
  return (
    <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors">
      <Bell className="w-5 h-5" />
      <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
    </button>
  );
};

export default NotificationButton;
