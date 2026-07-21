import { SectionHeader } from './SectionHeader';
import { ModulesGrid } from './ModulesGrid';

export const Modules = () => {
  return (
    <section id="modules" className="py-24 relative bg-white">
      {/* Decorative subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      
      <SectionHeader 
        badge="PLATFORM MODULES"
        title="Everything You Need in One Intelligent Platform"
        subtitle="FairSplit combines project management, AI automation, analytics, and collaboration into one unified workspace."
      />
      
      <ModulesGrid />
    </section>
  );
};
