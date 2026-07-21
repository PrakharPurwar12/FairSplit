import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero } from '../components/landing/hero/Hero';

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
      <nav className="absolute top-0 w-full z-50 bg-white/50 backdrop-blur-xl border-b border-white/20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight">FairSplit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#6B7280]">
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How It Works</a>
            <a href="#modules" className="hover:text-[#111827] transition-colors">Modules</a>
            <Link to="/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-[#111827] text-white px-4 py-2 rounded-full hover:bg-black transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <Hero />
      
      {/* Temporary spacing to demonstrate scrolling for the next section if needed */}
      <section id="features" className="min-h-screen bg-white py-20 px-6 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover the Features</h2>
          <p className="text-gray-500">Scroll down for more information...</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
