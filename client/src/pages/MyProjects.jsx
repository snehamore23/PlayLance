import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [completingId, setCompletingId] = useState(null);

  const handleCompleteProject = async (projectId, projectTitle) => {
    if (!window.confirm(`Are you sure you want to mark project "${projectTitle || 'this project'}" as completed? This will enable Reviews & Ratings.`)) {
      return;
    }
    try {
      setCompletingId(projectId);
      const res = await api.put(`/projects/${projectId}/complete`);
      if (res.data && res.data.success) {
        toast.success('Project marked as completed successfully.');
        await fetchMyProjects();
      }
    } catch (err) {
      console.error('Error completing project from MyProjects:', err);
      toast.error(err.response?.data?.message || 'Failed to mark project as completed.');
    } finally {
      setCompletingId(null);
    }
  };

  const fetchMyProjects = async () => {
    if (user && user.role === 'freelancer') {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/projects/my');
      if (response.data && response.data.success) {
        setProjects(response.data.projects || []);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching my projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch your projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') || params.get('session_id')) {
      toast.success('Payment completed successfully! 🎉');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    fetchMyProjects();
  }, [user]);

  if (user && user.role === 'freelancer') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200 space-y-4 shadow-sm">
          <div className="text-4xl">💼</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Client Workspace Page
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            "My Projects" is reserved for client accounts to manage posted listings and proposals. As a freelancer, you can view your submitted proposals under <strong>My Applications</strong> or browse new listings in <strong>Find Projects</strong>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/applications">
              <Button variant="primary" size="md">
                My Applications 📄
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" size="md">
                Find Projects 
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    const status = (project.status || 'open').toLowerCase();
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return status === 'open' || status === 'in-progress';
    if (activeTab === 'Completed') return status === 'completed';
    return true;
  });

  const getStatusBadgeClass = (status) => {
    const s = (status || 'open').toLowerCase();
    if (s === 'open' || s === 'in-progress') {
      return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
    }
    if (s === 'completed') {
      return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300';
    }
    return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300';
  };

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

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
          Loading your posted projects...
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-center space-y-3">
          <p className="font-semibold">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchMyProjects}>
            Retry
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 bg-slate-900/80 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="text-3xl">📁</div>
          <p className="text-lg font-bold text-white">
            No projects found
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {projects.length === 0
              ? 'You have not posted any projects yet. Click "+ Post New Project" above to create one.'
              : 'No projects found in this tab.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const projectId = project._id || project.id;
            const proposalsCount = Array.isArray(project.applications)
              ? project.applications.length
              : project.applicationsCount || 0;

            const formattedBudget =
              typeof project.budget === 'number'
                ? `$${project.budget.toLocaleString()}`
                : project.budget || 'N/A';

            const formattedDate = project.createdAt
              ? new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently';

            const formattedDeadline = project.deadline
              ? new Date(project.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : null;

            return (
              <div
                key={projectId}
                className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      {project.category || 'General'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusBadgeClass(
                        project.status
                      )}`}
                    >
                      {project.status || 'open'}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${projectId}`}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {project.title}
                  </Link>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1">
                    <span>
                      Budget:{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {formattedBudget}
                      </strong>
                    </span>
                    <span>
                      Proposals:{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {proposalsCount}
                      </strong>
                    </span>
                    {formattedDeadline && <span>Deadline: {formattedDeadline}</span>}
                    <span>Posted: {formattedDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                  {project.status === 'in-progress' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCompleteProject(projectId, project.title)}
                      disabled={completingId === projectId}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      {completingId === projectId ? 'Completing...' : 'Mark Completed ✅'}
                    </Button>
                  )}
                  <Link to={`/projects/${projectId}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/applications?projectId=${projectId}`}>
                    <Button variant="primary" size="sm">
                      View Proposals ({proposalsCount})
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
