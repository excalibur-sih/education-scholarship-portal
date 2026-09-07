import React, { createContext, useContext, useState, useEffect } from 'react';
import initialNotifications from '../data/notifications.json';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const local = localStorage.getItem('mahasetu_notifications');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return initialNotifications;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('mahasetu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = ({ title, message, type = 'INFO', link = null }) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      date: new Date().toISOString(),
      read: false,
      link
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Also trigger interactive toast popup
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, title, message, type }]);
    setTimeout(() => {
      removeToast(toastId);
    }, 4500);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
