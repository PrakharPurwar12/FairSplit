import { motion } from 'framer-motion';
import { FooterLinks } from './FooterLinks';
import { FooterBottom } from './FooterBottom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative subtle background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-50/50 blur-[100px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row gap-16 justify-between">
          
          {/* Brand Section */}
          <div className="lg:w-1/3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="text-white font-bold text-lg leading-none">F</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-[#111827]">FairSplit</span>
            </div>
            <p className="text-[#6B7280] leading-relaxed text-sm max-w-sm">
              AI-powered project management platform that intelligently forms teams, predicts risks, optimizes workloads, and helps teams deliver projects faster.
            </p>
          </div>

          {/* Links Section */}
          <div className="lg:w-2/3 flex justify-end">
            <FooterLinks />
          </div>
          
        </div>

        <FooterBottom />
      </motion.div>
    </footer>
  );
};
