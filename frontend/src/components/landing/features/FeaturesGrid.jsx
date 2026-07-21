import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { mainFeaturesData } from '../../../data/featuresData';

export const FeaturesGrid = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {mainFeaturesData.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </motion.div>
  );
};
