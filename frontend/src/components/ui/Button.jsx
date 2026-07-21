import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);
const MotionA = motion.a;

export const Button = ({ children, variant = 'primary', to, href, className = "" }) => {
  const baseClasses = "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm";
  const variants = {
    primary: "bg-[#2563EB] text-white hover:bg-blue-700 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]",
    secondary: "bg-white text-[#111827] border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;
  const hoverProps = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } };

  if (to) {
    return <MotionLink to={to} className={combinedClasses} {...hoverProps}>{children}</MotionLink>;
  }

  if (href) {
    return <MotionA href={href} className={combinedClasses} {...hoverProps}>{children}</MotionA>;
  }

  return (
    <motion.button className={combinedClasses} {...hoverProps}>
      {children}
    </motion.button>
  );
};
