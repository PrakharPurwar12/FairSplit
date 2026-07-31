import React from 'react';
import { FolderKanban, CheckSquare, Users, AlertTriangle } from 'lucide-react';
import OverviewCard from './OverviewCard';

const OverviewGrid = ({ 
  activeProjects = 0, 
  totalTasks = 0, 
  totalMembers = 0, 
  highRiskTasks = 0, 
  isLoading = true 
}) => {
  const cards = [
    { title: 'Active Projects', icon: FolderKanban, value: activeProjects, trend: 'Currently active', path: '/projects' },
    { title: 'Total Tasks', icon: CheckSquare, value: totalTasks, trend: 'In workspace', path: '/tasks' },
    { title: 'Team Members', icon: Users, value: totalMembers, trend: 'Across projects', path: '/teams' },
    { title: 'High Risk Tasks', icon: AlertTriangle, value: highRiskTasks, trend: 'AI risk flagged', path: '/prediction' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {cards.map((card, index) => (
        <OverviewCard 
          key={index} 
          title={card.title} 
          value={card.value}
          trend={card.trend}
          icon={card.icon}
          path={card.path} 
          isLoading={isLoading} 
        />
      ))}
    </div>
  );
};

export default OverviewGrid;
