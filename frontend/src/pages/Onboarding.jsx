import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle';
import ProgressStepper from '../components/onboarding/ProgressStepper';
import ProfessionalStep from '../components/onboarding/ProfessionalStep';
import SkillsStep from '../components/onboarding/SkillsStep';
import AvailabilityStep from '../components/onboarding/AvailabilityStep';
import PreferencesStep from '../components/onboarding/PreferencesStep';
import CompletionStep from '../components/onboarding/CompletionStep';
import NavigationButtons from '../components/onboarding/NavigationButtons';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Shared state for backend integration later
  const [formData, setFormData] = useState({
    professional: {
      role: '',
      experience: '',
      department: ''
    },
    skills: [], // Array of objects: { name: 'React', proficiency: 'Advanced' }
    availability: {
      hoursPerWeek: 40,
      preferredTime: []
    },
    preferences: {
      preferredRole: '',
      domains: []
    }
  });

  const updateFormData = (stepKey, data) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data }
    }));
  };
  
  const updateSkillsData = (skills) => {
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfessionalStep 
            data={formData.professional} 
            updateData={(data) => updateFormData('professional', data)} 
          />
        );
      case 2:
        return (
          <SkillsStep 
            skills={formData.skills} 
            updateSkills={updateSkillsData} 
          />
        );
      case 3:
        return (
          <AvailabilityStep 
            data={formData.availability} 
            updateData={(data) => updateFormData('availability', data)} 
          />
        );
      case 4:
        return (
          <PreferencesStep 
            data={formData.preferences} 
            updateData={(data) => updateFormData('preferences', data)} 
          />
        );
      case 5:
        return <CompletionStep onEditProfile={() => setCurrentStep(1)} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    // Add basic validation if needed before allowing Next
    return true; 
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans flex relative transition-colors duration-300">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Centered Onboarding Card */}
      <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[800px] flex flex-col">
          
          <div className="text-center mb-8 sm:mb-10 mt-6 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Complete Your Profile</h1>
            <p className="text-base text-text-secondary max-w-lg mx-auto">
              Help FairSplit understand your skills and preferences to build smarter teams.
            </p>
          </div>

          <div className="bg-white dark:bg-surface border border-border rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"></div>
            
            {/* Header / Stepper (Hidden on completion) */}
            {currentStep < 5 && (
              <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-border/50 bg-surface-2/30 dark:bg-black/10">
                <ProgressStepper currentStep={currentStep} />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 p-6 sm:p-10 relative overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 flex flex-col"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / Navigation (Hidden on completion) */}
            {currentStep < 5 && (
              <div className="px-6 sm:px-10 py-6 border-t border-border/50 bg-surface-2/30 dark:bg-black/10">
                <NavigationButtons 
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onSkip={nextStep}
                  isValid={isStepValid()}
                />
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
