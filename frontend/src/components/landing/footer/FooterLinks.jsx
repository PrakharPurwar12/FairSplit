import React from 'react';
import { navigationData } from '../../../data/navigationData';

const FooterLinks = () => {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const navbarHeight = 64; 
      const y = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const productLinks = [
    { label: "AI Task Allocation", href: "#features" },
    { label: "Risk Prediction", href: "#features" },
    { label: "Analytics", href: "#modules" },
    { label: "Notifications", href: "#modules" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-text mb-4 text-sm tracking-wider uppercase">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-gray-600 dark:text-text-secondary hover:text-indigo-600 dark:hover:text-text transition-colors text-sm font-medium dark:font-light"
            >
              Home
            </a>
          </li>
          {navigationData.map((item) => (
            <li key={item.id}>
              <a 
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-gray-600 dark:text-text-secondary hover:text-indigo-600 dark:hover:text-text transition-colors text-sm font-medium dark:font-light"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/dashboard" className="text-gray-600 dark:text-text-secondary hover:text-indigo-600 dark:hover:text-text transition-colors text-sm font-medium dark:font-light">
              Dashboard
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 dark:text-text mb-4 text-sm tracking-wider uppercase">Product</h3>
        <ul className="space-y-3">
          {productLinks.map((link, idx) => (
            <li key={idx}>
              <a 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-600 dark:text-text-secondary hover:text-indigo-600 dark:hover:text-text transition-colors text-sm font-medium dark:font-light"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-2 md:col-span-1">
        <h3 className="font-bold text-gray-900 dark:text-text mb-4 text-sm tracking-wider uppercase">Contact</h3>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-text-secondary font-medium dark:font-light">
          <li>
            <a href="mailto:support@fairsplit.ai" className="hover:text-indigo-600 dark:hover:text-text transition-colors">
              support@fairsplit.ai
            </a>
          </li>
          <li>India</li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;
