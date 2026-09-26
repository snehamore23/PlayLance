import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Earnings',
      value: '$8,450.00',
      change: '+14% from last month',
      icon: '💰',
      positive: true,
    },
    {
      title: 'Active Projects',
      value: '4',
      change: '2 due this week',
      icon: '⚡',
      positive: true,
    },
    {
      title: 'Proposals Submitted',
      value: '12',
      change: '3 shortlisted',
      icon: '📄',
      positive: true,
    },
    {
      title: 'Client Satisfaction',
      value: '99%',
      change: 'Based on 28 reviews',
      icon: '⭐',
      positive: true,
    },
  ];

  const recentProjects = [
    {
      id: '1',
      title: 'Full-Stack React & Node.js Developer for Fintech MVP',
      client: 'Apex Finance',
      budget: '$3,500',
      status: 'In Progress',
      progress: 65,
      deadline: 'Oct 15, 2026',
    },
    {
      id: '2',
      title: 'UI/UX Redesign for AI Analytics Platform',
      client: 'CognitiveLabs',
      budget: '$2,200',
      status: 'Under Review',
      progress: 90,
      deadline: 'Sep 30, 2026',
    },
    {
      id: '3',
      title: 'Cross-Platform Mobile App for Logistics',
      client: 'HyperShip Inc.',
      budget: '$5,000',
      status: 'Starting Soon',
      progress: 10,
      deadline: 'Nov 20, 2026',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Milestone 2 Approved',
      desc: 'Apex Finance approved the API integration milestone ($1,200).',
      time: '2 hours ago',
      icon: '✅',
    },
    {
      id: 2,
      title: 'New Message Received',
      desc: 'CognitiveLabs left feedback on the latest design prototype.',
      time: '4 hours ago',
      icon: '💬',
    },
    {
      id: 3,
      title: 'Proposal Viewed',
      desc: 'Quantum Systems viewed your application for Lead React Architect.',
      time: 'Yesterday',
      icon: '👀',
    },
    {
      id: 4,
      title: 'Payment Released',
      desc: '$850.00 was credited to your PayLance wallet.',
      time: '2 days ago',
      icon: '💳',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Freelancer Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-slate-200 text-sm mt-1 max-w-xl">
            Here is what is happening across your active PayLance contracts and proposals today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/projects">
            <Button variant="secondary" size="md" className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm">
              Explore Projects
            </Button>
          </Link>
          <Link to="/post-project">
            <Button variant="primary" size="md" className="bg-emerald-500 hover:bg-emerald-600">
              Post Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <span className="text-xl p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {stat.icon}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Projects
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active milestones and deliverables in flight
              </p>
            </div>
            <Link to="/my-projects" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all bg-slate-50/50 dark:bg-slate-850"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {project.title}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client: {project.client} • Due {project.deadline}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {project.status}
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {project.budget}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Milestone Completion</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live updates on milestones, payments, and chats
            </p>
          </div>

          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== recentActivities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shadow-xs border border-slate-200 dark:border-slate-700">
                          {activity.icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {activity.desc}
                          </p>
                        </div>
                        <div className="text-right text-[11px] whitespace-nowrap text-slate-400">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
