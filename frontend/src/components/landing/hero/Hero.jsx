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
  { id: 'team-formation', label: 'AI Team Formation', image: '/assets/hero/team_formation_mock.png', icon: Users },
  { id: 'task-allocation', label: 'Smart Task Allocation', image: '/assets/hero/task_allocation_mock.png', icon: Cpu },
  { id: 'risk-analysis', label: 'Predictive Risk', image: '/assets/hero/risk_analysis_mock.png', icon: AlertTriangle },
  { id: 'analytics', label: 'Project Analytics', image: '/assets/hero/analytics_bg.png', icon: BarChart2 },
  { id: 'automation', label: 'Workflow Automation', image: '/assets/hero/automation_bg.png', icon: GitBranch },
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

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
  };
  const fadeUp = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section className="relative w-full h-dvh max-h-[1080px] overflow-hidden bg-white dark:bg-[#060911]">

      {/* ═══════════ LAYER 1: Immersive Product Visual (fills bottom ~60%) ═══════════ */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[55%] sm:h-[58%] md:h-[62%]"
        style={{ zIndex: 1 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* The rotating product mockup — full bleed, edge to edge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <img 
              src={currentSlide.image} 
              alt={currentSlide.label}
              loading="lazy"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient masks that blend the image INTO the page — this is the key to "integrated, not screenshot" */}
        {/* Top edge: heavy fade so text above is perfectly readable */}
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white dark:from-[#060911] to-transparent pointer-events-none"></div>
        {/* Bottom edge: fade into next section */}
        <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-white dark:from-[#060911] to-transparent pointer-events-none"></div>
        {/* Left edge softness */}
        <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-white dark:from-[#060911] to-transparent pointer-events-none"></div>
        {/* Right edge softness */}
        <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-white dark:from-[#060911] to-transparent pointer-events-none"></div>
        {/* Center vignette for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px 40px rgba(255,255,255,0.3)' }}></div>
        <div className="hidden dark:block absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px 40px rgba(6,9,17,0.4)' }}></div>

        {/* Navigation arrows — edges of the visual */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 top-[55%] -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border border-gray-200/50 dark:border-white/10 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 top-[55%] -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border border-gray-200/50 dark:border-white/10 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ═══════════ LAYER 2: Ambient glow ═══════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        <div className="block dark:hidden">
          <div className="absolute top-[-15%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-gradient-radial from-indigo-100/60 to-transparent blur-[80px]"></div>
          <div className="absolute top-0 right-[-8%] w-[45vw] h-[45vw] rounded-full bg-gradient-radial from-blue-100/40 to-transparent blur-[80px]"></div>
        </div>
        <div className="hidden dark:block">
          <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/15 blur-[100px]"></div>
          <div className="absolute top-[15%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-indigo-900/10 blur-[100px]"></div>
        </div>
      </div>

      {/* ═══════════ LAYER 3: Hero copy — floats above the visual ═══════════ */}
      <div className="relative pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8" style={{ zIndex: 10 }}>
        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/[0.06] border border-gray-200/80 dark:border-white/10 backdrop-blur-sm w-max mb-4 sm:mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-blue-400" />
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-200 tracking-widest uppercase">FairSplit AI v2.0</span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-[2rem] sm:text-5xl md:text-[3.4rem] lg:text-[3.8rem] leading-[1.08] font-black tracking-tight text-gray-900 dark:text-white mb-3 sm:mb-4">
            Build Smarter Teams.<br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400">Predict Risks.</span>{' '}
            <br className="hidden sm:block"/>
            Deliver Faster.
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-5 sm:mb-6 px-2">
            AI-powered task allocation, workload balancing, and ML risk prediction — so your team delivers every project on time.
          </motion.p>
          
          {/* Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-3 mb-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all hover:bg-black dark:hover:bg-gray-100 shadow-lg shadow-gray-900/10 dark:shadow-white/10 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started Free
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-white/80 dark:bg-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10 backdrop-blur-sm"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Feature navigation pills — sits between text and visual */}
          <motion.div variants={fadeUp} className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
            {SLIDES.map((slide, idx) => {
              const Icon = slide.icon;
              const active = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{slide.label}</span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
