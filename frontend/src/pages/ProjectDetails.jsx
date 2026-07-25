import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';
import ProjectService from '../services/project.service';

const ProjectDetails = () => {
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add Member Form State
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('frontend');
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [memberError, setMemberError] = useState(null);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  const fetchProjectData = useCallback(async () => {
    await Promise.resolve(); // Defer state updates to avoid synchronous useEffect rendering issue
    setIsLoading(true);
    setError(null);
    try {
      // Parallel fetches for project details & members
      const [projectData, membersData] = await Promise.all([
        ProjectService.getProject(id),
        ProjectService.getProjectMembers(id)
      ]);
      setProject(projectData);
      setMembers(membersData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Project not found. It may have been deleted.');
      } else {
        setError('Failed to load project details. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjectData();
  }, [fetchProjectData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setMemberError('User ID is required.');
      return;
    }

    setIsSubmittingMember(true);
    setMemberError(null);

    try {
      const newMember = await ProjectService.addProjectMember(id, {
        user: parseInt(userId, 10),
        role
      });
      
      setMembers([...members, newMember]);
      setUserId('');
      setRole('frontend');
      showToast('Member added successfully!');
    } catch (err) {
      setMemberError(err.response?.data?.detail || err.response?.data?.error || 'Failed to add member. Make sure the User ID is valid and not already in the project.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    const confirmRemove = window.confirm('Are you sure you want to remove this member from the project?');
    if (!confirmRemove) return;

    const previousMembers = [...members];
    // Optimistic UI update
    setMembers(members.filter(m => m.id !== memberId));

    try {
      await ProjectService.deleteProjectMember(memberId);
      showToast('Member removed from project.');
    } catch (err) {
      // Rollback on failure
      setMembers(previousMembers);
      showToast('Failed to remove member. Restoring data.', 'error');
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (username) => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-md"></div>
        <div className="border-b border-gray-100 dark:border-white/5 pb-5">
          <div className="h-8 w-1/3 bg-gray-200 dark:bg-white/10 rounded-md mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            <div className="h-48 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">The project details page could not be displayed. You can go back to view all projects.</p>
        <Link 
          to="/projects"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

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

      {/* Back navigation */}
      <div>
        <Link 
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </div>

      {/* Project Banner Title Card */}
      <div className="border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{project?.title}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                project?.status === 'completed'
                  ? 'bg-green-50 text-green-700 border-green-200/50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                  : project?.status === 'active'
                    ? 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200/50 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
              }`}>
                {project?.status?.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-3">
              <span>Manager: <strong className="text-gray-700 dark:text-gray-300">{project?.manager_name}</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Project Overview</h3>
            <p className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {project?.description || 'No description provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="block font-medium text-[10px] uppercase text-gray-400">Timeline</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(project?.start_date)} – {formatDate(project?.end_date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="block font-medium text-[10px] uppercase text-gray-400">Last Modified</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatDate(project?.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right pane: Members Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Members List */}
          <div className="bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Members ({members.length})
              </h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {members.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
                  No members added to this project yet.
                </div>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 overflow-hidden">
                        {getInitials(member.username)}
                      </div>
                      <div>
                        <span className="block text-[13px] font-semibold text-gray-800 dark:text-gray-200">@{member.username}</span>
                        <span className="block text-[10px] text-gray-400 dark:text-gray-500 capitalize">{member.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1 rounded-md text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Member Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </h4>

              <form onSubmit={handleAddMember} className="space-y-3">
                {memberError && (
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] rounded-lg border border-red-200 dark:border-red-900/50 leading-tight">
                    {memberError}
                  </div>
                )}
                
                <div>
                  <input
                    type="number"
                    placeholder="User Numeric ID (e.g. 2)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-transparent border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-lg text-xs outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="ml">Machine Learning</option>
                    <option value="tester">Tester</option>
                    <option value="designer">Designer</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isSubmittingMember}
                    className="px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;
