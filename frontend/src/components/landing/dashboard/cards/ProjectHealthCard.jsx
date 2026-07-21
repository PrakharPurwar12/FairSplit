import { ShieldAlert } from 'lucide-react';
import { ProgressRing } from '../../../ui/ProgressRing';

export const ProjectHealthCard = ({ health }) => (
  <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Project Health</p>
    <div className="flex items-center justify-between">
      <ProgressRing percentage={health.progress} />
      <div className="text-right">
        <p className="text-xs font-bold text-rose-500 flex items-center gap-1 justify-end">
          <ShieldAlert size={14} /> {health.riskLevel}
        </p>
        <p className="text-[10px] text-gray-500 mt-1 font-medium">{health.deadlineStatus}</p>
      </div>
    </div>
  </div>
);
