import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import SocialButtons from '../components/auth/SocialButtons';
import AuthDivider from '../components/auth/AuthDivider';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Basic frontend validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length > 0;
  const isValid = isEmailValid && isPasswordValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setError('');
    setIsLoading(true);

    // Simulated API Call
    setTimeout(() => {
      if (email === 'admin@fairsplit.com' && password === 'admin123') {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try admin@fairsplit.com / admin123');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }} 
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="px-4 py-3 rounded-xl bg-danger/10 text-danger text-sm border border-danger/20 font-medium overflow-hidden"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AuthInput
          label="Email address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-surface accent-primary cursor-pointer transition-colors"
              />
              <span className="text-xs font-semibold text-text-secondary group-hover:text-text transition-colors">
                Remember me
              </span>
            </label>
            <a href="#" className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !isValid}
          whileHover={{ scale: (isLoading || !isValid) ? 1 : 1.01, y: (isLoading || !isValid) ? 0 : -1 }}
          whileTap={{ scale: (isLoading || !isValid) ? 1 : 0.98 }}
          className="w-full h-[52px] mt-1 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(79,140,255,0.3)] hover:shadow-[0_6px_20px_rgba(79,140,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center"
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-sm font-bold">
              <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="text-[15px]">Sign In</span>
          )}
        </motion.button>

        <AuthDivider />
        <SocialButtons />

        <div className="mt-2 text-center text-xs font-medium text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-text hover:text-primary transition-colors">
            Create one now
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
