import { SectionHeader } from './SectionHeader';
import { FeaturesGrid } from './FeaturesGrid';

export const Features = () => {
  return (
    <section id="features" className="pt-12 pb-24 relative bg-white">
      {/* Decorative subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      
      <SectionHeader 
        badge="Powerful AI Features"
        title="Everything you need to deliver faster"
        description="Discover how FairSplit uses AI to build balanced teams, optimize workloads, predict risks, and improve project delivery."
      />
      
      <FeaturesGrid />
    </section>
  );
};
