import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import SocialButtons from '../components/auth/SocialButtons';
import AuthDivider from '../components/auth/AuthDivider';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Basic frontend validation
  const isUsernameValid = username.trim().length > 0;
  const isPasswordValid = password.length > 0;
  const isValid = isUsernameValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      let errorMsg = 'Invalid username or password.';
      if (err.response?.status === 429) {
        errorMsg = err.response.data?.detail || 'Too many login attempts. Please wait a minute before trying again.';
      } else if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else {
          errorMsg = Object.values(err.response.data).flat().join(' ');
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
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            <button
              type="button"
              onClick={() => setError('Password reset functionality is disabled. Please contact your system administrator.')}
              className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Forgot password?
            </button>
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
