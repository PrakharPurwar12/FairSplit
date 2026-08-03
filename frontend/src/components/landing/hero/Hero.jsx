import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const BACKGROUND_SLIDES = [
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    image: '/assets/hero/analytics_dashboard.png',
  },
  {
    id: 'team-formation',
    title: 'AI Team Formation',
    image: '/assets/hero/team_formation_mock.png',
  },
  {
    id: 'task-allocation',
    title: 'Smart Task Allocation',
    image: '/assets/hero/task_allocation_mock.png',
  },
  {
    id: 'risk-analysis',
    title: 'Predictive Risk Analysis',
    image: '/assets/hero/risk_analysis_mock.png',
  },
  {
    id: 'analytics',
    title: 'Project Analytics',
    image: '/assets/hero/analytics_bg.png',
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    image: '/assets/hero/automation_bg.png',
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const getStartedPath = isAuthenticated ? (user?.experience ? '/dashboard' : '/onboarding') : '/register';

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 2500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentSlide = BACKGROUND_SLIDES[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section 
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white dark:bg-[#060911] text-gray-900 dark:text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* ── CONTINUOUS INFINITE BACKGROUND SLIDESHOW ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title}
              className="w-full h-full object-cover object-top opacity-60 dark:opacity-40"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* ── SUBTLE VIGNETTE OVERLAY: TRANSPARENT CENTER, DARK EDGES IN LIGHT MODE, 35% DARK TINT IN DARK MODE ── */}
        <div className="absolute inset-0 block dark:hidden bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(17,24,39,0.15)_100%)] pointer-events-none"></div>
        <div className="absolute inset-0 hidden dark:block bg-[#060911]/35 pointer-events-none"></div>
      </div>

      {/* ── FOREGROUND HERO CONTENT LAYER (Z-20) ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto my-auto"
      >
        {/* Version Badge */}
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.06] border border-gray-200/80 dark:border-white/10 backdrop-blur-md w-max mb-4 sm:mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 tracking-widest uppercase">FairSplit AI v2.0</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.08] font-black tracking-tight text-gray-900 dark:text-white mb-4 sm:mb-6"
        >
          Build Smarter Teams.<br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400">Predict Risks.</span>{' '}
          <span className="hidden sm:inline"><br/></span>
          Deliver Faster.
        </motion.h1>

        {/* Subtitle - Adaptive Neutral Text for 100% Readability Across All Slides */}
        <motion.p 
          variants={itemVariants} 
          className="text-base sm:text-lg md:text-xl text-gray-900 dark:text-gray-200 max-w-2xl leading-relaxed font-semibold sm:font-medium mb-6 sm:mb-8 px-2"
        >
          FairSplit uses Artificial Intelligence to intelligently assign tasks, balance workloads, predict project risks, and help teams deliver projects faster.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4"
        >
          <Link
            to={getStartedPath}
            className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all hover:bg-black dark:hover:bg-gray-100 shadow-xl shadow-gray-900/10 dark:shadow-white/10 hover:scale-105 active:scale-95"
          >
            Get Started Free
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-md transition-all border border-gray-200 dark:border-white/15 shadow-sm hover:scale-105 active:scale-95"
          >
            See How It Works
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export { Hero };
export default Hero;
