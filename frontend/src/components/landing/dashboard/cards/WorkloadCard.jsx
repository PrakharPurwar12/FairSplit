import { ProgressBar } from '../../../ui/ProgressBar';

export const WorkloadCard = ({ workloadData }) => (
  <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm h-full flex flex-col">
    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
      <span>Workload</span>
      <span>Cap</span>
    </div>
    <div className="space-y-4 flex-1 flex flex-col justify-center">
      {workloadData.map((data, index) => (
        <ProgressBar
          key={index}
          label={data.name}
          percentage={data.value}
          colorClass={data.colorClass}
          textClass={data.textClass}
        />
      ))}
    </div>
  </div>
);
