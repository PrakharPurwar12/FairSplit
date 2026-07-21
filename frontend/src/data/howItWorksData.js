import { FolderPlus, Users, BrainCircuit, ShieldAlert, Workflow, BarChart3 } from 'lucide-react';

export const howItWorksData = [
  {
    id: 1,
    step: "01",
    title: "Create Project",
    description: "Create a new project and define its goals, deadlines, and requirements.",
    icon: FolderPlus
  },
  {
    id: 2,
    step: "02",
    title: "Build Your Team",
    description: "Add team members with their skills, experience, and availability.",
    icon: Users
  },
  {
    id: 3,
    step: "03",
    title: "AI Task Allocation",
    description: "FairSplit intelligently assigns tasks to the most suitable members based on skills, workload, priority, and availability.",
    icon: BrainCircuit
  },
  {
    id: 4,
    step: "04",
    title: "Risk Prediction",
    description: "The AI continuously analyzes project data to identify delays, bottlenecks, and workload imbalance before they become critical.",
    icon: ShieldAlert
  },
  {
    id: 5,
    step: "05",
    title: "Workload Optimization",
    description: "Tasks are rebalanced automatically to improve productivity and prevent overloading any team member.",
    icon: Workflow
  },
  {
    id: 6,
    step: "06",
    title: "Track Progress",
    description: "Monitor project health, team performance, and AI insights through interactive dashboards.",
    icon: BarChart3
  }
];
