import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import TaskService from '../services/task.service';
import ProjectService from '../services/project.service';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, updated, priority

  // Modals & Form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form inputs
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('todo');
  
  // Progress inputs
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [actualHours, setActualHours] = useState('');

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchInitialData = useCallback(async () => {
    await Promise.resolve(); // Defer state updates to satisfy eslint rule
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData] = await Promise.all([
        TaskService.getTasks(),
        ProjectService.getProjects()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load tasks and projects. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInitialData();
  }, [fetchInitialData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // CREATE TASK
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!projectId || !title.trim() || !estimatedHours || !deadline) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await TaskService.createTask({
        project: parseInt(projectId, 10),
        title,
        description,
        estimated_hours: parseFloat(estimatedHours).toFixed(2),
        difficulty: parseInt(difficulty, 10),
        priority,
        deadline,
        status
      });

      showToast('Task created successfully!');
      setIsCreateOpen(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      setFormError(err.response?.data?.detail || err.response?.data?.error || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT TASK
  const openEditModal = (task) => {
    setSelectedTask(task);
    setProjectId(task.project.toString());
    setTitle(task.title);
    setDescription(task.description || '');
    setEstimatedHours(parseFloat(task.estimated_hours).toString());
    setDifficulty(task.difficulty);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setStatus(task.status);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!projectId || !title.trim() || !estimatedHours || !deadline) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // PATCH changed fields only
    const patchedFields = {};
    if (parseInt(projectId, 10) !== selectedTask.project) patchedFields.project = parseInt(projectId, 10);
    if (title !== selectedTask.title) patchedFields.title = title;
    if (description !== selectedTask.description) patchedFields.description = description;
    if (parseFloat(estimatedHours).toFixed(2) !== parseFloat(selectedTask.estimated_hours).toFixed(2)) {
      patchedFields.estimated_hours = parseFloat(estimatedHours).toFixed(2);
    }
    if (parseInt(difficulty, 10) !== selectedTask.difficulty) patchedFields.difficulty = parseInt(difficulty, 10);
    if (priority !== selectedTask.priority) patchedFields.priority = priority;
    if (deadline !== selectedTask.deadline) patchedFields.deadline = deadline;
    if (status !== selectedTask.status) patchedFields.status = status;

    if (Object.keys(patchedFields).length === 0) {
      setIsEditOpen(false);
      resetForm();
      return;
    }

    try {
      await TaskService.updateTask(selectedTask.id, patchedFields);
      showToast('Task updated successfully!');
      setIsEditOpen(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      setFormError(err.response?.data?.detail || err.response?.data?.error || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PROGRESS UPDATE
  const openProgressModal = (task) => {
    setSelectedTask(task);
    setCompletionPercentage(task.completion_percentage);
    setActualHours(parseFloat(task.actual_hours || 0).toString());
    setIsProgressOpen(true);
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await TaskService.updateProgress(selectedTask.id, {
        completion_percentage: parseInt(completionPercentage, 10),
        actual_hours: parseFloat(actualHours || 0).toFixed(2)
      });

      showToast('Progress updated successfully!');
      setIsProgressOpen(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.detail || 'Failed to update progress. Note: tasks must be AI-allocated before updating progress.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE TASK
  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    const previousTasks = [...tasks];
    // Optimistic UI update
    setTasks(tasks.filter(t => t.id !== taskId));

    try {
      await TaskService.deleteTask(taskId);
      showToast('Task deleted successfully.');
    } catch (err) {
      // Rollback
      setTasks(previousTasks);
      showToast('Failed to delete task. Restoring data.', 'error');
      console.error(err);
    }
  };

  const resetForm = () => {
    setProjectId('');
    setTitle('');
    setDescription('');
    setEstimatedHours('');
    setDifficulty(3);
    setPriority('medium');
    setDeadline('');
    setStatus('todo');
    setCompletionPercentage(0);
    setActualHours('');
    setFormError(null);
    setSelectedTask(null);
  };

  // Memoized client-side Search, Filtering & Sorting
  const processedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch = 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesProject = projectFilter === 'all' || task.project.toString() === projectFilter;
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesProject && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortBy === 'updated') {
          return new Date(b.updated_at) - new Date(a.updated_at);
        } else if (sortBy === 'priority') {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return 0;
      });
  }, [tasks, searchQuery, projectFilter, statusFilter, priorityFilter, sortBy]);

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
      {/* Toast System */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project workloads and log progress updates.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm shadow-blue-600/10"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Search, Filter, Sort Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-6 items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
        {/* Search */}
        <div className="relative xl:col-span-2 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        {/* Project Filter */}
        <div className="w-full">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id.toString()}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-full">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="w-full">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="updated">Recently Updated</option>
            <option value="priority">Priority (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 rounded-2xl border border-gray-200 dark:border-white/5 p-5 animate-pulse bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-white/10 rounded-md mb-2"></div>
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{error}</h3>
          <button 
            onClick={fetchInitialData}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-xl text-sm font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
          >
            Retry
          </button>
        </div>
      ) : processedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">No tasks found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery || projectFilter !== 'all' || statusFilter !== 'all'
              ? "We couldn't find any tasks matching your filters."
              : "Get started by generating your project task allocation."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {processedTasks.map((task) => (
            <div 
              key={task.id}
              className="group p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 shadow-sm transition-all duration-200 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                  <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {task.project_name}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className={`px-2 py-0.5 rounded-full border capitalize ${
                    task.priority === 'high' 
                      ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                      : task.priority === 'medium'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
                        : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Difficulty: {task.difficulty}/5
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => { setSelectedTask(task); setIsDetailsOpen(true); }}
                  className="text-base font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-2xl">
                  {task.description || 'No description provided.'}
                </p>

                {/* Dates & Assignment */}
                <div className="flex flex-wrap items-center gap-4 pt-1.5 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {formatDate(task.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: {parseFloat(task.estimated_hours).toFixed(1)} hrs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Logged: {parseFloat(task.actual_hours).toFixed(1)} hrs</span>
                  </div>
                  {task.predicted_risk !== 'Unknown' && (
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" />
                      <span className={`font-semibold ${
                        task.predicted_risk === 'High' 
                          ? 'text-red-500' 
                          : task.predicted_risk === 'Medium' 
                            ? 'text-yellow-500' 
                            : 'text-green-500'
                      }`}>
                        AI Risk: {task.predicted_risk}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Actions Controls */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-100 dark:border-white/5 pt-4 md:pt-0 shrink-0">
                {/* Progress bar info */}
                <div className="flex flex-col gap-1 w-32">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-gray-400 uppercase tracking-wider capitalize">
                      {task.status === 'completed' ? 'Completed' : task.status === 'progress' ? 'In Progress' : task.status === 'review' ? 'In Review' : 'To Do'}
                    </span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{task.completion_percentage}%</span>
                  </div>
                  <div 
                    onClick={() => openProgressModal(task)}
                    className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all"
                    title="Click to update task progress"
                  >
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        task.status === 'completed' 
                          ? 'bg-green-500' 
                          : task.status === 'progress' 
                            ? 'bg-blue-500' 
                            : 'bg-yellow-500'
                      }`}
                      style={{ width: `${task.completion_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Crud dropdown icons */}
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={() => openEditModal(task)}
                    className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Create Task">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Associated Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id.toString()}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design Landing Hero Section"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Description</label>
            <textarea
              placeholder="Detail required skills, criteria, guidelines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Estimated Hours *</label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="e.g. 8.0"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Deadline *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Difficulty (1-5)</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}/5</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => { setIsCreateOpen(false); resetForm(); }}
              className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit Task">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Associated Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id.toString()}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Estimated Hours *</label>
              <input
                type="number"
                step="0.5"
                required
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Deadline *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Difficulty (1-5)</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}/5</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => { setIsEditOpen(false); resetForm(); }}
              className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* PROGRESS MODAL */}
      <Modal isOpen={isProgressOpen} onClose={() => { setIsProgressOpen(false); resetForm(); }} title="Update Progress">
        <form onSubmit={handleProgressSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Completion Percentage ({completionPercentage}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={completionPercentage}
              onChange={(e) => setCompletionPercentage(e.target.value)}
              className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Actual Hours Logged (Total)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 5.5"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => { setIsProgressOpen(false); resetForm(); }}
              className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Progress'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS MODAL */}
      <Modal isOpen={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); resetForm(); }} title="Task Details">
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                {selectedTask.project_name}
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {selectedTask.title}
              </h2>
            </div>

            <div className="bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-200/50 dark:border-white/5 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Status</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{selectedTask.status}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Priority</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{selectedTask.priority}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Estimated Hours</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{parseFloat(selectedTask.estimated_hours).toFixed(1)} hrs</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Actual Hours Logged</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{parseFloat(selectedTask.actual_hours).toFixed(1)} hrs</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Difficulty</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedTask.difficulty}/5</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Due Date</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{formatDate(selectedTask.deadline)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-white/[0.01] p-3 rounded-xl border border-gray-100 dark:border-white/5 min-h-[80px] whitespace-pre-wrap">
                {selectedTask.description || 'No description provided.'}
              </p>
            </div>

            {selectedTask.predicted_risk !== 'Unknown' && (
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 dark:border-blue-950/30 dark:bg-blue-950/10 space-y-1">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  AI Risk Prediction: {selectedTask.predicted_risk}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                  The machine learning model predicted task delivery risk is <strong>{selectedTask.predicted_risk}</strong> with a confidence score of <strong>{(selectedTask.risk_confidence * 100).toFixed(0)}%</strong>.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => { setIsDetailsOpen(false); resetForm(); }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tasks;
