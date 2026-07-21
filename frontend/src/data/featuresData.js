import { Check, ShieldAlert, Activity, BarChart3, Users, Zap, Lightbulb } from 'lucide-react';

export const featuresData = [
  {
    id: 1,
    label: "AI Task Allocation",
    icon: Check,
    colorClass: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    label: "Risk Prediction",
    icon: ShieldAlert,
    colorClass: "bg-purple-50 text-purple-600",
  },
  {
    id: 3,
    label: "Workload Optimization",
    icon: Activity,
    colorClass: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 4,
    label: "Real-time Analytics",
    icon: BarChart3,
    colorClass: "bg-amber-50 text-amber-600",
  },
];

export const mainFeaturesData = [
  {
    id: 1,
    title: "AI Task Allocation",
    description: "Intelligently assigns tasks to the most suitable team members based on skills, workload, priority, and availability.",
    icon: Users,
    colorClass: "text-blue-600 bg-blue-50 border-blue-100"
  },
  {
    id: 2,
    title: "Smart Workload Optimization",
    description: "Distributes work fairly among team members to reduce overload and improve productivity.",
    icon: Zap,
    colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100"
  },
  {
    id: 3,
    title: "Risk Prediction",
    description: "Predicts project delays, workload imbalance, and potential risks before they become critical.",
    icon: ShieldAlert,
    colorClass: "text-rose-600 bg-rose-50 border-rose-100"
  },
  {
    id: 4,
    title: "Real-Time Analytics",
    description: "Monitor project health, workload, productivity, and team performance using interactive dashboards.",
    icon: BarChart3,
    colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100"
  },
  {
    id: 5,
    title: "AI Recommendations",
    description: "Receive intelligent suggestions for task reassignment, workload balancing, and project optimization.",
    icon: Lightbulb,
    colorClass: "text-purple-600 bg-purple-50 border-purple-100"
  },
  {
    id: 6,
    title: "Contribution Tracking",
    description: "Track individual contributions, sprint progress, and overall project completion with complete transparency.",
    icon: Activity,
    colorClass: "text-amber-600 bg-amber-50 border-amber-100"
  }
];
