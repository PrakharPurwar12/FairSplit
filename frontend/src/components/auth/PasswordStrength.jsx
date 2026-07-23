import React from 'react';

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: 'Empty', color: 'bg-border' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, text: 'Weak', color: 'bg-danger text-danger' };
    if (score === 2 || score === 3) return { score, text: 'Medium', color: 'bg-warning text-warning' };
    return { score, text: 'Strong', color: 'bg-success text-success' };
  };

  const { score, text, color } = getStrength(password);
  const bgColor = color.split(' ')[0];
  const textColor = color.split(' ')[1];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-text-secondary font-medium">Password strength</span>
        <span className={`text-xs font-bold ${password ? 'opacity-100' : 'opacity-0'} ${textColor}`}>
          {text}
        </span>
      </div>
      <div className="flex gap-1.5 h-1.5">
        <div className={`flex-1 rounded-full transition-colors duration-300 ${score > 0 ? bgColor : 'bg-border dark:bg-surface-2'}`}></div>
        <div className={`flex-1 rounded-full transition-colors duration-300 ${score > 1 ? bgColor : 'bg-border dark:bg-surface-2'}`}></div>
        <div className={`flex-1 rounded-full transition-colors duration-300 ${score > 3 ? bgColor : 'bg-border dark:bg-surface-2'}`}></div>
      </div>
    </div>
  );
};

export default PasswordStrength;
