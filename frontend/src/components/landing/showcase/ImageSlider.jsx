import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  BarChart2,
  AlertTriangle,
  Cpu,
  Bell,
  UserCircle
} from 'lucide-react';

const SLIDES = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Executive overview of all projects, team metrics, and real-time activity.',
    badge: 'Overview',
    image: '/assets/hero/analytics_dashboard.png',
    icon: LayoutDashboard,
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Organize and track projects with progress, deadlines, and team assignments.',
    badge: 'Management',
    image: '/assets/hero/collaboration_bg.png',
    icon: FolderKanban,
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Kanban boards, priorities, and assignments for every team member.',
    badge: 'Workflow',
    image: '/assets/hero/task_allocation_mock.png',
    icon: ListChecks,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Burndown charts, velocity tracking, and completion trends at a glance.',
    badge: 'Insights',
    image: '/assets/hero/analytics_bg.png',
    icon: BarChart2,
  },
  {
    id: 'risk-prediction',
    title: 'Risk Prediction',
    description: 'ML-powered risk scores, delay forecasts, and burnout warnings.',
    badge: 'AI',
    image: '/assets/hero/risk_analysis_mock.png',
    icon: AlertTriangle,
  },
  {
    id: 'ai-allocation',
    title: 'AI Allocation',
    description: 'Intelligent task distribution based on skills, workload, and availability.',
    badge: 'AI',
    image: '/assets/hero/team_formation_mock.png',
    icon: Cpu,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Real-time alerts for task updates, deadlines, and team activity.',
    badge: 'Updates',
    image: '/assets/hero/automation_bg.png',
    icon: Bell,
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your account, preferences, and personal productivity stats.',
    badge: 'Account',
    image: '/assets/hero/allocation_bg.png',
    icon: UserCircle,
  },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  const slideCount = SLIDES.length;

  const goTo = useCallback((idx) => {
    setCurrentIndex(((idx % slideCount) + slideCount) % slideCount);
  }, [slideCount]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!sliderRef.current?.contains(document.activeElement) && document.activeElement !== sliderRef.current) return;
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  const currentSlide = SLIDES[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <section
      className="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white dark:bg-bg overflow-hidden"
      aria-label="Product showcase"
    >
      {/* Section heading */}
      <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-text mb-3 sm:mb-4"
        >
          See FairSplit in Action
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-text-secondary max-w-xl mx-auto leading-relaxed"
        >
          Explore the core features of FairSplit through real product previews.
        </motion.p>
      </div>

      {/* Slider container */}
      <motion.div
        ref={sliderRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Product screenshots"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-5xl mx-auto outline-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Glass card */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/70 dark:border-border-light bg-white/60 dark:bg-surface/60 backdrop-blur-xl"
          style={{
            boxShadow: 'var(--showcase-shadow)'
          }}
        >
          {/* Thin Mac title bar */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50/90 dark:bg-surface/90 border-b border-gray-200/50 dark:border-border-light">
            <div className="w-[9px] h-[9px] rounded-full bg-[#FF5F57]" aria-hidden="true"></div>
            <div className="w-[9px] h-[9px] rounded-full bg-[#FFBD2E]" aria-hidden="true"></div>
            <div className="w-[9px] h-[9px] rounded-full bg-[#28CA41]" aria-hidden="true"></div>
          </div>

          {/* Content area — image + info side by side on desktop, stacked on mobile */}
          <div className="flex flex-col">
            
            {/* Image viewport */}
            <div
              className="relative w-full bg-gray-100 dark:bg-[#0B1022] overflow-hidden"
              style={{ aspectRatio: '16 / 9' }}
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={`FairSplit ${currentSlide.title} — ${currentSlide.description}`}
                  loading="lazy"
                  draggable={false}
                  initial={{ opacity: 0, x: 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-500 hover:scale-[1.02]"
                />
              </AnimatePresence>

              {/* Minimal edge softening */}
              <div className="absolute inset-x-0 bottom-0 h-[8%] bg-gradient-to-t from-gray-100/50 dark:from-[#0B1022]/50 to-transparent pointer-events-none"></div>

              {/* Navigation arrows */}
              <button
                onClick={prev}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/60 border border-gray-200/50 dark:border-white/10 shadow-md backdrop-blur-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-black/60 border border-gray-200/50 dark:border-white/10 shadow-md backdrop-blur-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom info bar */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 dark:bg-surface/80 border-t border-gray-200/50 dark:border-border-light">
              {/* Slide info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-surface-2 border border-gray-200/50 dark:border-border-light shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-text truncate">{currentSlide.title}</span>
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary">{currentSlide.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-text-muted truncate hidden sm:block">{currentSlide.description}</p>
                </div>
              </div>

              {/* Pagination dots */}
              <div className="flex items-center gap-1.5 shrink-0" role="tablist" aria-label="Slide navigation">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    role="tab"
                    aria-selected={idx === currentIndex}
                    aria-label={`Go to ${slide.title}`}
                    onClick={() => goTo(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 ${
                      idx === currentIndex
                        ? 'w-6 h-2 bg-primary'
                        : 'w-2 h-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/35'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shadow CSS variable for light/dark */}
      <style>{`
        :root { --showcase-shadow: 0 20px 50px -12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02); }
        [data-theme='dark'] { --showcase-shadow: 0 20px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04); }
      `}</style>
    </section>
  );
};

export default ImageSlider;
