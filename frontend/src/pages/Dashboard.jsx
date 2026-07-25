import React from 'react';
import { motion } from 'framer-motion';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import OverviewGrid from '../components/dashboard/OverviewGrid';
import AIInsightCard from '../components/dashboard/AIInsightCard';
import ProjectOverviewSkeleton from '../components/dashboard/ProjectOverviewSkeleton';
import ActivitySkeleton from '../components/dashboard/ActivitySkeleton';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col h-full w-full max-w-7xl mx-auto space-y-8 pb-12"
    >
      <WelcomeHero 
        isLoading={isLoading} 
        userName={user?.first_name || user?.username} 
      />
      <OverviewGrid isLoading={true} />
      <AIInsightCard isLoading={true} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProjectOverviewSkeleton />
        </div>
        <div className="xl:col-span-1">
          <ActivitySkeleton />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
