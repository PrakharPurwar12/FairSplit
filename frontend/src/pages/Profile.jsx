import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Briefcase
} from 'lucide-react';
import UserService from '../services/user.service';
import Toast from '../components/ui/Toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await UserService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl font-extrabold shadow-inner shrink-0">
          {(profile?.username || 'U').substring(0, 2).toUpperCase()}
        </div>

        <div className="space-y-1 text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-bold tracking-tight">@{profile?.username || 'user'}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
              {profile?.role || 'Member'}
            </span>
          </div>
          <p className="text-sm text-blue-100 flex items-center justify-center md:justify-start gap-1.5 pt-1">
            <Mail className="w-4 h-4" /> {profile?.email || 'No email provided'}
          </p>
        </div>
      </div>

      {/* Profile Details Cards */}
      {isLoading ? (
        <div className="h-48 rounded-2xl border border-gray-200 dark:border-white/5 p-6 animate-pulse bg-gray-50/50 dark:bg-white/[0.02]"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Personal Identity
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                <span className="text-gray-400">First Name</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{profile?.first_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                <span className="text-gray-400">Last Name</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{profile?.last_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                <span className="text-gray-400">Username</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">@{profile?.username}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Email Address</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{profile?.email}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-500" /> Workload & Capacity
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                <span className="text-gray-400">System Role</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{profile?.role}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                <span className="text-gray-400">Weekly Availability</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{profile?.availability_hours || 40} hrs/week</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-white/5">
                <span className="text-gray-400">Experience Level</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{profile?.experience || 0} years</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Account ID</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">#{profile?.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
