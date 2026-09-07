import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  FileText,
  ShieldCheck,
  AlertCircle,
  Clock,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Current logged-in student
  const studentId = user?.id || 'STU2026001';

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `http://localhost:5000/api/notifications/${studentId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to fetch notifications'
        );
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Notifications error:', err);
      setError(err.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark one notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: 'PUT'
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to update notification'
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/notifications/read-all',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to update notifications'
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true
        }))
      );
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application':
        return <FileText className="w-5 h-5" />;

      case 'document':
        return <CheckCircle2 className="w-5 h-5" />;

      case 'income':
        return <ShieldCheck className="w-5 h-5" />;

      case 'warning':
        return <AlertCircle className="w-5 h-5" />;

      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconBackground = (type) => {
    switch (type) {
      case 'application':
        return 'bg-blue-50 text-blue-700';

      case 'document':
        return 'bg-green-50 text-green-700';

      case 'income':
        return 'bg-purple-50 text-purple-700';

      case 'warning':
        return 'bg-orange-50 text-orange-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-primary flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Notifications
              </h1>

              <p className="text-xs text-slate-500 mt-0.5">
                Stay updated about your scholarship applications and verification requests.
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Check className="w-4 h-4" />
            Mark All as Read
          </button>
        )}

      </div>


      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Clock className="w-6 h-6 mx-auto mb-3 text-slate-400 animate-pulse" />

          <p className="text-sm text-slate-500">
            Loading notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (

        /* Empty state */
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-slate-400" />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            No Notifications
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            You don't have any notifications yet.
          </p>

        </div>

      ) : (

        /* Notification list */
        <div className="space-y-3">

          {notifications.map((notification) => (

            <div
              key={notification.id}
              className={`bg-white rounded-xl border p-5 transition ${notification.is_read
                  ? 'border-slate-200'
                  : 'border-blue-200 bg-blue-50/30'
                }`}
            >

              <div className="flex items-start gap-4">

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${getIconBackground(
                    notification.notification_type
                  )}`}
                >
                  {getIcon(notification.notification_type)}
                </div>


                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                    <div>

                      <div className="flex items-center gap-2">

                        <h3 className="text-sm font-bold text-slate-900">
                          {notification.title}
                        </h3>

                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}

                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>

                    </div>


                    {/* Date */}
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {notification.created_at
                        ? new Date(
                          notification.created_at
                        ).toLocaleString()
                        : ''}
                    </span>

                  </div>


                  {/* Bottom */}
                  <div className="flex items-center justify-between mt-4">

                    <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                      {notification.notification_type || 'general'}
                    </span>

                    {!notification.is_read && (
                      <button
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as read
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};