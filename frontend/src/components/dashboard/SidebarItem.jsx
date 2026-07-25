import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 mb-2 rounded-lg transition-colors group ${
          isActive
            ? 'bg-blue-600 text-white dark:bg-blue-600'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        } ${isCollapsed ? 'justify-center' : 'justify-start'}`
      }
      title={isCollapsed ? label : ''}
    >
      <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;
