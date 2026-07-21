import { ProjectHealthCard } from './cards/ProjectHealthCard';
import { TeamBalanceCard } from './cards/TeamBalanceCard';
import { WorkloadCard } from './cards/WorkloadCard';

export const DashboardGrid = ({ projectHealth, teamBalance, workload }) => (
  <div className="grid grid-cols-2 gap-5 mb-6">
    <div className="space-y-5">
      <ProjectHealthCard health={projectHealth} />
      <TeamBalanceCard teamBalance={teamBalance} />
    </div>
    <WorkloadCard workloadData={workload} />
  </div>
);
