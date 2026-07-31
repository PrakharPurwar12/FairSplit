import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Sparkles,
  Users, 
  Cpu, 
  AlertTriangle, 
  BarChart2, 
  GitBranch,
  LayoutDashboard,
  Pause,
  Play
} from 'lucide-react';

const BACKGROUND_SLIDES = [
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    tagline: 'Real-time project health & team activity overview',
    image: '/assets/hero/analytics_dashboard.png',
    icon: LayoutDashboard
  },
  {
    id: 'team-formation',
    title: 'AI Team Formation',
    tagline: 'Intelligent skill matching & compatibility scoring',
    image: '/assets/hero/team_formation_mock.png',
    icon: Users
  },
  {
    id: 'task-allocation',
    title: 'Smart Task Allocation',
    tagline: 'Automated workload balancing & capacity planning',
    image: '/assets/hero/task_allocation_mock.png',
    icon: Cpu
  },
  {
    id: 'risk-analysis',
    title: 'Predictive Risk Analysis',
    tagline: 'ML delay forecasts & team burnout warnings',
    image: '/assets/hero/risk_analysis_mock.png',
    icon: AlertTriangle
  },
  {
    id: 'analytics',
    title: 'Project Analytics',
    tagline: 'Burndown charts & team velocity metrics',
    image: '/assets/hero/analytics_bg.png',
    icon: BarChart2
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    tagline: 'AI workflow orchestration & status transitions',
    image: '/assets/hero/automation_bg.png',
    icon: GitBranch
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = BACKGROUND_SLIDES[currentIndex];
  const IconComponent = currentSlide.icon;

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
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-between items-center overflow-hidden bg-white dark:bg-[#060911] text-gray-900 dark:text-white pt-28 pb-10 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── BACKGROUND ENVIRONMENTAL LAYER (Z-0) ── */}
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
              className="w-full h-full object-cover object-top opacity-60 dark:opacity-35 transition-opacity duration-700"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* ── ATMOSPHERIC MIDGROUND LAYER (Z-10) ── */}
        {/* Light Theme: Subtle top-to-bottom directional gradient (anchors top, enhances center readability, blends to bottom) */}
        <div className="absolute inset-0 block dark:hidden bg-gradient-to-b from-white/20 via-white/40 to-white/95 pointer-events-none z-10"></div>

        {/* Dark Theme: Atmospheric dark directional gradient */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-[#060911]/35 via-[#060911]/65 to-[#060911] pointer-events-none z-10"></div>
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

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants} 
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-medium mb-6 sm:mb-8 px-2"
        >
          FairSplit uses Artificial Intelligence to intelligently assign tasks, balance workloads, predict project risks, and help teams deliver projects faster.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4"
        >
          <Link
            to="/register"
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

      {/* ── CINEMATIC BACKGROUND SLIDE INDICATOR PILLS ── */}
      <div className="relative z-20 w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-3">
        {/* Active Feature Tagline */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.06] border border-gray-200/60 dark:border-white/10 backdrop-blur-md shadow-sm">
          <div className="w-5 h-5 rounded-full bg-indigo-500/15 dark:bg-blue-400/20 flex items-center justify-center text-indigo-600 dark:text-blue-400 shrink-0">
            <IconComponent className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {currentSlide.title}: <span className="font-normal text-gray-500 dark:text-gray-400">{currentSlide.tagline}</span>
          </span>
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className="ml-1 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded transition-colors"
            title={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
          >
            {isPaused ? <Play className="w-3 h-3 text-indigo-600 dark:text-blue-400" /> : <Pause className="w-3 h-3 text-indigo-600 dark:text-blue-400" />}
          </button>
        </div>

        {/* Feature Navigation Dots / Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {BACKGROUND_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-7 bg-indigo-600 dark:bg-blue-400 shadow-sm'
                    : 'w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40'
                }`}
                title={`View ${slide.title}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Hero };
export default Hero;
