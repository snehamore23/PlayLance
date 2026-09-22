import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const MyProjects = () => {
  const [activeTab, setActiveTab] = useState('All');

  const projects = [
    {
      id: '1',
      title: 'Full-Stack React & Node.js Developer for SaaS MVP',
      category: 'Web Development',
      budget: '$3,500',
      status: 'Active',
      proposals: 12,
      hired: 'Sarah Jenkins',
      createdDate: 'Sep 18, 2026',
    },
    {
      id: '2',
      title: 'UI/UX Redesign for AI Analytics Platform',
      category: 'UI/UX Design',
      budget: '$2,200',
      status: 'Active',
      proposals: 7,
      hired: 'David Chen',
      createdDate: 'Sep 12, 2026',
    },
    {
      id: '3',
      title: 'Marketing Landing Page in Tailwind CSS',
      category: 'Web Development',
      budget: '$850',
      status: 'Completed',
      proposals: 9,
      hired: 'Alex Morgan',
      createdDate: 'Aug 24, 2026',
    },
    {
      id: '4',
      title: 'PostgreSQL Database Optimization & Indexing',
      category: 'Database Administration',
      budget: '$1,400',
      status: 'Completed',
      proposals: 4,
      hired: 'Marcus Vance',
      createdDate: 'Aug 05, 2026',
    },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return p.status === 'Active';
    if (activeTab === 'Completed') return p.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Posted Projects
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your project listings, proposals, and milestones on PayLance.
          </p>
        </div>

        <Link to="/post-project">
          <Button variant="primary" size="md">
            + Post New Project
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All', 'Active', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab} Projects
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {project.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    project.status === 'Active'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {project.title}
              </Link>

              <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1">
                <span>Budget: <strong className="text-slate-700 dark:text-slate-300">{project.budget}</strong></span>
                <span>Proposals: <strong className="text-slate-700 dark:text-slate-300">{project.proposals}</strong></span>
                <span>Hired: <strong className="text-slate-700 dark:text-slate-300">{project.hired}</strong></span>
                <span>Posted: {project.createdDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0">
              <Link to={`/projects/${project.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="primary" size="sm">
                  View Proposals ({project.proposals})
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;
