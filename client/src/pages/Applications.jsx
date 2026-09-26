import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Button from '../components/Button';

const Applications = () => {
  const { projectId: routeProjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryProjectId = searchParams.get('projectId');

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    routeProjectId || queryProjectId || ''
  );
  const [applications, setApplications] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // 1. Fetch client's projects on mount
  useEffect(() => {
    const fetchClientProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await api.get('/projects/my');
        if (response.data && response.data.success) {
          const clientProjects = response.data.projects || [];
          setProjects(clientProjects);

          const initialId = routeProjectId || queryProjectId;
          if (initialId) {
            setSelectedProjectId(initialId);
          } else if (clientProjects.length > 0) {
            setSelectedProjectId(clientProjects[0]._id || clientProjects[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching client projects:', err);
        setError(err.response?.data?.message || 'Failed to load projects.');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchClientProjects();
  }, [routeProjectId, queryProjectId]);

  // 2. Fetch applications whenever selectedProjectId changes
  const fetchApplications = async (pId) => {
    if (!pId) {
      setApplications([]);
      return;
    }
    try {
      setLoadingApps(true);
      setError(null);
      const response = await api.get(`/projects/${pId}/applications`);
      if (response.data && response.data.success) {
        setApplications(response.data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching project applications:', err);
      setError(
        err.response?.data?.message || 'Failed to load applications for this project.'
      );
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchApplications(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    const newId = e.target.value;
    setSelectedProjectId(newId);
    setSearchParams(newId ? { projectId: newId } : {});
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      if (response.data && response.data.success) {
        toast.success(`Proposal ${newStatus} successfully!`);
        await fetchApplications(selectedProjectId);
        // Refresh project list to reflect status changes (e.g. project status became in-progress)
        const projRes = await api.get('/projects/my');
        if (projRes.data && projRes.data.success) {
          setProjects(projRes.data.projects || []);
        }
      }
    } catch (err) {
      console.error(`Error updating application status:`, err);
      const msg = err.response?.data?.message || `Failed to update status to ${newStatus}.`;
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const currentProject = projects.find(
    (p) => (p._id || p.id) === selectedProjectId
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project Applications & Proposals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review incoming bids, evaluate freelancer proposals, and accept contracts.
          </p>
        </div>

        {/* Project Selector Dropdown */}
        {projects.length > 0 && (
          <div className="w-full md:w-80">
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              className="w-full text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
            >
              {projects.map((p) => {
                const pId = p._id || p.id;
                const count = Array.isArray(p.applications) ? p.applications.length : 0;
                return (
                  <option key={pId} value={pId}>
                    {p.title} ({count} proposal{count === 1 ? '' : 's'})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {loadingProjects ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="text-3xl">📁</div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No projects found
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You must post a project first to receive proposals.
          </p>
          <Link to="/post-project" className="inline-block mt-2">
            <Button variant="primary" size="sm">
              + Post New Project
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Selected Project Summary Card */}
          {currentProject && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Viewing Proposals For
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentProject.title}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Category: {currentProject.category} • Budget: ${currentProject.budget} • Status: <span className="capitalize font-semibold">{currentProject.status}</span>
                </div>
              </div>
              <Link to={`/projects/${currentProject._id || currentProject.id}`}>
                <Button variant="outline" size="sm">
                  View Project Details ↗
                </Button>
              </Link>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Applications List */}
          {loadingApps ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
              Loading proposals...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="text-3xl">✉️</div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No proposals submitted yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No freelancers have applied to this project yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const freelancerObj =
                  typeof app.freelancer === 'object' && app.freelancer !== null
                    ? app.freelancer
                    : { name: 'Freelancer', email: '' };

                const freelancerName = freelancerObj.name || 'Freelancer';
                const freelancerEmail = freelancerObj.email || '';
                const freelancerRating = freelancerObj.rating
                  ? `${freelancerObj.rating} ⭐`
                  : null;

                const initials = freelancerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                const formattedDate = app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Recently';

                const formattedBid =
                  typeof app.bidAmount === 'number'
                    ? `$${app.bidAmount.toLocaleString()}`
                    : app.bidAmount || 'N/A';

                const isAccepted = app.status === 'accepted';
                const isRejected = app.status === 'rejected';
                const isUpdating = updatingId === app._id;

                return (
                  <div
                    key={app._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {freelancerObj.profileImage ? (
                            <img
                              src={freelancerObj.profileImage}
                              alt={freelancerName}
                              className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center">
                              {initials || 'F'}
                            </div>
                          )}
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {freelancerName}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {freelancerEmail} {freelancerRating && `• ${freelancerRating}`}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : isRejected
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          }`}
                        >
                          {app.status || 'pending'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        Submitted on: <strong>{formattedDate}</strong>
                      </div>

                      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-line">
                        "{app.proposal}"
                      </div>
                    </div>

                    {/* Bid info and buttons */}
                    <div className="md:w-60 shrink-0 flex flex-col justify-between pt-4 md:pt-0 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-6 space-y-4">
                      <div>
                        <span className="text-xs text-slate-400 font-medium">Bid Amount:</span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {formattedBid}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          disabled={isAccepted || isUpdating}
                          onClick={() => handleStatusUpdate(app._id, 'accepted')}
                        >
                          {isUpdating ? 'Processing...' : isAccepted ? 'Proposal Accepted ✓' : 'Accept Proposal'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          disabled={isRejected || isUpdating}
                          onClick={() => handleStatusUpdate(app._id, 'rejected')}
                        >
                          {isUpdating ? 'Processing...' : isRejected ? 'Proposal Rejected' : 'Reject Proposal'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
