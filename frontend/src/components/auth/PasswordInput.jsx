import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ label, id, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col relative w-full">
      <div className="relative group">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder=" "
          className={`peer w-full h-[52px] px-4 pt-5 pb-1 pr-12 bg-white dark:bg-surface-2 border ${
            error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'
          } rounded-xl focus:ring-4 outline-none transition-all text-text text-base shadow-sm dark:shadow-none placeholder-transparent`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 top-1.5 text-xs font-semibold ${
            error ? 'text-danger' : 'text-text-muted'
          } transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:${
            error ? 'text-danger' : 'text-primary'
          } pointer-events-none`}
        >
          {label}
        </label>
        
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span className="text-xs text-danger font-medium mt-1.5 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
