import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/navbar/Navbar';
import Hero from '../components/landing/hero/Hero';
import Features from '../components/landing/features/Features';
import HowItWorks from '../components/landing/howItWorks/HowItWorks';
import Modules from '../components/landing/modules/Modules';
import DashboardPreview from '../components/landing/dashboardPreview/DashboardPreview';
import CTA from '../components/landing/cta/CTA';
import Footer from '../components/landing/footer/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-bg text-gray-900 dark:text-text font-sans relative overflow-x-hidden selection:bg-indigo-500/20 dark:selection:bg-primary/20 selection:text-indigo-900 dark:selection:text-text transition-colors duration-300">
      {/* Editorial Spotlight Effect - Dark Mode Only */}
      <div className="hidden dark:block fixed top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-to-br from-info via-accent to-primary rounded-full blur-[120px] -z-10 pointer-events-none opacity-40 mix-blend-screen"></div>


      <Navbar />

      <main className="flex flex-col w-full relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Modules />
        <DashboardPreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
