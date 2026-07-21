import { motion } from 'framer-motion';
import CountUpLib from 'react-countup';
const CountUp = CountUpLib.default || CountUpLib;

export const ProgressRing = ({ percentage }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-14 h-14 transform -rotate-90 absolute inset-0">
        <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100" />
        <motion.circle 
          cx="28" 
          cy="28" 
          r={radius} 
          stroke="currentColor" 
          strokeWidth="5" 
          fill="transparent" 
          className="text-blue-600" 
          strokeDasharray={circumference} 
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        />
      </svg>
      <span className="text-sm font-bold text-gray-900">
        <CountUp end={percentage} duration={2} suffix="%" />
      </span>
    </div>
  );
};
