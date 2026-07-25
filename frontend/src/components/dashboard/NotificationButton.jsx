import React from 'react';
import { Bell } from 'lucide-react';

const NotificationButton = () => {
  return (
    <button className="relative p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
      <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#111111]" />
    </button>
  );
};

export default NotificationButton;
