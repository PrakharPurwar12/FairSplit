import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import NotificationService from '../services/notification.service';
import Toast from '../components/ui/Toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, risk_high, allocation, progress_updated
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    setError(null);
    try {
      const params = { page };

      if (activeFilter === 'unread') {
        params.unread = 'true';
      } else if (activeFilter === 'risk') {
        params.type = 'risk_high';
      } else if (activeFilter === 'allocation') {
        params.type = 'allocation_completed';
      } else if (activeFilter === 'progress') {
        params.type = 'progress_updated';
      } else if (activeFilter === 'system') {
        params.type = 'system';
      }

      const [data, unreadData] = await Promise.all([
        NotificationService.getNotifications(params),
        NotificationService.getUnreadCount()
      ]);

      const results = data.results || (Array.isArray(data) ? data : []);
      setNotifications(results);
      setTotalCount(data.count || results.length);
      setHasNext(Boolean(data.next));
      setHasPrev(Boolean(data.previous));
      setUnreadCount(unreadData.unread_count || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications from server.');
    } finally {
      setIsLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      showToast('Notification marked as read.');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to mark as read.', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read.');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      showToast('Failed to mark all as read.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setTotalCount(prev => Math.max(0, prev - 1));
      fetchNotifications();
      showToast('Notification deleted.');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      showToast('Failed to delete notification.', 'error');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'risk_high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'allocation_completed':
      case 'task_assigned':
        return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'task_completed':
      case 'progress_updated':
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Notification History</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Real-time database events for AI allocation, risk warnings, and project updates.</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 rounded-2xl w-fit text-xs font-semibold">
        {[
          { key: 'all', label: `All Alerts (${totalCount})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'risk', label: 'High Risk' },
          { key: 'allocation', label: 'AI Allocation' },
          { key: 'progress', label: 'Task Updates' },
          { key: 'system', label: 'System' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveFilter(tab.key); setPage(1); }}
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
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 rounded-2xl border border-gray-200 dark:border-white/5 p-4 animate-pulse bg-gray-50/50 dark:bg-white/[0.02]"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{error}</h3>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-white/10 rounded-2xl">
          <Bell className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">No notifications</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            You have no notifications matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                notification.is_read 
                  ? 'bg-white dark:bg-[#161616] border-gray-200/70 dark:border-white/5 opacity-80' 
                  : 'bg-blue-50/40 dark:bg-blue-950/10 border-blue-200/80 dark:border-blue-900/30'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 shrink-0 mt-0.5">
                {getIcon(notification.notification_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {notification.title}
                  </h4>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
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

      {/* Pagination Controls */}
      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
          <span className="text-xs text-gray-400 font-semibold">Page {page}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
