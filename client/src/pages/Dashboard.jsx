import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
      return '✅';
    default:
      return '🔔';
  }
};

const getStatusBadgeClass = (status) => {
  const s = (status || 'open').toLowerCase();
  switch (s) {
    case 'open':
    case 'accepted':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'in-progress':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'completed':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
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
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading your workspace metrics...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center space-y-4">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 space-y-3">
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
      {/* Welcome Banner Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 text-slate-900 dark:text-white shadow-md dark:shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {isClient ? 'Client Workspace' : 'Freelancer Workspace'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
            {isClient
              ? 'Manage your active job listings, review proposals, and hire top freelancers today.'
              : 'Explore open projects, track your submitted proposals, and manage active contracts today.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {isClient ? (
            <>
              <Link to="/post-project">
                <Button variant="primary" size="md" className="font-bold">
                  + Post Project
                </Button>
              </Link>
              <Link to="/my-projects">
                <Button variant="secondary" size="md">
                  My Projects
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/projects">
                <Button variant="primary" size="md" className="font-bold">
                  Find Projects 
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="secondary" size="md">
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
            <StatCard title="Total Projects" value={stats.totalProjects || 0} icon="💼" subtitle="All posted listings" />
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
            <StatCard title="Proposals" value={stats.proposalsSubmitted || 0} icon="📄" subtitle="Submitted proposals" />
            <StatCard title="Rating" value={`${(stats.rating || 0).toFixed(1)} ⭐`} icon="⭐" subtitle="Client score" />
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
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Recent Projects Posted
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage your active listings and milestone deliverables
                    </p>
                  </div>
                  <Link to="/my-projects" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {recentProjects.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
                    No projects posted yet. Click <strong className="text-slate-900 dark:text-white">Post Project</strong> above to create your first listing!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentProjects.map((p) => (
                      <div
                        key={p._id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <Link
                            to={`/projects/${p._id}`}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block"
                          >
                            {p.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Budget: <strong className="text-emerald-600 dark:text-emerald-400">${p.budget}</strong></span>
                            <span>•</span>
                            <span>Deadline: {formatDate(p.deadline)}</span>
                            <span>•</span>
                            <span>Proposals: <strong className="text-cyan-600 dark:text-cyan-400">{p.applicationsCount}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadgeClass(p.status)}`}>
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
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Proposals Received
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recent applications submitted by freelancers
                    </p>
                  </div>
                  <Link to="/applications" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
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
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {freelancerName} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">for</span> {projectTitle}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Bid: <strong className="text-emerald-600 dark:text-emerald-400">${app.bidAmount}</strong> • Submitted {formatDate(app.createdAt)}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize shrink-0 ${getStatusBadgeClass(app.status)}`}>
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
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Active Contracts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Projects currently in progress with accepted proposals
                    </p>
                  </div>
                  <Link to="/my-projects" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {activeProjects.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
                    No active contracts currently in progress. Apply to projects to land your next contract!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeProjects.map((proj) => {
                      const clientName = proj.client?.name || 'Client';
                      return (
                        <div
                          key={proj._id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <Link
                              to={`/projects/${proj._id}`}
                              className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block"
                            >
                              {proj.title}
                            </Link>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Client: <strong className="text-slate-700 dark:text-slate-200">{clientName}</strong> • Budget: <strong className="text-emerald-600 dark:text-emerald-400">${proj.budget}</strong> • Due {formatDate(proj.deadline)}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize shrink-0 ${getStatusBadgeClass(proj.status)}`}>
                            {proj.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Freelancer Recent Submitted Applications */}
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Submitted Proposals
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Status of your recent project proposals
                    </p>
                  </div>
                  <Link to="/applications" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
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
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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

                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize shrink-0 ${getStatusBadgeClass(app.status)}`}>
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
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live alerts on proposals, payments & contract updates
              </p>
            </div>
            <Link to="/notifications" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 text-xs">
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
                          <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shadow-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
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
                          <div className="text-right text-[11px] whitespace-nowrap text-slate-500 dark:text-slate-500">
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
  <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </span>
      <span className="text-xl p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
        {icon}
      </span>
    </div>
    <div className="mt-3">
      <div className="text-2xl font-extrabold text-slate-900 dark:text-white truncate tracking-tight">
        {value}
      </div>
      {subtitle && (
        <p className={`text-xs font-semibold mt-1 ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default Dashboard;

