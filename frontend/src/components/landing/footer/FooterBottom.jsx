import React from 'react';

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FooterBottom = () => {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-border flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-500 dark:text-text-muted font-medium dark:font-light">
        &copy; {new Date().getFullYear()} FairSplit. All rights reserved.
      </div>
      
      <div className="text-sm text-gray-500 dark:text-text-muted text-center font-medium dark:font-light">
        Built with React, Django, PostgreSQL & Machine Learning.
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text transition-colors hover:scale-110 transform duration-300"
        >
          <GithubIcon size={20} />
          <span className="sr-only">GitHub</span>
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-text-muted hover:text-[#0A66C2] transition-colors hover:scale-110 transform duration-300"
        >
          <LinkedinIcon size={20} />
          <span className="sr-only">LinkedIn</span>
        </a>
      </div>
    </div>
  );
};

export default FooterBottom;
