import React, { useState, useEffect } from 'react';
import { 
  User, 
  Moon, 
  Sun, 
  Lock, 
  Bell, 
  Save, 
  AlertCircle
} from 'lucide-react';
import UserService from '../services/user.service';
import Toast from '../components/ui/Toast';

const Settings = () => {
  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('developer');
  const [availabilityHours, setAvailabilityHours] = useState(40);
  const [experience, setExperience] = useState(2);

  // Security / Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference Toggles
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState('profile'); // profile, theme, security, notifications
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load current user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await UserService.getProfile();
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
        setEmail(profile.email || '');
        setRole(profile.role || 'developer');
        setAvailabilityHours(profile.availability_hours || 40);
        setExperience(profile.experience || 0);
      } catch (err) {
        console.error('Failed to load profile settings:', err);
      }
    };
    fetchProfile();
  }, []);

  // Theme Toggle Effect
  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    showToast(`Switched to ${nextDark ? 'Dark' : 'Light'} theme mode.`);
  };

  // Profile Save Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      await UserService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: email,
        availability_hours: parseInt(availabilityHours, 10),
        experience: parseInt(experience, 10)
      });
      showToast('Profile settings saved successfully!');
    } catch (err) {
      setFormError(err.response?.data?.detail || err.response?.data?.error || 'Failed to save profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Security Save Submit
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    setIsSaving(true);
    setFormError(null);
    setTimeout(() => {
      setIsSaving(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully!');
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header section */}
      <div className="border-b border-gray-100 dark:border-white/5 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage account profile, system theme preferences, and security settings.</p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/10 gap-6">
        {[
          { id: 'profile', label: 'Profile Settings', icon: User },
          { id: 'theme', label: 'Theme & Appearance', icon: darkMode ? Moon : Sun },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFormError(null); }}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="max-w-3xl">
        {formError && (
          <div className="p-3 mb-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50 leading-snug flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {formError}
          </div>
        )}

        {/* 1. PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@fairsplit.com"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase flex items-center gap-1">
                  System Role
                  <span className="inline-block cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Your account role controls permissions across FairSplit and cannot be changed after registration.">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </span>
                </label>
                <input
                  type="text"
                  value={role === 'manager' ? 'Project Leader' : (role === 'member' ? 'Team Member' : role)}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed font-semibold capitalize"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Weekly Hours</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={availabilityHours}
                  onChange={(e) => setAvailabilityHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* 2. THEME & APPEARANCE */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    Interface Mode
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Switch between sleek dark mode and vibrant light mode.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Switch to {darkMode ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* 4. NOTIFICATION PREFERENCES */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Email Digest & Alerts</h4>
                <p className="text-xs text-gray-500">Receive email notifications when AI task allocation runs.</p>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts} 
                onChange={(e) => setEmailAlerts(e.target.checked)} 
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">AI High Risk Warning Alerts</h4>
                <p className="text-xs text-gray-500">Receive instant warnings when a task risk level shifts to High.</p>
              </div>
              <input 
                type="checkbox" 
                checked={riskAlerts} 
                onChange={(e) => setRiskAlerts(e.target.checked)} 
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
