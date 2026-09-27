import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { useNotification } from '../context/NotificationContext';
import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/api';

const getNotificationMeta = (type) => {
  switch (type) {
    case 'APPLICATION_RECEIVED':
      return { title: 'Application Received', icon: '📄' };
    case 'APPLICATION_ACCEPTED':
      return { title: 'Application Accepted', icon: '🎉' };
    case 'APPLICATION_REJECTED':
      return { title: 'Application Update', icon: 'ℹ️' };
    case 'PAYMENT_COMPLETED':
      return { title: 'Payment Completed', icon: '💰' };
    case 'REVIEW_RECEIVED':
      return { title: 'Review Received', icon: '⭐' };
    case 'PROJECT_COMPLETED':
      return { title: 'Project Completed', icon: '' };
    default:
      return { title: 'Notification', icon: '🔔' };
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUnreadCount } = useNotification();
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = filter === 'Unread'
        ? await getUnreadNotifications()
        : await getNotifications();

      if (response.data && response.data.success) {
        setNotifications(response.data.notifications || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(error.response?.data?.message || 'Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleNotificationClick = async (n) => {
    console.log("Notification clicked:", n);

    // 1. Extract and normalize target project ID
    let projectId = null;

    if (n.relatedProject) {
      if (typeof n.relatedProject === 'string') {
        projectId = n.relatedProject;
      } else if (typeof n.relatedProject === 'object' && n.relatedProject !== null) {
        projectId = n.relatedProject._id || n.relatedProject.id || null;
      }
    }

    if (!projectId && n.relatedApplication) {
      if (typeof n.relatedApplication === 'object' && n.relatedApplication !== null) {
        const appProj = n.relatedApplication.project;
        if (typeof appProj === 'string') {
          projectId = appProj;
        } else if (typeof appProj === 'object' && appProj !== null) {
          projectId = appProj._id || appProj.id || null;
        }
      }
    }

    if (projectId) {
      projectId = String(projectId);
    }

    console.log("Project ID:", projectId);

    // 2. Mark notification as read if unread
    if (!n.isRead) {
      try {
        const response = await markNotificationAsRead(n._id);
        if (response.data && response.data.success) {
          setNotifications((prev) =>
            prev.map((item) => (item._id === n._id ? { ...item, isRead: true } : item))
          );
          fetchUnreadCount();
        }
      } catch (error) {
        console.error('Error marking notification as read on click:', error);
      }
    }

    // 3. Navigate safely to destination
    if (projectId && projectId !== 'undefined' && projectId !== 'null') {
      const destination = `/projects/${projectId}`;
      console.log("Navigating to:", destination);
      navigate(destination);
    } else if (n.relatedApplication) {
      const destination = '/applications';
      console.log("Navigating to:", destination);
      navigate(destination);
    } else {
      console.log("No destination for notification:", n);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.data && response.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        fetchUnreadCount();
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error(error.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering notification click / navigation
    try {
      const response = await deleteNotification(id);
      if (response.data && response.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        fetchUnreadCount();
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(error.response?.data?.message || 'Failed to delete notification');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Stay up to date with proposals, payments, and platform milestones.
          </p>
        </div>

        {notifications.length > 0 && notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All', 'Unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading & Content List */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          {filter === 'Unread' ? 'No unread notifications found.' : 'No notifications found.'}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const meta = getNotificationMeta(n.type);
            const isRead = n.isRead;

            return (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 shadow-xs relative group ${
                  isRead
                    ? 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'bg-slate-50 dark:bg-slate-900 border-emerald-500/40 hover:border-emerald-500/70'
                }`}
              >
                <div className="text-2xl p-2.5 bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-xs shrink-0 border border-slate-200 dark:border-slate-700">
                  {meta.icon}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-bold truncate ${
                        isRead
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                      }`}
                    >
                      {meta.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isRead && (
                    <span
                      className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 animate-pulse"
                      title="Unread"
                    />
                  )}
                  <button
                    onClick={(e) => handleDelete(e, n._id)}
                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="Delete Notification"
                    aria-label="Delete notification"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
