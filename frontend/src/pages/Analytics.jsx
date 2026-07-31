import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  RefreshCw,
  FolderKanban
} from 'lucide-react';
import ProjectService from '../services/project.service';
import AnalyticsService from '../services/analytics.service';
import Toast from '../components/ui/Toast';

const Analytics = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [teamAnalytics, setTeamAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const context = useOutletContext();

  // Sync with DashboardLayout context project changes
  useEffect(() => {
    if (context?.selectedProjectId && context.selectedProjectId !== selectedProjectId) {
      setSelectedProjectId(context.selectedProjectId);
    }
  }, [context?.selectedProjectId, selectedProjectId]);

  // Fetch projects list
  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const data = await ProjectService.getProjects();
        if (isMounted) {
          setProjects(data);
          if (data.length > 0 && !selectedProjectId) {
            setSelectedProjectId(data[0].id.toString());
          } else if (data.length === 0) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Failed to load projects list:', err);
        if (isMounted) {
          setError('Failed to fetch projects.');
          setIsLoading(false);
        }
      }
    };
    loadProjects();
    return () => { isMounted = false; };
  }, [selectedProjectId]);

  // Fetch analytics for selected project
  const fetchAnalyticsData = useCallback(async () => {
    if (!selectedProjectId) {
      setIsLoading(false);
      return;
    }
    await Promise.resolve();
    setIsLoading(true);
    setError(null);

    try {
      const [dashRes, teamRes] = await Promise.all([
        AnalyticsService.getProjectDashboard(selectedProjectId).catch(() => null),
        AnalyticsService.getTeamAnalytics(selectedProjectId).catch(() => [])
      ]);

      setDashboardMetrics(dashRes);
      setTeamAnalytics(Array.isArray(teamRes) ? teamRes : (teamRes?.team || []));
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load project analytics data.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const riskDist = dashboardMetrics?.risk_distribution || { High: 0, Medium: 0, Low: 0 };
  const totalTasks = dashboardMetrics?.total_tasks || 0;
  const completedTasks = dashboardMetrics?.completed_tasks || 0;
  const inProgressTasks = dashboardMetrics?.in_progress_tasks || 0;
  const todoTasks = dashboardMetrics?.todo_tasks || 0;
  const reviewTasks = dashboardMetrics?.review_tasks || 0;
  const completionPercentage = dashboardMetrics?.completion_percentage || 0;

  return (
    <div className="space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time task velocity, ML risk distribution, and team workload analytics.</p>
        </div>

        {/* Project Selector & Refresh */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 transition-all"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id.toString()}>{p.title}</option>
            ))}
          </select>

          <button
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-28 rounded-2xl border border-gray-200 dark:border-white/5 p-5 animate-pulse bg-gray-50/50 dark:bg-white/[0.02]"></div>
            ))}
          </div>
          <div className="h-64 rounded-2xl border border-gray-200 dark:border-white/5 p-5 animate-pulse bg-gray-50/50 dark:bg-white/[0.02]"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{error}</h3>
        </div>
      ) : (
        <>
          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completion Rate</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{completionPercentage}%</p>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</span>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
                  <FolderKanban className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalTasks}</p>
              <span className="text-[11px] text-gray-400 mt-1 block">{completedTasks} Completed • {inProgressTasks} In Progress</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">High Risk Items</span>
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{riskDist.High || 0}</p>
              <span className="text-[11px] text-gray-400 mt-1 block">{riskDist.Medium || 0} Medium Risk • {riskDist.Low || 0} Low Risk</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team Capacity</span>
                <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{teamAnalytics.length} Members</p>
              <span className="text-[11px] text-gray-400 mt-1 block">Active team workload balanced</span>
            </div>
          </div>

          {/* Visual Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution Chart */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  AI Risk Prediction Distribution
                </h3>
                <span className="text-xs font-semibold text-gray-400">ML Model Evaluated</span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-red-600 dark:text-red-400">High Risk Tasks</span>
                    <span className="text-gray-700 dark:text-gray-300">{riskDist.High || 0}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-500" 
                      style={{ width: `${totalTasks ? ((riskDist.High || 0) / totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-yellow-600 dark:text-yellow-400">Medium Risk Tasks</span>
                    <span className="text-gray-700 dark:text-gray-300">{riskDist.Medium || 0}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500" 
                      style={{ width: `${totalTasks ? ((riskDist.Medium || 0) / totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-green-600 dark:text-green-400">Low Risk Tasks</span>
                    <span className="text-gray-700 dark:text-gray-300">{riskDist.Low || 0}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500" 
                      style={{ width: `${totalTasks ? ((riskDist.Low || 0) / totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Status Breakdown */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-500" />
                  Task Lifecycle Status
                </h3>
                <span className="text-xs font-semibold text-gray-400">Real-Time Sync</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-1">To Do</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{todoTasks}</span>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20">
                  <span className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold block mb-1">In Progress</span>
                  <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{inProgressTasks}</span>
                </div>

                <div className="p-4 rounded-xl bg-yellow-50/50 dark:bg-yellow-950/10 border border-yellow-100 dark:border-yellow-900/20">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 uppercase tracking-wider font-semibold block mb-1">Review</span>
                  <span className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{reviewTasks}</span>
                </div>

                <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/20">
                  <span className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider font-semibold block mb-1">Completed</span>
                  <span className="text-xl font-bold text-green-700 dark:text-green-300">{completedTasks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Workload Analytics */}
          {teamAnalytics.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Team Member Performance & Workload</h3>
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {teamAnalytics.map(member => (
                  <div key={member.member_id || member.username} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center">
                        {(member.username || 'M').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">@{member.username}</span>
                        <span className="text-gray-400 text-[11px]">{member.role || 'Developer'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-gray-400 block">Assigned Tasks</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{member.assigned_tasks_count || member.active_tasks || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
