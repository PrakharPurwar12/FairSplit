import React from 'react';
import SectionHeader from './SectionHeader';
import FeaturesGrid from './FeaturesGrid';

const Features = () => {
  return (
    <section id="features" className="pt-24 pb-32 relative z-10 bg-background dark:bg-transparent border-t border-gray-100 dark:border-transparent transition-colors duration-300">
      <SectionHeader 
        badge="Powerful AI Features"
        title="Everything you need to deliver faster"
        description="Discover how FairSplit uses AI to build balanced teams, optimize workloads, predict risks, and improve project delivery."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <FeaturesGrid />
      </div>
    </section>
  );
};

export default Features;
