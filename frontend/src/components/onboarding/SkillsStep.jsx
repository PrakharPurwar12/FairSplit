import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';

const availableSkills = [
  'React', 'Node.js', 'Django', 'Python', 'Machine Learning', 
  'SQL', 'Java', 'C++', 'Data Science', 'UI/UX Design', 
  'DevOps', 'AWS', 'Docker', 'TypeScript', 'GraphQL'
];

const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SkillsStep = ({ skills, updateSkills }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !skills.some(s => s.name === skill)
  );

  const addSkill = (skillName) => {
    updateSkills([...skills, { name: skillName, proficiency: 'Intermediate' }]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const removeSkill = (skillName) => {
    updateSkills(skills.filter(s => s.name !== skillName));
  };

  const updateProficiency = (skillName, level) => {
    updateSkills(skills.map(s => 
      s.name === skillName ? { ...s, proficiency: level } : s
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text mb-1">Skills & Expertise</h2>
        <p className="text-sm text-text-secondary">Add your top skills and rate your proficiency.</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 z-20">
        <div className="relative flex items-center group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search for a skill..."
            style={{ paddingLeft: '44px' }}
            className="w-full h-[52px] pr-4 bg-white dark:bg-surface-2 border border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text text-sm shadow-sm dark:shadow-none"
          />
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && searchTerm && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)} 
              ></div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-[60px] max-h-[240px] overflow-y-auto bg-white dark:bg-surface border border-border rounded-xl shadow-lg z-30 p-2"
              >
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-text hover:bg-surface-2 dark:hover:bg-surface-3 transition-colors flex items-center justify-between group"
                    >
                      {skill}
                      <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Add</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-text-muted text-center">
                    No skills found matching "{searchTerm}"
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Skills List */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {skills.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-border rounded-2xl p-8">
            <Search size={32} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">Search and select your skills above</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-surface-2 border border-border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-text text-sm">{skill.name}</span>
                    <button 
                      onClick={() => removeSkill(skill.name)}
                      className="text-text-muted hover:text-danger transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {proficiencies.map(level => (
                      <button
                        key={level}
                        onClick={() => updateProficiency(skill.name, level)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          skill.proficiency === level 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-surface dark:bg-surface-3 text-text-secondary border border-transparent hover:border-border'
                        }`}
                      >
                        {skill.proficiency === level && <Check size={12} strokeWidth={3} />}
                        {level}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsStep;
