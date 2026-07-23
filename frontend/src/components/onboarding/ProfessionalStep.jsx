import React from 'react';
import AuthInput from '../auth/AuthInput';

const ProfessionalStep = ({ data, updateData }) => {
  
  const handleChange = (e) => {
    updateData({ [e.target.id]: e.target.value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text mb-1">Professional Information</h2>
        <p className="text-sm text-text-secondary">Tell us about your current role and experience.</p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        <AuthInput
          label="Current Role"
          id="role"
          value={data.role || ''}
          onChange={handleChange}
          placeholder="e.g. Senior Frontend Engineer"
        />

        <div className="relative group flex flex-col w-full">
          <select
            id="experience"
            value={data.experience || ''}
            onChange={handleChange}
            className={`peer w-full h-[52px] px-4 pt-5 pb-1 bg-white dark:bg-surface-2 border border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text text-base shadow-sm dark:shadow-none appearance-none cursor-pointer ${
              !data.experience ? 'text-transparent' : ''
            }`}
          >
            <option value="" disabled className="text-text-muted">Select level</option>
            <option value="Junior" className="text-text">Junior (0-2 years)</option>
            <option value="Mid-Level" className="text-text">Mid-Level (3-5 years)</option>
            <option value="Senior" className="text-text">Senior (5-8 years)</option>
            <option value="Lead" className="text-text">Lead (8+ years)</option>
            <option value="Executive" className="text-text">Executive / Director</option>
          </select>
          <label
            htmlFor="experience"
            className={`absolute left-4 top-1.5 text-xs font-semibold text-text-muted transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary pointer-events-none ${
              !data.experience ? 'top-4 text-base font-medium' : ''
            }`}
          >
            Experience Level
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        <AuthInput
          label="Department / Team"
          id="department"
          value={data.department || ''}
          onChange={handleChange}
          placeholder="e.g. Product Development"
        />
      </div>
    </div>
  );
};

export default ProfessionalStep;
