import { motion } from 'framer-motion';

export const Badge = ({ children, className = "" }) => (
  <motion.span 
    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] md:text-xs font-bold tracking-wide uppercase ${className}`}
    whileHover={{ scale: 1.05 }}
  >
    {children}
  </motion.span>
);
