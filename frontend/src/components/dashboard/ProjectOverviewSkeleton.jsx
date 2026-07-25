import React from 'react';

const ProjectOverviewSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-[#111111]/50 border border-gray-200/50 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Project Overview</h3>
        <div className="h-8 w-24 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse"></div>
      </div>
      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Team</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-white/5 animate-pulse shrink-0"></div>
                    <div className="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-20 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-2 w-24 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse overflow-hidden"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-[#111111] animate-pulse"></div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectOverviewSkeleton;
