import { SectionHeader } from './SectionHeader';
import { WorkflowTimeline } from './WorkflowTimeline';

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-[#FAFAFC]">
      {/* Decorative subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      
      <SectionHeader 
        badge="HOW IT WORKS"
        title="How FairSplit Works"
        subtitle="A simple AI-powered workflow that helps teams plan projects, assign tasks intelligently, predict risks, and optimize workloads from start to finish."
      />
      
      <WorkflowTimeline />
    </section>
  );
};
