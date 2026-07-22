import React from 'react';
import { motion } from 'framer-motion';
import WorkflowStep from './WorkflowStep';
import { howItWorksData } from '../../../data/howItWorksData';

const WorkflowTimeline = () => {
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
            staggerChildren: 0.15
          }
        }
      }}
      className="flex flex-col gap-6 max-w-4xl mx-auto relative z-10"
    >
      {howItWorksData.map((step, index) => (
        <WorkflowStep 
          key={step.id} 
          data={step} 
          index={index} 
        />
      ))}
    </motion.div>
  );
};

export default WorkflowTimeline;
