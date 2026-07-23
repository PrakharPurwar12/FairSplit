import React from 'react';

const AuthDivider = () => {
  return (
    <div className="relative flex items-center my-4">
      <div className="flex-grow border-t border-border"></div>
      <span className="flex-shrink-0 mx-4 text-xs font-semibold text-text-muted uppercase tracking-widest">
        or continue with
      </span>
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
};

export default AuthDivider;
