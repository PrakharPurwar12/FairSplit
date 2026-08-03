import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import SocialButtons from '../components/auth/SocialButtons';
import AuthDivider from '../components/auth/AuthDivider';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import AuthService from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

const StrengthIndicator = ({ met, text }) => (
  <div className={`flex items-center gap-1.5 text-xs font-medium ${met ? 'text-success' : 'text-text-muted transition-colors'}`}>
    <div className={`flex items-center justify-center w-3.5 h-3.5 rounded-full ${met ? 'bg-success/20 text-success' : 'bg-surface-3 text-text-muted'}`}>
      {met && <Check size={10} strokeWidth={3} />}
    </div>
    {text}
  </div>
);

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('manager');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Carry the ?redirect= param forward so that after login the user
  // is returned to the invitation page, not the dashboard.
  const redirectParam = searchParams.get('redirect');

  useEffect(() => {
    if (isAuthenticated) {
      const destination = redirectParam || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectParam]);

  // Basic frontend validation & password strength
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFirstNameValid = firstName.length >= 2;
  const isLastNameValid = lastName.length >= 2;
  const isUsernameValid = username.length >= 3;
  const isPasswordMatch = password === confirmPassword && password.length > 0;

  const isValid = isEmailValid && hasMinLength && hasNumber && hasSpecial && isFirstNameValid && isLastNameValid && isUsernameValid && isPasswordMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);

    try {
      await AuthService.register({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        role
      });
      
      // Registration succeeded — take the user to login.
      // If there is a pending invite redirect, preserve it so that after
      // the user logs in they land back on the invitation page.
      const loginPath = redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login';
      navigate(loginPath);
    } catch (err) {
      let errorMsg = 'Registration failed.';
      if (err.response?.status === 429) {
        errorMsg = err.response.data?.detail || 'Too many registration attempts. Please wait a minute before trying again.';
      } else if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else {
          const errors = Object.entries(err.response.data).map(([field, msgs]) => {
            const fieldName = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const msgStr = Array.isArray(msgs) ? msgs.join(' ') : msgs;
            return `${fieldName}: ${msgStr}`;
          });
          errorMsg = errors.join(' | ');
        }
      } else if (err.request) {
        errorMsg = 'Network error. Please check your internet connection.';
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
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

        <div className="flex gap-4">
          <AuthInput
            label="First Name"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <AuthInput
            label="Last Name"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <AuthInput
          label="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <div className="flex flex-col relative w-full">
          <div className="relative group">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="peer w-full h-[52px] px-4 pt-5 pb-1 bg-white dark:bg-surface-2 border border-border focus:border-primary focus:ring-primary/20 rounded-xl focus:ring-4 outline-none transition-all text-text text-base shadow-sm dark:shadow-none appearance-none"
            >
              <option value="manager">Project Leader</option>
              <option value="member">Team Member</option>
            </select>
            <label
              htmlFor="role"
              className="absolute left-4 top-1.5 text-xs font-semibold text-text-muted pointer-events-none"
            >
              Join As
            </label>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : ""}
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
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.01, y: isLoading ? 0 : -1 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
