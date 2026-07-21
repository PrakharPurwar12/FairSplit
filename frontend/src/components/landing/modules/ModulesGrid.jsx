import { motion } from 'framer-motion';
import { ModuleCard } from './ModuleCard';
import { modulesData } from '../../../data/modulesData';

export const ModulesGrid = () => {
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {modulesData.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </motion.div>
  );
};
