import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('1'); // Default project ID

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        toggleMobileSidebar={toggleMobileSidebar}
        toggleCollapse={toggleCollapse}
      />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Topbar 
          toggleMobileSidebar={toggleMobileSidebar}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* The Outlet passes current selected project to child routes if needed via outlet context */}
            <Outlet context={{ selectedProjectId }} />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
