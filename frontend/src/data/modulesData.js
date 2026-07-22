import { FolderKanban, Users, CheckSquare, BrainCircuit, BarChart3, ShieldAlert, TrendingUp, BellRing } from 'lucide-react';

export const modulesData = [
  {
    id: 1,
    title: "Project Management",
    description: "Create, organize, and manage projects, milestones, and deadlines efficiently.",
    icon: FolderKanban,
    tag: "Core Module",
    colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    tagClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    capabilities: [
      "Project Creation",
      "Milestone Tracking",
      "Deadline Management"
    ]
  },
  {
    id: 2,
    title: "Team Management",
    description: "Manage team members, roles, skills, and availability from one place.",
    icon: Users,
    tag: "Collaboration",
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tagClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    capabilities: [
      "Role Management",
      "Skill Profiles",
      "Availability Tracking"
    ]
  },
  {
    id: 3,
    title: "Task Management",
    description: "Create, assign, prioritize, and monitor tasks throughout the project lifecycle.",
    icon: CheckSquare,
    tag: "Workflow",
    colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    tagClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    capabilities: [
      "Task Assignment",
      "Priority Management",
      "Status Tracking"
    ]
  },
  {
    id: 4,
    title: "AI Task Allocation",
    description: "Automatically assigns tasks to the most suitable team members using AI.",
    icon: BrainCircuit,
    tag: "AI Powered",
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    tagClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    capabilities: [
      "Skill Matching",
      "Workload Balancing",
      "Priority-Based Assignment"
    ]
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    description: "Visualize project health, workload distribution, productivity, and performance.",
    icon: BarChart3,
    tag: "Analytics",
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    tagClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    capabilities: [
      "Project Health",
      "Performance Insights",
      "Interactive Reports"
    ]
  },
  {
    id: 6,
    title: "Risk Prediction",
    description: "Predict delays, workload imbalance, and potential project risks before they occur.",
    icon: ShieldAlert,
    tag: "Machine Learning",
    colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    tagClass: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    capabilities: [
      "Delay Detection",
      "Risk Analysis",
      "Bottleneck Prediction"
    ]
  },
  {
    id: 7,
    title: "Progress Tracking",
    description: "Track sprint progress, project completion, and individual team contributions.",
    icon: TrendingUp,
    tag: "Monitoring",
    colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    tagClass: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    capabilities: [
      "Sprint Progress",
      "Contribution Tracking",
      "Completion Status"
    ]
  },
  {
    id: 8,
    title: "Smart Notifications",
    description: "Receive intelligent alerts about overdue tasks, workload imbalance, risks, and project updates.",
    icon: BellRing,
    tag: "Automation",
    colorClass: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
    tagClass: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
    capabilities: [
      "Due Date Alerts",
      "Risk Notifications",
      "AI Recommendations"
    ]
  }
];
