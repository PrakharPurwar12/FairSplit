import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import SocialButtons from '../components/auth/SocialButtons';
import AuthDivider from '../components/auth/AuthDivider';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const StrengthIndicator = ({ met, text }) => (
  <div className={`flex items-center gap-1.5 text-xs font-medium ${met ? 'text-success' : 'text-text-muted transition-colors'}`}>
    <div className={`flex items-center justify-center w-3.5 h-3.5 rounded-full ${met ? 'bg-success/20 text-success' : 'bg-surface-3 text-text-muted'}`}>
      {met && <Check size={10} strokeWidth={3} />}
    </div>
    {text}
  </div>
);

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Basic frontend validation & password strength
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = name.length > 2;

  const isValid = isEmailValid && hasMinLength && hasNumber && hasSpecial && isNameValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setError('');
    setIsLoading(true);

    // Simulated API Call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding');
    }, 800);
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join FairSplit to build smarter teams"
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
          label="Full Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          {/* Password strength indicators */}
          {password.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-3 px-1 mt-1 flex-wrap"
            >
              <StrengthIndicator met={hasMinLength} text="8+ chars" />
              <StrengthIndicator met={hasNumber} text="1 number" />
              <StrengthIndicator met={hasSpecial} text="1 symbol" />
            </motion.div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !isValid}
          whileHover={{ scale: (isLoading || !isValid) ? 1 : 1.01, y: (isLoading || !isValid) ? 0 : -1 }}
          whileTap={{ scale: (isLoading || !isValid) ? 1 : 0.98 }}
          className="w-full h-[52px] mt-2 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(79,140,255,0.3)] hover:shadow-[0_6px_20px_rgba(79,140,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center"
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-sm font-bold">
              <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            <span className="text-[15px]">Create Account</span>
          )}
        </motion.button>

        <AuthDivider />
        <SocialButtons />

        <div className="mt-2 text-center text-xs font-medium text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-text hover:text-primary transition-colors">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
