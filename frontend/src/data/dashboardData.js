export const dashboardData = {
  projectHeader: {
    title: "Project Alpha",
    sprint: "Sprint 12",
    status: "Active",
    overallStatus: "On Track",
  },
  projectHealth: {
    progress: 82,
    riskLevel: "High Risk",
    deadlineStatus: "Jeopardy",
  },
  teamBalance: {
    score: 94,
    statusText: "Excellent Composition",
    members: [
      { id: 'a', initials: 'A', color: 'bg-blue-100 text-blue-700' },
      { id: 's', initials: 'S', color: 'bg-emerald-100 text-emerald-700' },
      { id: 'j', initials: 'J', color: 'bg-amber-100 text-amber-700' },
    ]
  },
  workload: [
    { name: "Alice", value: 95, colorClass: "bg-rose-400", textClass: "text-rose-500" },
    { name: "John", value: 45, colorClass: "bg-blue-400", textClass: "text-gray-500" },
    { name: "Sarah", value: 60, colorClass: "bg-emerald-400", textClass: "text-gray-500" },
  ],
  recommendation: {
    task: "Auth Module",
    from: "Alice",
    to: "John",
  },
  activities: [
    { title: "Risk Detected", description: "API deadline in jeopardy", timeAgo: "2 mins ago" },
    { title: "Workload Optimized", description: "AI rebalanced backend tasks", timeAgo: "15 mins ago" },
    { title: "Sprint Health Improved", description: "Velocity increased by 12%", timeAgo: "1 hour ago" },
    { title: "Team Balance Recalculated", description: "Skills alignment at 94%", timeAgo: "2 hours ago" },
    { title: "New Recommendation", description: "Ready for review", timeAgo: "3 hours ago" }
  ]
};
