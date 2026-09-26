import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [proposalInput, setProposalInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/projects/${id}`);
        if (response.data && response.data.success) {
          const projData = response.data.project;
          setProject(projData);
          if (projData.budget) {
            setBidAmountInput(projData.budget);
          }
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(
          err.response?.data?.message || 'Failed to load project details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  // Check if current freelancer has already applied to this project
  useEffect(() => {
    const checkFreelancerApplication = async () => {
      if (user && user.role === 'freelancer' && id) {
        try {
          const res = await api.get('/applications/my');
          if (res.data && res.data.success) {
            const myApps = res.data.applications || [];
            const existing = myApps.find((app) => {
              const pId = typeof app.project === 'object' ? app.project?._id : app.project;
              return pId === id;
            });
            if (existing) {
              setHasApplied(true);
            }
          }
        } catch (err) {
          console.error('Error checking freelancer application:', err);
        }
      }
    };

    checkFreelancerApplication();
  }, [user, id]);

  const handleApplyClick = () => {
    if (!user) {
      toast.error('Please sign in to apply for projects.');
      return;
    }
    if (user.role === 'client') {
      toast.error('Only freelancers can submit proposals to projects.');
      return;
    }
    setShowApplyModal(true);
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'freelancer') {
      toast.error('Only freelancers can submit proposals to projects.');
      return;
    }

    if (!proposalInput.trim()) {
      toast.error('Proposal cannot be empty.');
      return;
    }

    const numBid = Number(bidAmountInput);
    if (isNaN(numBid) || numBid <= 0) {
      toast.error('Bid amount must be a number greater than 0.');
      return;
    }

    const targetProjectId = project?._id || id;

    try {
      setSubmitting(true);
      const response = await api.post('/applications', {
        project: targetProjectId,
        proposal: proposalInput.trim(),
        bidAmount: numBid,
      });

      if (response.data && response.data.success) {
        toast.success('Proposal submitted successfully!');
        setHasApplied(true);
        setShowApplyModal(false);
        setProposalInput('');

        // Refresh project to update proposal count
        const updatedRes = await api.get(`/projects/${targetProjectId}`);
        if (updatedRes.data && updatedRes.data.success) {
          setProject(updatedRes.data.project);
        }
      }
    } catch (err) {
      console.error('Error submitting proposal:', err);
      const msg = err.response?.data?.message || 'Failed to submit proposal. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 space-y-3">
          <p className="font-bold text-lg">{error || 'Project not found.'}</p>
          <Link to="/projects">
            <Button variant="outline" size="sm" className="mt-2">
              ← Back to All Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    _id,
    title,
    description,
    category,
    skills = [],
    budget,
    deadline,
    client,
    status = 'open',
    createdAt,
    applications = [],
  } = project;

  const formattedBudget =
    typeof budget === 'number'
      ? `$${budget.toLocaleString()}`
      : budget || 'N/A';

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const formattedPostedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  const clientObj =
    typeof client === 'object' && client !== null
      ? client
      : { name: String(client || 'Client'), email: '' };

  const getStatusBadge = (st) => {
    const s = (st || 'open').toLowerCase();
    if (s === 'open') {
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
    if (s === 'in-progress') {
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
    if (s === 'completed') {
      return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  const isFreelancerUser = user?.role === 'freelancer';
  const isClientUser = user?.role === 'client';
  const isOpen = status === 'open';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/projects" className="hover:text-emerald-500">
            Projects
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate max-w-[200px]">
            {title}
          </span>
        </div>
        <Link
          to="/projects"
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
        >
          ← Back to all projects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {category || 'General'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusBadge(
                  status
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>Posted on {formattedPostedDate}</span>
              <span>•</span>
              <span>{applications.length} proposal(s) received</span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Project Description
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {description}
              </div>
            </div>

            {/* Skills Required */}
            {skills && skills.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {typeof skill === 'string' ? skill : String(skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply For This Project Section (for Freelancer role when project is open) */}
          {isFreelancerUser && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📝</span> Apply for this Project
              </h2>

              {hasApplied ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 text-center space-y-2">
                  <span className="text-2xl">✅</span>
                  <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                    Already Applied
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    You have already submitted a proposal for this project.
                  </p>
                </div>
              ) : !isOpen ? (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  This project is currently <span className="capitalize">{status}</span> and is not accepting new proposals.
                </div>
              ) : (
                <form onSubmit={handleProposalSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Your Bid Amount ($ USD) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={bidAmountInput}
                      onChange={(e) => setBidAmountInput(e.target.value)}
                      placeholder="e.g. 2500"
                      disabled={submitting}
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Proposal / Cover Letter <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={proposalInput}
                      onChange={(e) => setProposalInput(e.target.value)}
                      placeholder="Describe your relevant experience, technical approach, and delivery timeline..."
                      disabled={submitting}
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting Proposal...' : 'Submit Proposal 🚀'}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Project Budget
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {formattedBudget}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between py-1">
                <span>Deadline / Est. Duration:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formattedDeadline}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Escrow Protection:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Guaranteed
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              {isFreelancerUser && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={hasApplied || !isOpen}
                  onClick={handleApplyClick}
                >
                  {hasApplied
                    ? 'Already Applied'
                    : !isOpen
                    ? 'Project Not Open'
                    : 'Apply Now (Submit Proposal)'}
                </Button>
              )}

              {isClientUser && (
                <>
                  <Link to={`/applications?projectId=${_id || id}`} className="block">
                    <Button variant="primary" size="md" className="w-full">
                      View Proposals ({applications.length})
                    </Button>
                  </Link>

                  <Link to={`/projects/${_id || id}/edit`} className="block">
                    <Button variant="outline" size="md" className="w-full">
                      Edit Project (Owner)
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Client Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              About the Client
            </h3>

            <div className="space-y-3 text-sm">
              <div className="font-bold text-slate-900 dark:text-white text-base">
                {clientObj.name || 'Client'}
              </div>

              {clientObj.email && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  ✉️ {clientObj.email}
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-semibold text-emerald-500">Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Proposal Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleProposalSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Your Proposal
              </h3>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Applying for:{' '}
              <strong className="text-slate-700 dark:text-slate-300">{title}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Bid Amount ($ USD) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bidAmountInput}
                  onChange={(e) => setBidAmountInput(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Letter / Proposal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={proposalInput}
                  onChange={(e) => setProposalInput(e.target.value)}
                  placeholder="Describe your relevant experience and why you are the best fit for this project..."
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setShowApplyModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Proposal 🚀'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
