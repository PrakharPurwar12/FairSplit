import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompletionStep = ({ onEditProfile }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1 
        }}
        className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-8 relative"
      >
        <div className="absolute inset-0 bg-success/20 rounded-full animate-ping opacity-20"></div>
        <Sparkles size={40} />
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-text mb-4"
      >
        You're Ready!
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-text-secondary text-lg max-w-sm mb-10"
      >
        Your profile is now ready.<br/>
        FairSplit can now build smarter teams and optimize workloads using your profile.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full h-[52px] bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(79,140,255,0.3)] hover:shadow-[0_6px_20px_rgba(79,140,255,0.25)]"
        >
          Go to Dashboard
        </button>
        
        <button
          onClick={onEditProfile}
          className="w-full h-[52px] bg-surface hover:bg-surface-2 text-text font-semibold rounded-xl border border-border transition-colors"
        >
          Edit Profile
        </button>
      </motion.div>

    </div>
  );
};

export default CompletionStep;
