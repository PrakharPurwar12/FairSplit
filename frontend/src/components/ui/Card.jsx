import { motion } from 'framer-motion';

export const Card = ({ children, className = "", animateProps = {} }) => (
  <motion.div 
    className={`bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-6 ${className}`}
    whileHover={{ y: -2, boxShadow: '0 12px 40px rgb(0,0,0,0.08)' }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    {...animateProps}
  >
    {children}
  </motion.div>
);
