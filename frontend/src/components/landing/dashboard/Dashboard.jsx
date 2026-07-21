import { Card } from '../../ui/Card';
import { DashboardHeader } from './DashboardHeader';
import { DashboardGrid } from './DashboardGrid';
import { RecommendationCard } from './cards/RecommendationCard';
import { ActivityCard } from './cards/ActivityCard';
import { dashboardData } from '../../../data/dashboardData';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  return (
    <div className="relative w-full hidden lg:flex justify-end perspective-1000">
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-[550px] xl:max-w-[620px]"
      >
        <Card className="w-full h-full relative z-20 border-white/60">
          <DashboardHeader header={dashboardData.projectHeader} />
          <DashboardGrid 
            projectHealth={dashboardData.projectHealth}
            teamBalance={dashboardData.teamBalance}
            workload={dashboardData.workload}
          />
          <RecommendationCard recommendation={dashboardData.recommendation} />
          <ActivityCard activities={dashboardData.activities} />
        </Card>
      </motion.div>
    </div>
  );
};
