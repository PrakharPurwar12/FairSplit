import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Professional' },
  { id: 2, name: 'Skills' },
  { id: 3, name: 'Availability' },
  { id: 4, name: 'Preferences' }
];

const ProgressStepper = ({ currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full hidden sm:block"></div>
        
        {/* Active Line (Animated) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full hidden sm:block transition-all duration-500 ease-out" 
             style={{ width: `${((Math.min(currentStep, 4) - 1) / 3) * 100}%` }}></div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                  borderColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  color: isCompleted || isActive ? '#ffffff' : 'var(--color-text-muted)',
                  scale: isActive ? 1.1 : 1
                }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-300 ${
                  isPending ? 'bg-surface dark:bg-surface-2' : ''
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
              </motion.div>
              <span className={`text-xs font-semibold hidden sm:block ${
                isActive ? 'text-text' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Step Indicator */}
      <div className="mt-4 text-center sm:hidden">
        <span className="text-sm font-bold text-text">Step {Math.min(currentStep, 4)} of 4:</span>
        <span className="text-sm font-medium text-text-secondary ml-1">{steps[Math.min(currentStep, 4) - 1]?.name}</span>
      </div>
    </div>
  );
};

export default ProgressStepper;
