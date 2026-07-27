import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  FolderKanban, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Mail
} from 'lucide-react';
import ProjectService from '../services/project.service';
import UserService from '../services/user.service';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const Teams = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [members, setMembers] = useState([]);
  const [allSystemUsers, setAllSystemUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addProjectId, setAddProjectId] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [addRole, setAddRole] = useState('developer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchTeamData = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      const [projectsData, usersData] = await Promise.all([
        ProjectService.getProjects(),
        UserService.getUsers().catch(() => [])
      ]);
      setProjects(projectsData);
      setAllSystemUsers(usersData);

      let aggregatedMembers = [];
      if (selectedProjectId === 'all') {
        const memberPromises = projectsData.map(p => 
          ProjectService.getProjectMembers(p.id).then(mList => 
            mList.map(m => ({ ...m, projectName: p.title }))
          ).catch(() => [])
        );
        const results = await Promise.all(memberPromises);
        aggregatedMembers = results.flat();
      } else {
        const proj = projectsData.find(p => p.id.toString() === selectedProjectId);
        const mList = await ProjectService.getProjectMembers(selectedProjectId);
        aggregatedMembers = mList.map(m => ({ ...m, projectName: proj ? proj.title : 'Project' }));
      }
      setMembers(aggregatedMembers);
    } catch (err) {
      console.error('Error loading team members:', err);
      setError('Failed to load team members. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeamData();
  }, [fetchTeamData]);

  // Remove Member Handler
  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this project team?`)) return;
    try {
      await ProjectService.deleteProjectMember(memberId);
      showToast(`${memberName} removed from team.`);
      fetchTeamData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to remove member.', 'error');
    }
  };

  // Add Member Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addProjectId || !addUserId) {
      setFormError('Please select both a project and a user.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    try {
      await ProjectService.addProjectMember(addProjectId, {
        user: parseInt(addUserId, 10),
        role: addRole
      });
      showToast('Team member added successfully!');
      setIsAddModalOpen(false);
      setAddUserId('');
      fetchTeamData();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.detail || 'Failed to add member to project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Processed members with search & role filters
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const name = (m.username || '').toLowerCase();
      const email = (m.user_email || '').toLowerCase();
      const role = (m.role || '').toLowerCase();
      const project = (m.projectName || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || email.includes(query) || role.includes(query) || project.includes(query);
      const matchesRole = roleFilter === 'all' || role === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const uniqueRoles = useMemo(() => {
    const set = new Set(members.map(m => m.role).filter(Boolean));
    return Array.from(set);
  }, [members]);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Team Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project members, roles, skills, and team availability.</p>
        </div>
        <button
          onClick={() => {
            if (projects.length > 0) setAddProjectId(projects[0].id.toString());
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm shadow-blue-600/10"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Members</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{members.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Projects</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{projects.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Roles Active</span>
            <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{uniqueRoles.length || 1}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Users</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{allSystemUsers.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
        {/* Search Input */}
        <div className="relative md:col-span-2 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by member name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        {/* Project Filter */}
        <div className="w-full">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all capitalize"
          >
            <option value="all">All Project Teams</option>
            {projects.map(p => (
              <option key={p.id} value={p.id.toString()}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Role Filter */}
        <div className="w-full">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all capitalize"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-44 rounded-2xl border border-gray-200 dark:border-white/5 p-5 animate-pulse bg-gray-50/50 dark:bg-white/[0.02] flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-200 dark:bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{error}</h3>
          <button 
            onClick={fetchTeamData}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-xl text-sm font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">No team members found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery || roleFilter !== 'all' || selectedProjectId !== 'all'
              ? 'No team members matched your current filter criteria.'
              : 'Add members to your projects to start allocating tasks.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div 
              key={member.id}
              className="group p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                      {(member.username || 'M').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug truncate">
                        @{member.username}
                      </h3>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                        {member.role || 'Team Member'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(member.id, member.username)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    title="Remove from team"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate font-medium text-gray-700 dark:text-gray-300">
                      {member.projectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{member.user_email || 'No email registered'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Joined</span>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'Active Member'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setFormError(null); }} 
        title="Add Team Member to Project"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Select Project *</label>
            <select
              required
              value={addProjectId}
              onChange={(e) => setAddProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Choose a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id.toString()}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Select User *</label>
            <select
              required
              value={addUserId}
              onChange={(e) => setAddUserId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Choose a registered user...</option>
              {allSystemUsers.map(u => (
                <option key={u.id} value={u.id.toString()}>
                  @{u.username} ({u.email || 'No email'}) - {u.role || 'Member'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Team Role *</label>
            <select
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
            >
              <option value="developer">Developer</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Engineer</option>
              <option value="designer">UI/UX Designer</option>
              <option value="qa">QA / Tester</option>
              <option value="manager">Project Manager</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teams;
