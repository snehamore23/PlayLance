import React, { useState } from 'react';
import Button from '../components/Button';

const Notifications = () => {
  const [filter, setFilter] = useState('All');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Milestone 2 Escrow Released',
      message: 'Apex Finance Corp released $1,200.00 to your PayLance wallet for completing the API integration milestone.',
      time: '15 minutes ago',
      read: false,
      type: 'payment',
      icon: '💰',
    },
    {
      id: 2,
      title: 'New Proposal Received',
      message: 'Sarah Jenkins submitted a competitive proposal for "Full-Stack React & Node.js Developer for SaaS MVP".',
      time: '2 hours ago',
      read: false,
      type: 'proposal',
      icon: '📄',
    },
    {
      id: 3,
      title: 'Contract Feedback Received',
      message: 'CognitiveLabs left you a 5.0 ⭐ review on the UI/UX Redesign milestone.',
      time: 'Yesterday',
      read: true,
      type: 'review',
      icon: '⭐',
    },
    {
      id: 4,
      title: 'Security Alert: Password Verified',
      message: 'A successful login to your PayLance account was detected from Chrome on Windows.',
      time: '3 days ago',
      read: true,
      type: 'security',
      icon: '🛡️',
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay up to date with proposals, payments, and platform milestones.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All', 'Unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => toggleRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 shadow-xs ${
                n.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
              }`}
            >
              <div className="text-2xl p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-xs shrink-0">
                {n.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-bold truncate ${n.read ? 'text-slate-900 dark:text-white' : 'text-emerald-950 dark:text-emerald-300'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" title="Unread" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
