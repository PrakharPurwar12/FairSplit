import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Cpu, 
  CheckCircle2, 
  Info,
  ExternalLink,
  Clock
} from 'lucide-react';
import NotificationService from '../../services/notification.service';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch unread count & recent notifications
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await NotificationService.getUnreadCount();
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch unread notification count:', err);
    }
  }, []);

  const fetchRecentNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await NotificationService.getNotifications({ page_size: 5 });
      const items = res.results || (Array.isArray(res) ? res : []);
      setNotifications(items);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll for unread count every 15 seconds
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch items when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRecentNotifications();
    }
  }, [isOpen, fetchRecentNotifications]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      fetchUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'risk_high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'allocation_completed':
      case 'task_assigned':
        return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'task_completed':
      case 'progress_updated':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-sm ring-2 ring-white dark:ring-[#111]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#161616] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Dropdown Header */}
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
              </button>
            )}
          </div>

          {/* List Section */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-gray-400 animate-pulse">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No notifications found.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={(e) => !n.is_read && handleMarkAsRead(n.id, e)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    n.is_read 
                      ? 'bg-white dark:bg-[#161616] opacity-75' 
                      : 'bg-blue-50/50 dark:bg-blue-950/20'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 shrink-0 mt-0.5">
                    {getIcon(n.notification_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors shrink-0"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 border-t border-gray-100 dark:border-white/5 transition-colors"
          >
            View All Notifications <ExternalLink className="w-3 h-3 inline ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
