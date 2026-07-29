import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Briefcase, Code, Clock, ShieldCheck } from 'lucide-react';
import InvitationService from '../services/invitation.service';
import { useAuth } from '../context/AuthContext';
import SocialButtons from '../components/auth/SocialButtons';

const InvitePreview = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await InvitationService.getInvitationPreview(token);
        setInvitation(data);
      } catch (err) {
        console.error('Failed to load invitation preview:', err);
        setError(err.response?.data?.error || err.response?.data?.detail || 'This invitation is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPreview();
    }
  }, [token]);

  const handleAccept = async () => {
    if (!isAuthenticated) {
      // Store token in localStorage to return after login
      localStorage.setItem('pending_invite_token', token);
      navigate(`/login?redirect=/invite/${token}`);
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const res = await InvitationService.acceptInvitation(token);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/projects/${res.project}`, { replace: true });
      }, 1200);
    } catch (err) {
      console.error('Accept invitation error:', err);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to accept invitation. Please check your account email.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#111] p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-text-secondary">Loading project invitation details...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#111] p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#161616] border border-border shadow-xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-danger mx-auto" />
          <h2 className="text-xl font-bold text-text">Invitation Invalid</h2>
          <p className="text-sm text-text-secondary">{error}</p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-block px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm transition-all shadow-sm hover:bg-primary-hover"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMatchingEmail = isAuthenticated && user?.email?.toLowerCase() === invitation?.email?.toLowerCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0E0E10] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-[#161618] border border-gray-200/80 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-primary-light mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FairSplit Team Invitation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            You're Invited!
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto">
            Join <span className="font-bold text-white">{invitation?.project_title}</span> to collaborate on task allocation and workload balance.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-danger/10 text-danger text-sm border border-danger/20 rounded-xl flex items-center gap-3 font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inviter & Project Details Card */}
          <div className="bg-slate-50 dark:bg-[#1C1C1E] rounded-2xl p-5 border border-gray-200/60 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                {invitation?.invited_by_name?.charAt(0) || 'M'}
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Invited By</p>
                <p className="text-sm font-bold text-text">{invitation?.invited_by_name || invitation?.invited_by_username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Assigned Role</span>
                </div>
                <p className="text-sm font-bold text-text capitalize">{invitation?.role || 'Team Member'}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-warning" />
                  <span>Expires In</span>
                </div>
                <p className="text-sm font-bold text-text">
                  {invitation?.expires_at ? new Date(invitation.expires_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '7 Days'}
                </p>
              </div>
            </div>

            {/* Target Skills */}
            {invitation?.skills && invitation.skills.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium mb-2">
                  <Code className="w-3.5 h-3.5 text-secondary" />
                  <span>Target Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {invitation.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personal Message Callout */}
          {invitation?.personal_message && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Note from Manager</p>
              <p className="text-sm italic text-text-secondary">"{invitation.personal_message}"</p>
            </div>
          )}

          {/* Actions & Buttons */}
          {success ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">Invitation Accepted!</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Redirecting to project workspace...</p>
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-3">
              {!isMatchingEmail && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium">
                  Logged in as <strong>{user?.email}</strong>. This invitation was sent to <strong>{invitation?.email}</strong>.
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={accepting}
                onClick={handleAccept}
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {accepting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Joining Project...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Accept Invitation & Join Project</span>
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Sign in to accept this invitation
              </div>

              <SocialButtons />

              <div className="flex gap-3 pt-2">
                <Link
                  to={`/login?redirect=/invite/${token}`}
                  className="flex-1 py-3 text-center bg-primary text-white font-bold rounded-xl text-sm transition-colors hover:bg-primary-hover"
                >
                  Sign In
                </Link>
                <Link
                  to={`/register?redirect=/invite/${token}`}
                  className="flex-1 py-3 text-center bg-surface border border-border text-text font-bold rounded-xl text-sm transition-colors hover:bg-border/50"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InvitePreview;
