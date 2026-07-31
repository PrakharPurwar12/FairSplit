import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Cpu, 
  AlertTriangle, 
  BarChart2, 
  GitBranch,
  Sparkles
} from 'lucide-react';

const SLIDES = [
  {
    id: 'team-formation',
    label: 'AI Team Formation',
    image: '/assets/hero/team_formation_mock.png',
    icon: Users,
  },
  {
    id: 'task-allocation',
    label: 'Smart Task Allocation',
    image: '/assets/hero/task_allocation_mock.png',
    icon: Cpu,
  },
  {
    id: 'risk-analysis',
    label: 'Predictive Risk Analysis',
    image: '/assets/hero/risk_analysis_mock.png',
    icon: AlertTriangle,
  },
  {
    id: 'analytics',
    label: 'Project Analytics',
    image: '/assets/hero/analytics_bg.png',
    icon: BarChart2,
  },
  {
    id: 'automation',
    label: 'Workflow Automation',
    image: '/assets/hero/automation_bg.png',
    icon: GitBranch,
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = SLIDES[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section className="relative w-full h-dvh max-h-[1000px] flex flex-col overflow-hidden bg-white dark:bg-[#060911]">
      
      {/* ─── Ambient Background Glow (behind everything, -z) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Light mode */}
        <div className="block dark:hidden">
          <div className="absolute top-[-20%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-radial from-indigo-100/50 to-transparent blur-[80px]"></div>
          <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-radial from-blue-100/40 to-transparent blur-[80px]"></div>
          <div className="absolute bottom-0 left-[20%] w-[70vw] h-[40vw] rounded-full bg-gradient-radial from-violet-100/30 to-transparent blur-[100px]"></div>
        </div>
        {/* Dark mode */}
        <div className="hidden dark:block">
          <div className="absolute top-[-10%] left-[15%] w-[50vw] h-[50vw] rounded-full bg-blue-900/15 blur-[100px]"></div>
          <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/12 blur-[100px]"></div>
        </div>
      </div>

      {/* ─── Top Copy Section ─── */}
      <div className="relative flex-shrink-0 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10 }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center w-full max-w-3xl mx-auto"
        >
          {/* Version Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200/80 dark:border-white/10 w-max mb-4 sm:mb-5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-blue-400" />
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-200 tracking-widest uppercase">FairSplit AI v2.0</span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-[2rem] sm:text-5xl md:text-[3.4rem] lg:text-[3.8rem] leading-[1.08] font-black tracking-tight text-gray-900 dark:text-white mb-3 sm:mb-4">
            Build Smarter Teams.<br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400">Predict Risks.</span>{' '}
            <span className="hidden sm:inline"><br/></span>
            Deliver Faster.
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-5 sm:mb-6 px-2">
            AI-powered task allocation, workload balancing, and ML risk prediction — so your team delivers every project on time.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-3">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all hover:bg-black dark:hover:bg-gray-100 shadow-lg shadow-gray-900/10 dark:shadow-white/10 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started Free
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10"
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Product Visual — floating device frame rising from bottom ─── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative flex-1 min-h-0 flex items-end justify-center px-4 sm:px-8 lg:px-12 mt-6 sm:mt-8"
        style={{ zIndex: 15, perspective: '1200px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Reflection glow under the device */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-24 bg-gradient-radial from-indigo-500/15 dark:from-blue-500/20 via-transparent to-transparent blur-2xl pointer-events-none"></div>

        {/* Device frame */}
        <div 
          className="relative w-full max-w-[900px] rounded-t-2xl overflow-hidden shadow-[0_-4px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_80px_rgba(0,0,0,0.5)] border border-b-0 border-gray-200/60 dark:border-white/[0.08] bg-white dark:bg-[#0C1120]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Browser chrome */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#0A0F1C] border-b border-gray-200/60 dark:border-white/[0.06] shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#28CA41]"></div>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-black/40 text-gray-400 dark:text-gray-500 text-[10px] font-mono px-3 py-1 rounded-md border border-gray-200/60 dark:border-white/[0.06] max-w-[220px] sm:max-w-xs truncate">
              <span className="truncate">app.fairsplit.ai</span>
            </div>
            <div className="w-[62px]"></div>
          </div>

          {/* Image stage — aspect-ratio bounded, no overflow */}
          <div className="relative w-full aspect-[16/9] max-h-[45vh] bg-gray-100 dark:bg-[#070B14] overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide.id}
                src={currentSlide.image}
                alt={currentSlide.label}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </AnimatePresence>

            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/60 dark:from-[#070B14]/70 via-transparent to-transparent"></div>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]"></div>

            {/* Nav arrows — visible on hover */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-black/60 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/80 border border-gray-200/60 dark:border-white/10 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 sm:opacity-100 cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-black/60 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/80 border border-gray-200/60 dark:border-white/10 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 sm:opacity-100 cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Feature label + dots overlay pinned at bottom */}
            <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-3 pt-8 bg-gradient-to-t from-white/90 dark:from-[#070B14]/90 via-white/40 dark:via-[#070B14]/40 to-transparent flex items-end justify-between">
              <div className="flex items-center gap-2">
                {React.createElement(currentSlide.icon, { className: 'w-3.5 h-3.5 text-indigo-600 dark:text-blue-400' })}
                <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">{currentSlide.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-5 h-1.5 bg-indigo-600 dark:bg-blue-500'
                        : 'w-1.5 h-1.5 bg-gray-300 dark:bg-white/25 hover:bg-gray-400 dark:hover:bg-white/40'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade — blends frame into the page below */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-[#060911] to-transparent pointer-events-none" style={{ zIndex: 20 }}></div>
      </motion.div>

    </section>
  );
};

export default Hero;
