import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('1'); 

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden font-sans selection:bg-blue-500/30">
      
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        isCollapsed={isSidebarCollapsed}
        toggleMobileSidebar={toggleMobileSidebar}
        toggleCollapse={toggleCollapse}
      />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
        <Topbar 
          toggleMobileSidebar={toggleMobileSidebar}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-8 pb-12 px-4 sm:px-8 lg:px-12 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="mx-auto max-w-6xl w-full h-full">
            <Outlet context={{ selectedProjectId }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
