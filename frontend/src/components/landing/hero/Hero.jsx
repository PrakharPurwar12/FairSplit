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
  Sparkles,
  Pause,
  Play
} from 'lucide-react';

const SLIDES = [
  {
    id: 'team-formation',
    title: 'AI Team Formation',
    tagline: 'Team cards, skill matching & member compatibility scoring',
    image: '/assets/hero/team_formation_mock.png',
    icon: Users,
    glow: 'from-blue-600/30 via-indigo-600/20 to-transparent'
  },
  {
    id: 'task-allocation',
    title: 'Smart Task Allocation',
    tagline: 'Kanban workload balancing & automated work assignment',
    image: '/assets/hero/task_allocation_mock.png',
    icon: Cpu,
    glow: 'from-purple-600/30 via-indigo-600/20 to-transparent'
  },
  {
    id: 'risk-analysis',
    title: 'Predictive Risk Analysis',
    tagline: 'Timeline forecast, ML risk scores & burnout warning system',
    image: '/assets/hero/risk_analysis_mock.png',
    icon: AlertTriangle,
    glow: 'from-amber-600/30 via-red-600/20 to-transparent'
  },
  {
    id: 'analytics',
    title: 'Project Analytics',
    tagline: 'Executive KPIs, burndown charts & completion velocity',
    image: '/assets/hero/analytics_bg.png',
    icon: BarChart2,
    glow: 'from-emerald-600/30 via-teal-600/20 to-transparent'
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    tagline: 'Automation pipelines, task flow & AI status transitions',
    image: '/assets/hero/automation_bg.png',
    icon: GitBranch,
    glow: 'from-cyan-600/30 via-blue-600/20 to-transparent'
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
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = SLIDES[currentIndex];
  const IconComponent = currentSlide.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section 
      className="relative w-full min-h-screen md:h-screen md:max-h-[960px] pt-24 sm:pt-28 pb-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center overflow-hidden bg-[#060911] text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* BACKGROUND AMBIENT GLOW & OVERLAYS - KEEPING NAVBAR STRICTLY Z-50 */}
      <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-radial ${currentSlide.glow} opacity-40 transition-opacity duration-1000`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#060911] via-transparent to-[#060911] opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      </div>

      {/* CENTERED HERO COPY & CTA BUTTONS */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center w-full max-w-4xl z-10 mt-2 sm:mt-4"
      >
        {/* Version Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-md w-max mb-3 sm:mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">FairSplit AI v2.0 Live</span>
        </motion.div>
        
        {/* Main Hero Headline */}
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.08] font-black tracking-tight text-white mb-3 sm:mb-4 drop-shadow-xl">
          Build Smarter Teams.<br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 inline-block py-0.5">Predict Risks.</span>
          <span className="hidden sm:inline"> </span>
          Deliver Faster.
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed font-medium mb-4 sm:mb-6 px-2">
          FairSplit uses Artificial Intelligence to intelligently assign tasks, balance workloads, predict project risks, and help teams deliver projects faster.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Link
            to="/register"
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95"
          >
            Get Started
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#dashboard"
            className="flex items-center gap-2 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/20 shadow-lg hover:scale-105 active:scale-95"
          >
            View Dashboard
          </a>
        </motion.div>
      </motion.div>

      {/* FAIRSPLIT CINEMATIC UI SHOWCASE FRAME - BOUNDED SAFELY WITHIN VIEWPORT */}
      <div className="w-full max-w-4xl lg:max-w-5xl z-20 flex flex-col items-center my-auto">
        <div className="w-full rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0B0F1A] backdrop-blur-xl flex flex-col">
          
          {/* Mockup Top Browser Bar */}
          <div className="bg-[#0E1424] px-4 py-2.5 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>

            {/* URL & Slide Selector Bar */}
            <div className="bg-[#060911] text-gray-300 text-[11px] font-mono px-3.5 py-1 rounded-md flex items-center gap-2 border border-white/10 max-w-xs sm:max-w-md truncate">
              <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate text-blue-400">app.fairsplit.ai/{currentSlide.id}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                title={isPaused ? 'Resume Auto-Rotate' : 'Pause Auto-Rotate'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-blue-400" /> : <Pause className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <span className="text-[10px] font-mono font-bold text-blue-400 hidden sm:inline">
                0{currentIndex + 1}/0{SLIDES.length}
              </span>
            </div>
          </div>

          {/* Feature Pills Navigation */}
          <div className="bg-[#080C16] border-b border-white/10 px-3 py-1.5 overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-1.5">
            {SLIDES.map((slide, idx) => {
              const TabIcon = slide.icon;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{slide.title}</span>
                </button>
              );
            })}
          </div>

          {/* Display Stage with Bounded Aspect Ratio & Object Fit */}
          <div className="relative w-full h-[220px] sm:h-[300px] md:h-[340px] lg:h-[380px] bg-[#060911] overflow-hidden flex items-center justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-2"
              >
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title} 
                  loading="lazy"
                  className="w-full h-full object-cover object-top rounded-lg filter brightness-[0.95] contrast-[1.05]"
                />
                
                {/* Vignette Overlay Mask for UI Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-transparent opacity-60"></div>
              </motion.div>
            </AnimatePresence>

            {/* Left & Right Chevron Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 hover:bg-blue-600 text-gray-300 hover:text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
              title="Previous Screen"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 hover:bg-blue-600 text-gray-300 hover:text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
              title="Next Screen"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Bar with Active Feature Tagline & Pagination Dots */}
          <div className="bg-[#0E1424] px-4 py-2.5 border-t border-white/10 flex items-center justify-between z-20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-gray-300 font-medium truncate">
                {currentSlide.tagline}
              </span>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-blue-500 shadow-sm shadow-blue-500/50'
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
