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
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };
  const fadeUp = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-[#060911]">

      {/* ── Ambient glow — sits behind everything ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="block dark:hidden">
          <div className="absolute top-[-10%] left-[5%] w-[50vw] h-[50vw] rounded-full bg-gradient-radial from-indigo-100/50 to-transparent blur-[80px]"></div>
          <div className="absolute top-[5%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-radial from-blue-50/50 to-transparent blur-[80px]"></div>
        </div>
        <div className="hidden dark:block">
          <div className="absolute top-[-5%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-blue-900/12 blur-[100px]"></div>
          <div className="absolute top-[10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-indigo-900/8 blur-[100px]"></div>
        </div>
      </div>

      {/* ── Hero copy ── */}
      <div className="relative z-10 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/[0.06] border border-gray-200/80 dark:border-white/10 backdrop-blur-sm w-max mb-3 sm:mb-4 shadow-sm">
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
          <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-4 sm:mb-5 px-2">
            AI-powered task allocation, workload balancing, and ML risk prediction — so your team delivers every project on time.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-3">
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
        </motion.div>
      </div>

      {/* ── Product showcase — floating glass card, tight gap below CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-5xl mx-auto">

          {/* Feature navigation pills — above the product window */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap mb-3 sm:mb-4">
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
          </div>

          {/* Glass product window */}
          <div 
            className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/70 dark:border-white/[0.08]"
            style={{ 
              boxShadow: 'var(--hero-card-shadow, 0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03))'
            }}
          >
            {/* Thin Mac-style title bar */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50/80 dark:bg-white/[0.03] border-b border-gray-200/50 dark:border-white/[0.05]">
              <div className="w-[9px] h-[9px] rounded-full bg-[#FF5F57]"></div>
              <div className="w-[9px] h-[9px] rounded-full bg-[#FFBD2E]"></div>
              <div className="w-[9px] h-[9px] rounded-full bg-[#28CA41]"></div>
              <span className="ml-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wide">FairSplit — {currentSlide.label}</span>
            </div>

            {/* Image viewport */}
            <div className="relative w-full bg-gray-100 dark:bg-[#0B1022] overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.label}
                  loading="lazy"
                  initial={{ opacity: 0, x: 30, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 w-full h-full object-contain object-center"
                />
              </AnimatePresence>

              {/* Minimal overlays — just enough to soften the edges, NOT hide content */}
              {/* Top: ~12% soft blend */}
              <div className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-gray-100/80 dark:from-[#0B1022]/80 to-transparent pointer-events-none"></div>
              {/* Bottom: ~10% soft blend */}
              <div className="absolute inset-x-0 bottom-0 h-[10%] bg-gradient-to-t from-gray-100/60 dark:from-[#0B1022]/60 to-transparent pointer-events-none"></div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/70 border border-gray-200/50 dark:border-white/10 shadow-md backdrop-blur-sm transition-all cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/70 border border-gray-200/50 dark:border-white/10 shadow-md backdrop-blur-sm transition-all cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Pagination dots — bottom center inside viewport */}
              <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 dark:bg-black/50 backdrop-blur-sm">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-5 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom glow reflection under the card */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-16 bg-gradient-radial from-indigo-500/8 dark:from-blue-500/10 to-transparent blur-2xl pointer-events-none"></div>
        </div>
      </motion.div>

      {/* Dark-mode shadow variable */}
      <style>{`
        .dark section { --hero-card-shadow: 0 25px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px -20px rgba(59,130,246,0.08); }
      `}</style>

    </section>
  );
};

export default Hero;
