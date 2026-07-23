import React from 'react';
import { motion } from 'framer-motion';

const NavigationButtons = ({ currentStep, totalSteps, onNext, onPrev, onSkip, isValid }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        {currentStep > 1 && currentStep < totalSteps && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrev}
            className="h-12 px-6 rounded-xl font-semibold text-text-secondary hover:text-text transition-colors flex items-center justify-center bg-transparent hover:bg-surface-2"
          >
            Back
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentStep < totalSteps - 1 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSkip}
            className="h-12 px-6 rounded-xl font-semibold text-text-muted hover:text-text-secondary transition-colors flex items-center justify-center"
          >
            Skip for now
          </motion.button>
        )}

        <motion.button
          whileHover={isValid ? { scale: 1.02, y: -1 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="h-12 px-8 rounded-xl font-semibold text-white bg-primary hover:bg-primary-hover transition-all shadow-[0_4px_14px_0_rgba(79,140,255,0.3)] hover:shadow-[0_6px_20px_rgba(79,140,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
        >
          {currentStep === totalSteps - 1 ? 'Complete Profile' : 'Continue'}
        </motion.button>
      </div>
    </div>
  );
};

export default NavigationButtons;
