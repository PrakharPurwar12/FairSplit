import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import FooterLinks from './FooterLinks';
import FooterBottom from './FooterBottom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 dark:border-border pt-20 pb-10 relative overflow-hidden bg-surface dark:bg-bg z-10 transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-50/50 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row gap-16 justify-between">
          
          <div className="lg:w-1/3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-primary dark:to-accent rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Network className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-text">FairSplit</span>
            </div>
            <p className="text-gray-600 dark:text-text-secondary leading-relaxed text-sm max-w-sm font-medium dark:font-light">
              AI-powered project management platform that intelligently forms teams, predicts risks, optimizes workloads, and helps teams deliver projects faster.
            </p>
          </div>

          <div className="lg:w-2/3 flex justify-end">
            <FooterLinks />
          </div>
          
        </div>

        <FooterBottom />
      </motion.div>
    </footer>
  );
};

export default Footer;
