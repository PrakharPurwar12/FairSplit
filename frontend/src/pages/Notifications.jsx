import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Info
} from 'lucide-react';
import Toast from '../components/ui/Toast';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'AI Task Allocation Completed',
    message: 'Tasks for project have been assigned to team members with optimized workload balance.',
    type: 'allocation',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: false
  },
  {
    id: 2,
    title: 'High Risk Prediction Alert',
    message: 'Task "API Optimization" was evaluated by AI as High Risk. Reassignment recommendation available.',
    type: 'risk',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false
  },
  {
    id: 3,
    title: 'Task Progress Updated',
    message: 'Progress updated to 50% on "Frontend Refactor". AI risk updated to Medium Risk.',
    type: 'progress',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true
  },
  {
    id: 4,
    title: 'Welcome to FairSplit AI',
    message: 'System successfully initialized with ML task allocation and risk prediction models.',
    type: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('fairsplit_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, risk, allocation, progress, system
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('fairsplit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.');
  };

  const clearAll = () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    setNotifications([]);
    showToast('All notifications cleared.');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'risk') return n.type === 'risk';
    if (activeFilter === 'allocation') return n.type === 'allocation';
    if (activeFilter === 'progress') return n.type === 'progress';
    if (activeFilter === 'system') return n.type === 'system';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'allocation':
        return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'progress':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Real-time AI allocation updates, risk alerts, and project logs.</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-2xl w-fit text-xs font-semibold">
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'risk', label: 'Risk Alerts' },
          { key: 'allocation', label: 'AI Allocation' },
          { key: 'progress', label: 'Progress Logs' },
          { key: 'system', label: 'System' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeFilter === tab.key 
                ? 'bg-white dark:bg-[#161616] text-blue-600 dark:text-blue-400 shadow-sm font-bold' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
          <Bell className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">No notifications</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            You have no notifications matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                notification.isRead 
                  ? 'bg-white dark:bg-[#161616] border-gray-200/70 dark:border-white/5 opacity-80' 
                  : 'bg-blue-50/40 dark:bg-blue-950/10 border-blue-200/80 dark:border-blue-900/30'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {notification.title}
                  </h4>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
