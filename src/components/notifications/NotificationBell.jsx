import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-blue-700 hover:underline font-semibold"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications at this time
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 hover:bg-slate-50 transition flex items-start gap-3 cursor-pointer ${
                    !n.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gov-primary hover:underline mt-1.5"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-center">
            <Link
              to="/student/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              View All Notifications & Audit Alerts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  const getToastStyle = (type) => {
    const t = (type || '').toUpperCase();
    if (t === 'SUCCESS') return 'bg-emerald-600 border-emerald-700 text-white';
    if (t === 'ERROR' || t === 'ALERT') return 'bg-rose-600 border-rose-700 text-white';
    if (t === 'WARNING') return 'bg-amber-500 border-amber-600 text-white';
    return 'bg-slate-900 border-slate-700 text-white';
  };

  const getIconColor = (type) => {
    const t = (type || '').toUpperCase();
    if (t === 'SUCCESS') return 'text-emerald-100';
    if (t === 'ERROR' || t === 'ALERT') return 'text-rose-100';
    if (t === 'WARNING') return 'text-amber-100';
    return 'text-blue-400';
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((t) => {
        const typeUpper = (t.type || '').toUpperCase();
        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl p-5 shadow-2xl border flex items-start gap-4 animate-in slide-in-from-top-5 duration-200 ${getToastStyle(t.type)}`}
          >
            <div className="mt-0.5 shrink-0">
              {typeUpper === 'SUCCESS' ? (
                <CheckCircle2 className={`w-6 h-6 ${getIconColor(t.type)}`} />
              ) : typeUpper === 'ALERT' || typeUpper === 'ERROR' || typeUpper === 'WARNING' ? (
                <AlertTriangle className={`w-6 h-6 ${getIconColor(t.type)}`} />
              ) : (
                <Info className={`w-6 h-6 ${getIconColor(t.type)}`} />
              )}
            </div>
            <div className="flex-1">
              <h5 className="text-base font-bold text-white">{t.title}</h5>
              <p className="text-sm text-slate-100 mt-1 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/70 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
