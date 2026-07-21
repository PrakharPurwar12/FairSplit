import { FolderKanban, Users, CheckSquare, BrainCircuit, BarChart3, ShieldAlert, TrendingUp, BellRing } from 'lucide-react';

export const modulesData = [
  {
    id: 1,
    title: "Project Management",
    description: "Create, organize, and manage projects, milestones, and deadlines efficiently.",
    icon: FolderKanban,
    tag: "Core Module",
    colorClass: "text-blue-600 bg-blue-50 border-blue-100",
    tagClass: "bg-blue-100 text-blue-700",
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
    colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100",
    tagClass: "bg-emerald-100 text-emerald-700",
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
    colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100",
    tagClass: "bg-indigo-100 text-indigo-700",
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
    colorClass: "text-purple-600 bg-purple-50 border-purple-100",
    tagClass: "bg-purple-100 text-purple-700",
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
    colorClass: "text-amber-600 bg-amber-50 border-amber-100",
    tagClass: "bg-amber-100 text-amber-700",
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
    colorClass: "text-rose-600 bg-rose-50 border-rose-100",
    tagClass: "bg-rose-100 text-rose-700",
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
    colorClass: "text-cyan-600 bg-cyan-50 border-cyan-100",
    tagClass: "bg-cyan-100 text-cyan-700",
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
    colorClass: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
    tagClass: "bg-fuchsia-100 text-fuchsia-700",
    capabilities: [
      "Due Date Alerts",
      "Risk Notifications",
      "AI Recommendations"
    ]
  }
];
