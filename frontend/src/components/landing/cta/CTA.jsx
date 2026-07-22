import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-32 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-card border border-gray-100 dark:border-border rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none"
        >
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-gray-50/50 dark:from-primary/5 to-transparent pointer-events-none"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-50/80 dark:bg-accent/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-50/80 dark:bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-text mb-6 tracking-tight">
              Ready to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-primary dark:to-info">Smarter Teams?</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-text-secondary font-medium dark:font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience AI-powered project management with intelligent task allocation, workload optimization, and risk prediction.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-primary text-white text-sm font-bold rounded-full hover:bg-black dark:hover:bg-primary-hover transition-all shadow-md hover:shadow-lg dark:shadow-none hover:scale-105 duration-300"
              >
                Get Started
              </Link>
              <a
                href="#dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-surface text-gray-700 dark:text-text text-sm font-bold rounded-full hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors border border-gray-200 dark:border-border shadow-sm dark:shadow-none"
              >
                Explore Dashboard
              </a>
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
