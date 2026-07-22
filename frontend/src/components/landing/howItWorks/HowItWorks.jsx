import React from 'react';
import SectionHeader from './SectionHeader';
import WorkflowTimeline from './WorkflowTimeline';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-surface dark:bg-surface transition-colors duration-300">
      <SectionHeader 
        badge="Intelligent Workflow"
        title="How FairSplit Works"
        subtitle="A simple AI-powered workflow that helps teams plan projects, assign tasks intelligently, predict risks, and optimize workloads from start to finish."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <WorkflowTimeline />
      </div>
    </section>
  );
};

export default HowItWorks;
