import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../../services/project.service';

const ProjectSwitcher = ({ selectedProjectId, onProjectSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const selectedProjectIdRef = useRef(selectedProjectId);
  const onProjectSelectRef = useRef(onProjectSelect);

  // Keep refs up-to-date to avoid stale closures in mount effect
  useEffect(() => {
    selectedProjectIdRef.current = selectedProjectId;
    onProjectSelectRef.current = onProjectSelect;
  }, [selectedProjectId, onProjectSelect]);

  useEffect(() => {
    let active = true;
    const fetchProjects = async () => {
      try {
        const data = await ProjectService.getProjects();
        if (active) {
          setProjects(data);
          
          if (data.length > 0) {
            const currentSel = selectedProjectIdRef.current;
            const exists = data.some(p => p.id.toString() === currentSel?.toString());
            if (!currentSel || !exists) {
              onProjectSelectRef.current(data[0].id.toString());
            }
          }
        }
      } catch (err) {
        console.error('Failed to load projects in switcher:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProject = projects.find(p => p.id.toString() === selectedProjectId?.toString());

  const handleCreateClick = () => {
    setIsOpen(false);
    navigate('/projects?create=true');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0 shadow-sm">
          <Box className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </div>
        <span className="text-[13px] font-medium text-gray-700 dark:text-gray-200 hidden sm:block truncate max-w-[120px]">
          {isLoading ? 'Loading...' : (selectedProject ? selectedProject.title : 'Select Project')}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 sm:left-0 mt-2 w-56 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 bg-white dark:bg-[#1A1A1A] border border-gray-200/60 dark:border-white/10 z-50 overflow-hidden"
          >
            <div className="p-1.5">
              <div className="px-2 py-1.5 mb-1">
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Personal Projects
                </span>
              </div>
              {isLoading ? (
                <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">Loading...</div>
              ) : projects.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">No projects found</div>
              ) : (
                projects.map((project) => {
                  const isSelected = project.id.toString() === selectedProjectId?.toString();
                  return (
                    <button
                      key={project.id}
                      onClick={() => {
                        onProjectSelect(project.id.toString());
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full text-left px-2 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${isSelected ? 'bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-900/50' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-white/10'}`}>
                          <Box className={`w-3 h-3 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <span className="truncate">{project.title}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })
              )}
            </div>
            <div className="border-t border-gray-100 dark:border-white/5 p-1.5">
              <button
                onClick={handleCreateClick}
                className="flex items-center w-full px-2 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5 transition-colors"
              >
                Create new project...
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSwitcher;
