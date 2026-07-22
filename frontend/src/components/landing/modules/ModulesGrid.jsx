import React from 'react';
import { motion } from 'framer-motion';
import ModuleCard from './ModuleCard';
import { modulesData } from '../../../data/modulesData';

const ModulesGrid = () => {
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
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      {modulesData.map((module, index) => {
        // Asymmetrical sizing: 12 columns total
        // Pattern: 8 + 4, 4 + 8, etc.
        const spanClasses = [
          "md:col-span-8",
          "md:col-span-4",
          "md:col-span-5",
          "md:col-span-7",
          "md:col-span-6",
          "md:col-span-6"
        ];
        const span = spanClasses[index % spanClasses.length];
        return (
          <div key={module.id} className={`${span} h-full`}>
            <ModuleCard module={module} />
          </div>
        );
      })}
    </motion.div>
  );
};

export default ModulesGrid;
