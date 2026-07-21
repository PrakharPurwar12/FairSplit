import { Activity } from 'lucide-react';

export const DashboardHeader = ({ header }) => (
  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center shadow-inner">
        <Activity size={20} />
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900 leading-tight">{header.title}</h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{header.sprint} • {header.status}</p>
      </div>
    </div>
    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full uppercase tracking-widest border border-emerald-100">
      {header.overallStatus}
    </span>
  </div>
);
