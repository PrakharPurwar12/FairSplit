import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Layers, BrainCircuit, LineChart, Terminal, CheckCircle2 } from 'lucide-react';

const roles = [
  { id: 'Frontend', label: 'Frontend', icon: Code2 },
  { id: 'Backend', label: 'Backend', icon: Server },
  { id: 'Full Stack', label: 'Full Stack', icon: Layers },
  { id: 'Machine Learning', label: 'Machine Learning', icon: BrainCircuit },
  { id: 'Data Science', label: 'Data Science', icon: LineChart },
  { id: 'DevOps', label: 'DevOps', icon: Terminal }
];

const domains = [
  'AI', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Cyber Security', 'Others'
];

const PreferencesStep = ({ data, updateData }) => {
  
  const toggleDomain = (domain) => {
    const current = data.domains || [];
    if (current.includes(domain)) {
      updateData({ domains: current.filter(d => d !== domain) });
    } else {
      updateData({ domains: [...current, domain] });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text mb-1">Preferences</h2>
        <p className="text-sm text-text-secondary">What kind of work excites you the most?</p>
      </div>

      <div className="flex flex-col gap-8 flex-1 overflow-y-auto pr-2 -mr-2">
        
        {/* Preferred Role */}
        <div>
          <h3 className="text-sm font-bold text-text mb-3">Primary Preferred Role</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {roles.map((role) => {
              const isSelected = data.preferredRole === role.id;
              const Icon = role.icon;
              
              return (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateData({ preferredRole: role.id })}
                  className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'bg-white dark:bg-surface-2 border-border hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                  <Icon size={24} className={isSelected ? 'text-primary' : 'text-text-muted'} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-text'}`}>
                    {role.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Interested Domains */}
        <div>
          <h3 className="text-sm font-bold text-text mb-3">Interested Project Domains</h3>
          <div className="flex flex-wrap gap-2.5">
            {domains.map((domain) => {
              const isSelected = data.domains?.includes(domain);
              return (
                <motion.button
                  key={domain}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleDomain(domain)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                    isSelected 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'bg-white dark:bg-surface-2 text-text-secondary border-border hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {domain}
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreferencesStep;
