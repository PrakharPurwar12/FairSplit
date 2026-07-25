import React from 'react';
import { FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectOverview = ({ projects = [], tasks = [], membersDict = {}, isLoading = false }) => {
  const navigate = useNavigate();

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(t => t.project === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(t => t.status === 'completed');
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };

  const getInitials = (username) => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-[#111111]/80 border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Project Overview</h3>
          <div className="h-8 w-24 bg-gray-100/80 dark:bg-white/5 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100/80 dark:bg-white/5 animate-pulse shrink-0 border border-gray-50 dark:border-white/5"></div>
                      <div className="h-4 w-32 bg-gray-100/80 dark:bg-white/5 rounded-md animate-pulse"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-gray-100/80 dark:bg-white/5 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-28 bg-gray-100/80 dark:bg-white/5 rounded-full animate-pulse overflow-hidden"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="w-7 h-7 rounded-full bg-gray-200/80 dark:bg-white/10 border-2 border-white dark:border-[#111111] animate-pulse"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#111111]/80 border border-gray-200/60 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">Project Overview</h3>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors"
        >
          View All Projects
        </button>
      </div>

      <div className="flex-1 p-0 overflow-x-auto">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">
            No projects found in this workspace.
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {projects.map((project) => {
                const progress = getProjectProgress(project.id);
                const members = membersDict[project.id] || [];
                
                return (
                  <tr 
                    key={project.id} 
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug">
                            {project.title}
                          </span>
                          <span className="block text-[10px] text-gray-400 dark:text-gray-500">
                            Due {formatDate(project.end_date)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                        project.status === 'completed'
                          ? 'bg-green-50 text-green-700 border-green-200/50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                          : project.status === 'active'
                            ? 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200/50 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden shrink-0">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                          {progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {members.length === 0 ? (
                        <span className="text-[10px] text-gray-400">1 (Manager)</span>
                      ) : (
                        <div className="flex -space-x-2">
                          {members.slice(0, 3).map((member) => (
                            <div 
                              key={member.id} 
                              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#111111] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 overflow-hidden"
                              title={`@${member.username} (${member.role})`}
                            >
                              {getInitials(member.username)}
                            </div>
                          ))}
                          {members.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white dark:border-[#111111] flex items-center justify-center text-[9px] font-bold text-white">
                              +{members.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectOverview;
