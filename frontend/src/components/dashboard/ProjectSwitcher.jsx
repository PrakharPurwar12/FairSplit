import React, { useState } from 'react';
import { ChevronDown, Folder } from 'lucide-react';

// Mock projects for foundation
const mockProjects = [
  { id: '1', name: 'Alpha Project' },
  { id: '2', name: 'Beta Deployment' },
  { id: '3', name: 'Gamma Optimization' },
];

const ProjectSwitcher = ({ selectedProjectId, onProjectSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedProject = mockProjects.find(p => p.id === selectedProjectId) || mockProjects[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
      >
        <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
          {selectedProject ? selectedProject.name : 'Select Project'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 sm:left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 overflow-hidden">
            <div className="py-1">
              {mockProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectSelect(project.id);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    project.id === selectedProjectId
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSwitcher;
