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
    id: 'collaboration',
    title: 'AI Team Collaboration',
    tagline: 'Intelligent Team Formation & Dynamic Skill Matching',
    image: '/assets/hero/collaboration_bg.png',
    icon: Users,
    glow: 'from-blue-600/30 via-indigo-600/20 to-transparent'
  },
  {
    id: 'allocation',
    title: 'Smart Task Allocation',
    tagline: 'Automated Workload Capacity & Skill Optimization',
    image: '/assets/hero/allocation_bg.png',
    icon: Cpu,
    glow: 'from-purple-600/30 via-indigo-600/20 to-transparent'
  },
  {
    id: 'risk',
    title: 'Predictive Risk Analysis',
    tagline: 'ML-Powered Delivery Risk & Bottleneck Forecasting',
    image: '/assets/hero/risk_bg.png',
    icon: AlertTriangle,
    glow: 'from-amber-600/30 via-red-600/20 to-transparent'
  },
  {
    id: 'analytics',
    title: 'Project Analytics',
    tagline: 'Executive KPIs, Completion Velocity & Capacity Metrics',
    image: '/assets/hero/analytics_bg.png',
    icon: BarChart2,
    glow: 'from-emerald-600/30 via-teal-600/20 to-transparent'
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    tagline: 'Seamless Pipeline Orchestration & Reduced Management Overhead',
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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section 
      className="pt-32 pb-20 flex flex-col items-center justify-center relative min-h-screen overflow-hidden group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* CINEMATIC FULL-SIZE BACKDROP VISUALS WITH KEN BURNS SLOW ZOOM */}
      <div className="absolute inset-0 overflow-hidden -z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title} 
              loading="lazy"
              className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.1]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Blue/Indigo Accent Glow Backdrop */}
        <div className={`absolute inset-0 bg-gradient-radial ${currentSlide.glow} opacity-60 transition-opacity duration-1000 -z-10`}></div>
      </div>

      {/* MULTI-LAYER DARK OVERLAYS & GRADIENT VIGNETTE FOR 100% TYPOGRAPHY READABILITY */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Dark Overlay (40-60%) */}
        <div className="absolute inset-0 bg-black/55 dark:bg-black/65 backdrop-blur-[2px]"></div>

        {/* Soft Radial Center Backdrop Mask for Headline Contrast */}
        <div className="absolute inset-0 bg-gradient-radial from-black/80 via-black/50 to-transparent"></div>

        {/* Top & Bottom Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-transparent to-[#0A0A0A]"></div>
      </div>

      {/* CONTENT CONTAINER - HERO HEADLINE, TYPOGRAPHY & CTAS STAY FIXED */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center flex-grow justify-center z-20">
      
        {/* Centered Copy */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center w-full max-w-4xl mt-6"
        >
          {/* Version Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 dark:bg-surface/80 border border-white/20 backdrop-blur-md w-max mb-8 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">FairSplit AI v2.0 Live</span>
          </motion.div>
          
          {/* Main Hero Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1] font-black tracking-tighter text-white mb-8 drop-shadow-2xl">
            Build Smarter Teams.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 inline-block py-1">Predict Risks.</span><br/>
            Deliver Faster.
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed font-medium drop-shadow-md">
            FairSplit uses Artificial Intelligence to intelligently assign tasks, balance workloads, predict project risks, and help teams deliver projects faster.
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95"
            >
              Get Started
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#dashboard"
              className="flex items-center gap-2 text-white px-8 py-4 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/20 shadow-lg hover:scale-105 active:scale-95"
            >
              View Dashboard
            </a>
          </motion.div>

          {/* ACTIVE CINEMATIC FEATURE BANNER */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-xl mx-auto p-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left border-l-4 border-l-blue-500"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">{currentSlide.title}</span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Feature Showcase
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 truncate mt-0.5">
                  {currentSlide.tagline}
                </p>
              </div>
            </div>

            {/* Slide Index Badge & Play/Pause */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title={isPaused ? 'Resume Auto-Rotate' : 'Pause Auto-Rotate'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-blue-400" /> : <Pause className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <span className="text-xs font-mono font-bold text-blue-400">
                0{currentIndex + 1} / 0{SLIDES.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FEATURE SELECTOR TABS & NAVIGATION DOTS AT BOTTOM OF HERO */}
      <div className="w-full max-w-5xl mx-auto px-4 mt-8 z-20 flex flex-col items-center gap-4">
        
        {/* Navigation Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-black/50 p-2 rounded-2xl border border-white/10 backdrop-blur-md max-w-full overflow-x-auto">
          {SLIDES.map((slide, idx) => {
            const TabIcon = slide.icon;
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 border border-blue-400/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="whitespace-nowrap">{slide.title}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Dots Indicator */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-blue-500 shadow-md shadow-blue-500/50'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CHEVRON ARROW NAVIGATION AT HERO EDGES */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-blue-600 text-gray-300 hover:text-white border border-white/20 transition-all opacity-70 hover:opacity-100 backdrop-blur-md shadow-2xl cursor-pointer"
        title="Previous Feature Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-blue-600 text-gray-300 hover:text-white border border-white/20 transition-all opacity-70 hover:opacity-100 backdrop-blur-md shadow-2xl cursor-pointer"
        title="Next Feature Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

    </section>
  );
};

export default Hero;
