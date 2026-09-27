import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/api';

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'APPLICATION_RECEIVED':
      return '📄';
    case 'APPLICATION_ACCEPTED':
      return '🎉';
    case 'APPLICATION_REJECTED':
      return 'ℹ️';
    case 'PAYMENT_COMPLETED':
      return '💰';
    case 'REVIEW_RECEIVED':
      return '⭐';
    case 'PROJECT_COMPLETED':
      return '🚀';
    default:
      return '🔔';
  }
};

const getStatusBadgeClass = (status) => {
  const s = (status || 'open').toLowerCase();
  switch (s) {
    case 'open':
    case 'accepted':
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'in-progress':
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'completed':
      return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'pending':
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardData();
      if (response.data && response.data.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard metrics.');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your workspace metrics...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 space-y-3">
          <p className="font-bold text-base">{error || 'Unable to load dashboard.'}</p>
          <Button variant="outline" size="sm" onClick={fetchDashboard}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  const { stats = {}, recentProjects = [], recentApplications = [], activeProjects = [], recentActivity = [] } = dashboardData;
  const isClient = user?.role === 'client';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            {isClient ? 'Client Dashboard' : 'Freelancer Dashboard'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-slate-200 text-sm mt-1 max-w-xl">
            {isClient
              ? 'Here is what is happening across your posted projects and proposals today.'
              : 'Here is what is happening across your active proposals, contracts, and earnings today.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isClient ? (
            <>
              <Link to="/post-project">
                <Button variant="primary" size="md" className="bg-emerald-500 hover:bg-emerald-600 font-bold">
                  + Post Project
                </Button>
              </Link>
              <Link to="/my-projects">
                <Button variant="secondary" size="md" className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm">
                  My Projects
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/projects">
                <Button variant="primary" size="md" className="bg-emerald-500 hover:bg-emerald-600 font-bold">
                  Find Projects 🚀
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="secondary" size="md" className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm">
                  My Applications
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Role-Based Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {isClient ? (
          <>
            <StatCard title="Total Projects" value={stats.totalProjects || 0} icon="💼" subtitle="All posted projects" />
            <StatCard title="Active Projects" value={stats.activeProjects || 0} icon="⚡" subtitle="In progress" positive />
            <StatCard title="Completed" value={stats.completedProjects || 0} icon="✅" subtitle="Finished contracts" />
            <StatCard title="Applications" value={stats.applicationsReceived || 0} icon="📄" subtitle="Proposals received" />
            <StatCard title="Total Spent" value={formatCurrency(stats.totalSpent)} icon="💰" subtitle="Released payments" positive />
            <StatCard title="Unread Alert" value={stats.unreadNotifications || 0} icon="🔔" subtitle="Notifications" />
          </>
        ) : (
          <>
            <StatCard title="Total Earnings" value={formatCurrency(stats.totalEarnings)} icon="💰" subtitle="Earned to date" positive />
            <StatCard title="Active Projects" value={stats.activeProjects || 0} icon="⚡" subtitle="Contracts in flight" positive />
            <StatCard title="Completed" value={stats.completedProjects || 0} icon="✅" subtitle="Finished contracts" />
            <StatCard title="Proposals" value={stats.proposalsSubmitted || 0} icon="📄" subtitle="Submitted applications" />
            <StatCard title="Rating" value={`${(stats.rating || 0).toFixed(1)} ⭐`} icon="⭐" subtitle="Client review score" />
            <StatCard title="Unread Alert" value={stats.unreadNotifications || 0} icon="🔔" subtitle="Notifications" />
          </>
        )}
      </div>

      {/* Role-Aware Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Projects / Active Contracts / Proposals */}
        <div className="lg:col-span-2 space-y-6">
          {isClient ? (
            /* CLIENT RECENT PROJECTS & PROPOSALS */
            <div className="space-y-6">
              {/* Client Recent Projects Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Recent Projects Posted
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage your active listings and milestone deliverables
                    </p>
                  </div>
                  <Link to="/my-projects" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {recentProjects.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-400 text-xs">
                    No projects posted yet. Click <strong className="text-slate-700 dark:text-slate-200">Post Project</strong> to create your first listing!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentProjects.map((p) => (
                      <div
                        key={p._id}
                        className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/40 transition-all bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <Link
                            to={`/projects/${p._id}`}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block"
                          >
                            {p.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Budget: <strong className="text-slate-800 dark:text-slate-200">${p.budget}</strong></span>
                            <span>•</span>
                            <span>Deadline: {formatDate(p.deadline)}</span>
                            <span>•</span>
                            <span>Proposals: <strong className="text-emerald-600 dark:text-emerald-400">{p.applicationsCount}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusBadgeClass(p.status)}`}>
                            {p.status}
                          </span>
                          <Link to={`/applications?projectId=${p._id}`}>
                            <Button size="xs" variant="outline" className="text-xs">
                              Proposals
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Recent Proposals Received Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Proposals Received
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recent applications submitted by freelancers
                    </p>
                  </div>
                  <Link to="/applications" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-400 text-xs">
                    No proposals received yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app) => {
                      const freelancerName = app.freelancer?.name || 'Freelancer';
                      const projectTitle = app.project?.title || 'Project';
                      return (
                        <div
                          key={app._id}
                          className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {freelancerName} <span className="text-xs font-normal text-slate-500">for</span> {projectTitle}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Bid: <strong className="text-emerald-600 dark:text-emerald-400">${app.bidAmount}</strong> • Submitted {formatDate(app.createdAt)}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize shrink-0 ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* FREELANCER ACTIVE CONTRACTS & PROPOSALS */
            <div className="space-y-6">
              {/* Freelancer Active Contracts */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Active Contracts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Projects currently in progress with accepted proposals
                    </p>
                  </div>
                  <Link to="/my-projects" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {activeProjects.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-400 text-xs">
                    No active contracts currently in progress. Apply to projects to land your next contract!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeProjects.map((proj) => {
                      const clientName = proj.client?.name || 'Client';
                      return (
                        <div
                          key={proj._id}
                          className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/40 transition-all bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <Link
                              to={`/projects/${proj._id}`}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block"
                            >
                              {proj.title}
                            </Link>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Client: <strong>{clientName}</strong> • Budget: <strong className="text-slate-800 dark:text-slate-200">${proj.budget}</strong> • Due {formatDate(proj.deadline)}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize shrink-0 ${getStatusBadgeClass(proj.status)}`}>
                            {proj.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Freelancer Recent Submitted Applications */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Submitted Proposals
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Status of your recent project proposals
                    </p>
                  </div>
                  <Link to="/applications" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-400 text-xs">
                    No proposals submitted yet. Browse open projects to apply!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app) => {
                      const projTitle = app.project?.title || 'Project';
                      const projId = app.project?._id || app.project;
                      return (
                        <div
                          key={app._id}
                          className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            {projId ? (
                              <Link
                                to={`/projects/${projId}`}
                                className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block"
                              >
                                {projTitle}
                              </Link>
                            ) : (
                              <p className="font-bold text-sm text-slate-900 dark:text-white">
                                {projTitle}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Your Bid: <strong className="text-emerald-600 dark:text-emerald-400">${app.bidAmount}</strong> • Submitted {formatDate(app.createdAt)}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize shrink-0 ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live alerts on proposals, payments & contract updates
              </p>
            </div>
            <Link to="/notifications" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-400 text-xs">
              No recent activity found.
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, idx) => (
                  <li key={activity.id || idx}>
                    <div className="relative pb-8">
                      {idx !== recentActivity.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shadow-xs border border-slate-200 dark:border-slate-700">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1 flex justify-between space-x-4">
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {activity.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {activity.desc}
                            </p>
                          </div>
                          <div className="text-right text-[11px] whitespace-nowrap text-slate-400">
                            {formatTimeAgo(activity.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard component for clean metrics presentation
const StatCard = ({ title, value, icon, subtitle, positive }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </span>
      <span className="text-xl p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
        {icon}
      </span>
    </div>
    <div className="mt-3">
      <div className="text-2xl font-black text-slate-900 dark:text-white truncate">
        {value}
      </div>
      {subtitle && (
        <p className={`text-xs font-medium mt-1 ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default Dashboard;
