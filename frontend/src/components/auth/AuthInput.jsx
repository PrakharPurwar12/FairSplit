import React from 'react';

const AuthInput = ({ label, id, type = 'text', error, ...props }) => {
  return (
    <div className="flex flex-col relative w-full">
      <div className="relative group">
        <input
          id={id}
          type={type}
          placeholder=" "
          className={`peer w-full h-[52px] px-4 pt-5 pb-1 bg-white dark:bg-surface-2 border ${
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
      </div>
      {error && (
        <span className="text-xs text-danger font-medium mt-1.5 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default AuthInput;
