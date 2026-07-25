import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import OverviewGrid from '../components/dashboard/OverviewGrid';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import ProjectOverview from '../components/dashboard/ProjectOverview';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TaskDistributionChart from '../components/dashboard/TaskDistributionChart';
import { useAuth } from '../context/AuthContext';
import ProjectService from '../services/project.service';
import TaskService from '../services/task.service';

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [membersDict, setMembersDict] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    await Promise.resolve(); // Defer state updates to avoid synchronous useEffect rendering issue
    setIsLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        ProjectService.getProjects(),
        TaskService.getTasks()
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData);

      // Fetch members for all projects in parallel
      const membersPromises = projectsData.map(p => 
        ProjectService.getProjectMembers(p.id)
          .then(members => ({ projectId: p.id, members }))
          .catch(() => ({ projectId: p.id, members: [] }))
      );
      
      const membersResults = await Promise.all(membersPromises);
      const dict = {};
      membersResults.forEach(res => {
        dict[res.projectId] = res.members;
      });
      setMembersDict(dict);
    } catch (err) {
      setError('Failed to load dashboard statistics. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived Metrics
  const activeProjectsCount = useMemo(() => {
    return projects.filter(p => p.status === 'active').length;
  }, [projects]);

  const highRiskTasksCount = useMemo(() => {
    return tasks.filter(t => t.predicted_risk === 'High').length;
  }, [tasks]);

  const uniqueMembersCount = useMemo(() => {
    const usernames = new Set();
    Object.values(membersDict).forEach(membersList => {
      membersList.forEach(m => usernames.add(m.username));
    });
    if (user?.username) usernames.add(user.username);
    return usernames.size;
  }, [membersDict, user]);

  // Derived Activities Feed
  const derivedActivities = useMemo(() => {
    const list = [];
    
    // 1. Projects Created
    projects.forEach(p => {
      list.push({
        type: 'project_created',
        title: 'Project Created',
        description: `Project "${p.title}" was registered in FairSplit.`,
        user: p.manager_name,
        time: p.created_at
      });
    });

    // 2. Tasks Created & Completed
    tasks.forEach(t => {
      list.push({
        type: 'task_created',
        title: 'Task Created',
        description: `Task "${t.title}" was added to project "${t.project_name}".`,
        user: t.created_by_name || 'user',
        time: t.created_at
      });

      if (t.status === 'completed') {
        list.push({
          type: 'task_completed',
          title: 'Task Completed',
          description: `Task "${t.title}" in project "${t.project_name}" was marked completed.`,
          user: t.created_by_name || 'user',
          time: t.updated_at
        });
      }
    });

    // 3. Members Added
    Object.keys(membersDict).forEach(projId => {
      const project = projects.find(p => p.id.toString() === projId.toString());
      if (project) {
        const members = membersDict[projId] || [];
        members.forEach(member => {
          list.push({
            type: 'member_added',
            title: 'Team Member Joined',
            description: `@${member.username} joined project "${project.title}" as a ${member.role}.`,
            user: member.username,
            time: member.joined_at
          });
        });
      }
    });

    // Sort newest first, top 10
    return list.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
  }, [projects, tasks, membersDict]);

  const dashboardLoading = isAuthLoading || isLoading;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5 max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">We encountered an issue fetching live project information.</p>
        <button 
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/10"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col h-full w-full max-w-7xl mx-auto space-y-8 pb-12"
    >
      <WelcomeHero 
        isLoading={dashboardLoading} 
        userName={user?.first_name || user?.username} 
      />

      <OverviewGrid 
        isLoading={dashboardLoading}
        activeProjects={activeProjectsCount}
        totalTasks={tasks.length}
        totalMembers={uniqueMembersCount}
        highRiskTasks={highRiskTasksCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIInsightCard isLoading={dashboardLoading} />
        </div>
        <div className="lg:col-span-1">
          <TaskDistributionChart 
            isLoading={dashboardLoading}
            tasks={tasks}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProjectOverview 
            isLoading={dashboardLoading}
            projects={projects}
            tasks={tasks}
            membersDict={membersDict}
          />
        </div>
        <div className="xl:col-span-1">
          <ActivityFeed 
            isLoading={dashboardLoading}
            activities={derivedActivities}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
