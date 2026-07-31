import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Cpu, 
  AlertTriangle, 
  BarChart2, 
  GitBranch, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Pause,
  Play
} from 'lucide-react';

const SLIDES = [
  {
    id: 'collaboration',
    title: 'AI-powered Team Collaboration',
    subtitle: 'Form optimal project teams with dynamic skill matching and role harmony.',
    image: '/assets/hero/team_collaboration.png',
    icon: Users,
    tag: 'Team Dynamics',
    badgeColor: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'allocation',
    title: 'Smart Task Allocation',
    subtitle: 'Multi-factor allocation algorithm balances workload capacity and skill proficiencies.',
    image: '/assets/hero/task_allocation.png',
    icon: Cpu,
    tag: 'Algorithmic Optimization',
    badgeColor: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'risk',
    title: 'Predictive Risk Analysis',
    subtitle: 'Machine Learning models detect delivery risks and deadline bottlenecks early.',
    image: '/assets/hero/risk_analysis.png',
    icon: AlertTriangle,
    tag: 'ML Forecasting',
    badgeColor: 'from-amber-500/20 to-red-500/20 text-amber-400 border-amber-500/30'
  },
  {
    id: 'analytics',
    title: 'Project Analytics Dashboard',
    subtitle: 'Real-time metrics, member workload distribution, and AI confidence indicators.',
    image: '/assets/hero/analytics_dashboard.png',
    icon: BarChart2,
    tag: 'Real-Time Insights',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'automation',
    title: 'Workflow Automation & Productivity',
    subtitle: 'Automate repetitive assignment pipelines and eliminate project management overhead.',
    image: '/assets/hero/workflow_automation.png',
    icon: GitBranch,
    tag: 'Automated Pipelines',
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  }
];

const HeroShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = SLIDES[currentIndex];
  const IconComponent = currentSlide.icon;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div 
      className="w-full max-w-5xl relative z-30 mt-4 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#090D16] text-white flex flex-col group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Browser Chrome Header */}
      <div className="bg-[#0D1322] px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 w-24">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>

        {/* Dynamic URL Badge */}
        <div className="bg-[#050811] text-gray-400 text-[11px] font-mono px-4 py-1.5 rounded-lg flex items-center gap-2 border border-white/5 max-w-xs truncate shadow-inner">
          <Sparkles className="w-3 h-3 text-blue-400 shrink-0 animate-pulse" />
          <span className="truncate">fairsplit.ai/{currentSlide.id}</span>
        </div>

        {/* Right Action / Pause Indicator */}
        <div className="flex items-center gap-2 w-24 justify-end">
          <span className="text-[10px] uppercase font-mono text-gray-400 hidden sm:inline">
            {isPaused ? 'Paused' : 'Auto'}
          </span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>

      {/* Feature Selector Tabs Header */}
      <div className="bg-[#0A0F1C]/90 border-b border-white/5 px-2 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {SLIDES.map((slide, idx) => {
          const TabIcon = slide.icon;
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{slide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Showcase Stage */}
      <div className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] bg-[#060912] overflow-hidden flex flex-col justify-between">
        
        {/* Animated Image Render */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center p-2 sm:p-4"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={currentSlide.image} 
                alt={currentSlide.title}
                loading="lazy"
                className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
              />

              {/* Ambient Vignette & Gradient Mask (15-30% dark overlay for readability) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060912] via-[#060912]/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#060912]/80 via-transparent to-[#060912]/40"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Overlay Title & Subtitle Badge */}
        <div className="relative z-20 p-6 sm:p-8 mt-auto max-w-2xl bg-gradient-to-t from-[#060912] via-[#060912]/90 to-transparent rounded-t-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r border text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <IconComponent className="w-3.5 h-3.5" />
                <span>{currentSlide.tag}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {currentSlide.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-xl">
                {currentSlide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-[#0D1322]/80 hover:bg-blue-600 text-gray-300 hover:text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-[#0D1322]/80 hover:bg-blue-600 text-gray-300 hover:text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Footer Control Bar */}
      <div className="bg-[#0B101D] px-6 py-3 border-t border-white/10 flex items-center justify-between z-20">
        
        {/* Slide Counter */}
        <span className="text-xs font-mono font-semibold text-gray-400">
          0{currentIndex + 1} / 0{SLIDES.length}
        </span>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-blue-500 shadow-sm shadow-blue-500/50'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-blue-400" /> : <Pause className="w-3.5 h-3.5 text-blue-400" />}
          <span className="hidden sm:inline">{isPaused ? 'Play' : 'Pause'}</span>
        </button>
      </div>
    </div>
  );
};

export default HeroShowcase;
