import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HeroShowcase from './HeroShowcase';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="pt-32 pb-12 flex flex-col items-center justify-start relative min-h-screen overflow-hidden">
      
      {/* Light Theme Layered Asymmetrical Ambient Lighting */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none block dark:hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-radial from-indigo-50/60 to-transparent blur-[100px] opacity-80"></div>
        <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-blue-50/50 to-transparent blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-violet-50/40 to-transparent blur-[120px] opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAwdjRoNHYtNEgweiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
      </div>

      {/* Dark Theme Cinematic Depth Lighting */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] opacity-50"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[120px] opacity-40"></div>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center flex-grow">
      
        {/* Centered Copy */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center w-full max-w-4xl z-20 mt-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-surface border border-gray-200 dark:border-border w-max mb-8 shadow-sm dark:shadow-none">
            <span className="text-[10px] font-bold text-gray-900 dark:text-white tracking-widest uppercase">FairSplit AI v2.0 Live</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1] font-black tracking-tighter text-gray-900 dark:text-white mb-8">
            Build Smarter Teams.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-primary dark:to-info inline-block py-1">Predict Risks.</span><br/>
            Deliver Faster.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed font-medium">
            FairSplit uses Artificial Intelligence to intelligently assign tasks, balance workloads, predict project risks, and help teams deliver projects faster.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-4 mb-16">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-gray-900 dark:bg-primary text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-black dark:hover:bg-primary-hover transition-all shadow-md dark:shadow-none hover:shadow-lg"
            >
              Get Started
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#dashboard"
              className="flex items-center gap-2 text-gray-700 dark:text-white px-8 py-4 rounded-full text-sm font-bold bg-white dark:bg-surface hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors border border-gray-200 dark:border-border shadow-sm dark:shadow-none"
            >
              View Dashboard
            </a>
          </motion.div>
        </motion.div>

        {/* Premium Rotating Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <HeroShowcase />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
