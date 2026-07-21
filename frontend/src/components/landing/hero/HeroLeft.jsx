import { motion } from 'framer-motion';
import { HeroButtons } from './HeroButtons';
import { FeatureBadges } from './FeatureBadges';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const HeroLeft = () => (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="relative z-10"
  >
    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-extrabold tracking-tight text-[#111827] mb-6">
      Build Smarter Teams.<br />
      Predict Risks & Optimize.<br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
        Deliver Faster.
      </span>
    </motion.h1>
    
    <motion.p variants={itemVariants} className="text-base md:text-lg text-[#6B7280] mb-8 max-w-lg leading-relaxed">
      AI-powered project management that forms balanced teams, predicts risks, and optimizes workloads for fairer delivery.
    </motion.p>
    
    <motion.div variants={itemVariants}>
      <HeroButtons 
        primaryCta={{ text: "Get Started", link: "/register" }} 
        secondaryCta={{ text: "Explore Features", link: "#features" }} 
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <FeatureBadges />
    </motion.div>
  </motion.div>
);
