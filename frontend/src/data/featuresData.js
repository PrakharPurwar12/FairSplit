import { Check, ShieldAlert, Activity, BarChart3, Users, Zap, Lightbulb } from 'lucide-react';

export const featuresData = [
  {
    id: 1,
    label: "AI Task Allocation",
    icon: Check,
    colorClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  {
    id: 2,
    label: "Risk Prediction",
    icon: ShieldAlert,
    colorClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  },
  {
    id: 3,
    label: "Workload Optimization",
    icon: Activity,
    colorClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  {
    id: 4,
    label: "Real-time Analytics",
    icon: BarChart3,
    colorClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
];

export const mainFeaturesData = [
  {
    id: 1,
    title: "AI Task Allocation",
    description: "Intelligently assigns tasks to the most suitable team members based on skills, workload, priority, and availability.",
    icon: Users,
    colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20"
  },
  {
    id: 2,
    title: "Smart Workload Optimization",
    description: "Distributes work fairly among team members to reduce overload and improve productivity.",
    icon: Zap,
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    id: 3,
    title: "Risk Prediction",
    description: "Predicts project delays, workload imbalance, and potential risks before they become critical.",
    icon: ShieldAlert,
    colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20"
  },
  {
    id: 4,
    title: "Real-Time Analytics",
    description: "Monitor project health, workload, productivity, and team performance using interactive dashboards.",
    icon: BarChart3,
    colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
  },
  {
    id: 5,
    title: "AI Recommendations",
    description: "Receive intelligent suggestions for task reassignment, workload balancing, and project optimization.",
    icon: Lightbulb,
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20"
  },
  {
    id: 6,
    title: "Contribution Tracking",
    description: "Track individual contributions, sprint progress, and overall project completion with complete transparency.",
    icon: Activity,
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  }
];
