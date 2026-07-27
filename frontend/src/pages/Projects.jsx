import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  FolderKanban, 
  Clock, 
  AlertCircle,
  X,
  Users,
  CheckSquare,
  UserCheck
} from 'lucide-react';
import ProjectService from '../services/project.service';
import TaskService from '../services/task.service';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated'); // name, updated, created
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('create') === 'true';
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('planning');
  const [formError, setFormError] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    await Promise.resolve(); // Defer state updates to satisfy eslint rule
    setIsLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        ProjectService.getProjects(),
        TaskService.getTasks().catch(() => [])
      ]);

      // Fetch member count for each project
      const memberPromises = projectsData.map(p => 
        ProjectService.getProjectMembers(p.id)
          .then(members => ({ projectId: p.id, count: members.length }))
          .catch(() => ({ projectId: p.id, count: 0 }))
      );
      const memberResults = await Promise.all(memberPromises);
      const memberCountMap = {};
      memberResults.forEach(m => { memberCountMap[m.projectId] = m.count; });

      // Aggregate task stats per project
      const taskStatsMap = {};
      (tasksData || []).forEach(task => {
        const pId = task.project;
        if (!taskStatsMap[pId]) {
          taskStatsMap[pId] = { total: 0, completed: 0 };
        }
        taskStatsMap[pId].total += 1;
        if (task.status === 'completed' || task.completion_percentage === 100) {
          taskStatsMap[pId].completed += 1;
        }
      });

      // Enhance project objects with real metrics
      const enhanced = projectsData.map(p => {
        const stats = taskStatsMap[p.id] || { total: 0, completed: 0 };
        const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        return {
          ...p,
          totalTasks: stats.total,
          completedTasks: stats.completed,
          progress: progress,
          memberCount: memberCountMap[p.id] || 0
        };
      });

      setProjects(enhanced);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
    
    // Clean query params if redirected with create=true
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      navigate('/projects', { replace: true });
    }
  }, [location, navigate, fetchProjects]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Create Project handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    setIsFormSubmitting(true);
    setFormError(null);
    
    try {
      await ProjectService.createProject({
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        status
      });
      
      showToast('Project created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.detail || err.response?.data?.error || 'Failed to create project.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Edit Project pre-fill and submission
  const openEditModal = (project, e) => {
    e.stopPropagation();
    setSelectedProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setStartDate(project.start_date);
    setEndDate(project.end_date);
    setStatus(project.status);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsFormSubmitting(true);
    setFormError(null);

    const patchedFields = {};
    if (title !== selectedProject.title) patchedFields.title = title;
    if (description !== selectedProject.description) patchedFields.description = description;
    if (startDate !== selectedProject.start_date) patchedFields.start_date = startDate;
    if (endDate !== selectedProject.end_date) patchedFields.end_date = endDate;
    if (status !== selectedProject.status) patchedFields.status = status;

    if (Object.keys(patchedFields).length === 0) {
      setIsEditModalOpen(false);
      resetForm();
      return;
    }

    try {
      await ProjectService.updateProject(selectedProject.id, patchedFields);
      showToast('Project updated successfully!');
      setIsEditModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.detail || err.response?.data?.error || 'Failed to update project.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Delete Project with confirmation dialog
  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirmDelete) return;

    const previousProjects = [...projects];
    setProjects(projects.filter(p => p.id !== projectId));

    try {
      await ProjectService.deleteProject(projectId);
      showToast('Project deleted successfully.');
    } catch (err) {
      setProjects(previousProjects);
      showToast('Failed to delete project. Restoring data.', 'error');
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('planning');
    setFormError(null);
    setSelectedProject(null);
  };

  // Memoized Search (title + description), Filter (status), and Sort
  const processedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          project.title.toLowerCase().includes(query) ||
          (project.description || '').toLowerCase().includes(query);
        
        const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'created') {
          return new Date(b.created_at) - new Date(a.created_at);
        } else {
          return new Date(b.updated_at) - new Date(a.updated_at);
        }
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 px-5 py-3 rounded-xl border shadow-lg z-[100] flex items-center gap-2 animate-bounce ${
          toast.type === 'error' 
            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50' 
            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your active workspace projects.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm shadow-blue-600/10"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Search, Filter, Sort Actions */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-40 px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort Selection */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-44 px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-semibold"
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-56 rounded-2xl border border-gray-200 dark:border-white/10 p-5 animate-pulse bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="h-5 w-2/3 bg-gray-200 dark:bg-white/10 rounded-md mb-4"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded-md mb-2"></div>
              <div className="h-3 w-4/5 bg-gray-200 dark:bg-white/10 rounded-md mb-6"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{error}</h3>
          <button 
            onClick={fetchProjects}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-xl text-sm font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
          >
            Retry
          </button>
        </div>
      ) : processedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/[0.02] flex items-center justify-center border border-gray-200 dark:border-white/10 mb-4">
            <FolderKanban className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">No projects found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? "We couldn't find any projects matching your current search filters."
              : "Get started by creating your first project to manage tasks."}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              Add Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div>
                {/* Status Badge & Actions */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
                    project.status === 'completed'
                      ? 'bg-green-50 text-green-700 border-green-200/50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                      : project.status === 'active'
                        ? 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200/50 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
                  }`}>
                    {project.status}
                  </span>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={(e) => openEditModal(project, e)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      title="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 min-h-[32px] leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>

                {/* Progress Bar & Percentage */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-semibold">Progress</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Real Meta Badges */}
                <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-white/5 text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-gray-400 flex items-center gap-1"><CheckSquare className="w-3 h-3 text-blue-500" /> Tasks</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 mt-0.5">{project.completedTasks}/{project.totalTasks}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 flex items-center gap-1"><Users className="w-3 h-3 text-purple-500" /> Members</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 mt-0.5">{project.memberCount}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-400 flex items-center gap-1"><UserCheck className="w-3 h-3 text-green-500" /> Manager</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 mt-0.5 truncate">@{project.manager_name || 'Admin'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom dates */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due: {formatDate(project.end_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(project.updated_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 relative">
            <button 
              onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create Project</h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
                  {formError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FairSplit Production Release"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Description</label>
                <textarea
                  placeholder="Summarize objectives, milestones, or scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors capitalize"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFormSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
                >
                  {isFormSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 relative">
            <button 
              onClick={() => { setIsEditModalOpen(false); resetForm(); }}
              className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Project</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
                  {formError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors capitalize"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFormSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
                >
                  {isFormSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
