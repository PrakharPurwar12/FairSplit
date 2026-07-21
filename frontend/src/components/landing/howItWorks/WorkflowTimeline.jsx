import { motion } from 'framer-motion';
import { WorkflowStep } from './WorkflowStep';
import { howItWorksData } from '../../../data/howItWorksData';

export const WorkflowTimeline = () => {
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
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-12 xl:gap-6 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative"
    >
      {howItWorksData.map((step, index) => (
        <WorkflowStep 
          key={step.id} 
          data={step} 
          isLast={index === howItWorksData.length - 1} 
        />
      ))}
    </motion.div>
  );
};
