import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();
  
  const [status, setStatus] = useState('authenticating'); // authenticating, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const storedProvider = localStorage.getItem('oauth_provider') || 'google';

      if (!code) {
        setStatus('error');
        setErrorMessage('Authorization code is missing from callback URL.');
        return;
      }

      if (processedRef.current) return;
      processedRef.current = true;

      try {
        await oauthLogin(storedProvider, code);
        localStorage.removeItem('oauth_provider');

        // If the user arrived from an invitation page, return them there
        // so they can explicitly click Accept Invitation.
        const pendingInviteToken = localStorage.getItem('pending_invite_token');
        const destination = pendingInviteToken
          ? `/invite/${pendingInviteToken}`
          : '/dashboard';
        // Do NOT remove pending_invite_token here; InvitePreview clears it
        // after a successful accept so the user cannot double-accept.

        setStatus('success');
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 800);
      } catch (err) {
        console.error('OAuth Callback Authentication Error:', err);
        setStatus('error');
        setErrorMessage(
          err.response?.data?.error || 
          err.response?.data?.detail || 
          'Authentication failed. Please verify your client credentials and try again.'
        );
      }
    };

    processCallback();
  }, [searchParams, oauthLogin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#111] p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-xl text-center space-y-4">
        {status === 'authenticating' && (
          <div className="space-y-4 py-6">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authenticating OAuth</h2>
              <p className="text-sm text-gray-500 mt-1">Exchanging authorization code and setting up your secure session...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authentication Successful!</h2>
              <p className="text-sm text-gray-500 mt-1">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authentication Failed</h2>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50">
                {errorMessage}
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
