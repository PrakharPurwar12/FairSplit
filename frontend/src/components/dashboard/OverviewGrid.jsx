import React from 'react';
import { FolderKanban, CheckSquare, Users, AlertTriangle } from 'lucide-react';
import OverviewCard from './OverviewCard';

const OverviewGrid = ({ isLoading = true }) => {
  const cards = [
    { title: 'Active Projects', icon: FolderKanban },
    { title: 'Tasks', icon: CheckSquare },
    { title: 'Team Members', icon: Users },
    { title: 'High Risk Tasks', icon: AlertTriangle },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">
      {cards.map((card, index) => (
        <OverviewCard 
          key={index} 
          title={card.title} 
          icon={card.icon} 
          isLoading={isLoading} 
        />
      ))}
    </div>
  );
};

export default OverviewGrid;
