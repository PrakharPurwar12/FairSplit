import React from 'react';
import SectionHeader from './SectionHeader';
import ModulesGrid from './ModulesGrid';

const Modules = () => {
  return (
    <section id="modules" className="pt-24 pb-32 relative z-10 bg-background dark:bg-transparent border-t border-gray-100 dark:border-transparent transition-colors duration-300">
      <SectionHeader 
        badge="Platform Modules"
        title="Comprehensive Project Control"
        description="Explore the core modules that make FairSplit the ultimate AI-powered project management platform."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <ModulesGrid />
      </div>
    </section>
  );
};

export default Modules;
