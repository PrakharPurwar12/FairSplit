import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero } from '../components/landing/hero/Hero';
import { Features } from '../components/landing/features/Features';
import { HowItWorks } from '../components/landing/howItWorks/HowItWorks';
import { Modules } from '../components/landing/modules/Modules';
import { Footer } from '../components/landing/footer/Footer';
import { navigationData } from '../data/navigationData';

const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden lg:block"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div 
        className="absolute w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      />
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  
  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    // If it's an anchor link
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      
      if (element) {
        const navbarHeight = document.querySelector('nav').offsetHeight;
        const y = element.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    } else {
      // For normal route links like /dashboard
      navigate(href);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#111827] font-sans relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      <MouseGlow />
      
      {/* Animated Background Glow Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.7, 0.8, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] z-0"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.6, 0.7, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 -right-20 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] z-0"
      />

      {/* Navbar (Kept simple as per original Landing.jsx) */}
      <nav className="absolute top-0 w-full z-50 bg-surface0 backdrop-blur-xl border-b border-white/20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center">
              <img src="/logo.png" alt="FairSplit Logo" className="h-8 w-auto object-contain" />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#6B7280]">
            {navigationData.map((item) => (
              <a 
                key={item.id} 
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-[#111827] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a 
              href="/dashboard"
              onClick={(e) => handleNavClick(e, '/dashboard')}
              className="hover:text-[#111827] transition-colors"
            >
              Dashboard
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-[#111827] text-primary px-4 py-2 rounded-full hover:bg-black transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <Modules />
      <Footer />
    </div>
  );
};

export default Home;
