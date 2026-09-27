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
  const [paying, setPaying] = useState(false);

  // Completion state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [fetchedAcceptedFreelancerId, setFetchedAcceptedFreelancerId] = useState(null);

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

  // Fetch project reviews and accepted application details
  useEffect(() => {
    const fetchReviewsAndApp = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/reviews/project/${id}`);
        if (res.data && res.data.success) {
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching project reviews:', err);
      }

      // Only attempt to fetch applications if client owner, avoiding 403 Forbidden for freelancers
      if (user && user.role === 'client') {
        try {
          const appRes = await api.get(`/projects/${id}/applications`);
          if (appRes.data && appRes.data.success) {
            const apps = appRes.data.applications || [];
            const acc = apps.find((a) => a.status === 'accepted');
            if (acc) {
              const fId = typeof acc.freelancer === 'object' ? acc.freelancer?._id : acc.freelancer;
              setFetchedAcceptedFreelancerId(fId);
            }
          }
        } catch (err) {
          // Ignore 403 error for non-owner as acceptedFreelancer is available directly on project object
        }
      }
    };

    fetchReviewsAndApp();
  }, [id, user]);

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

  const handlePayNow = async (targetId) => {
    if (!targetId || paying) return;
    setPaying(true);
    try {
      const response = await api.post('/payments/create-checkout-session', { projectId: targetId });
      if (response.data && response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to get checkout session URL.');
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      toast.error(err.response?.data?.message || 'Payment initiation failed.');
    } finally {
      setPaying(false);
    }
  };

  const currentUserId = String(user?.id || user?._id || "");

  const clientId = String(
    project?.client?.id ||
    project?.client?._id ||
    project?.client ||
    ""
  );

  const acceptedFreelancerId = String(
    project?.acceptedFreelancer?.id ||
    project?.acceptedFreelancer?._id ||
    project?.acceptedFreelancer ||
    fetchedAcceptedFreelancerId ||
    ""
  );

  const isCompleted = project?.status === "completed";

  const isClientParticipant =
    currentUserId !== "" &&
    clientId !== "" &&
    currentUserId === clientId;

  const isFreelancerParticipant =
    currentUserId !== "" &&
    acceptedFreelancerId !== "" &&
    currentUserId === acceptedFreelancerId;

  const isParticipant =
    isClientParticipant || isFreelancerParticipant;

  const targetUserId = isClientParticipant
    ? acceptedFreelancerId
    : isFreelancerParticipant
      ? clientId
      : "";

  const hasReviewed = reviews.some(
    (review) =>
      String(review.reviewer?.id || review.reviewer?._id || review.reviewer) ===
      currentUserId
  );

  const canReview =
    isCompleted &&
    isParticipant &&
    targetUserId !== "" &&
    !hasReviewed;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !project || !targetUserId) {
      toast.error('Unable to determine the participant to review.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        project: project._id || id,
        reviewedUser: targetUserId,
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });

      if (res.data && res.data.success) {
        toast.success('Review submitted successfully! ⭐');
        setShowReviewModal(false);
        setReviewComment('');
        // Refresh project reviews and project details
        const [updatedRes, projRes] = await Promise.all([
          api.get(`/reviews/project/${id}`),
          api.get(`/projects/${id}`),
        ]);
        if (updatedRes.data && updatedRes.data.success) {
          setReviews(updatedRes.data.reviews || []);
        }
        if (projRes.data && projRes.data.success) {
          setProject(projRes.data.project);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCompleteProject = async () => {
    const targetId = project?._id || id;
    if (!targetId || completing) return;
    try {
      setCompleting(true);
      const response = await api.put(`/projects/${targetId}/complete`);
      if (response.data && response.data.success) {
        toast.success('Project marked as completed successfully.');
        setShowCompleteModal(false);
        // Refresh project data
        const updatedRes = await api.get(`/projects/${targetId}`);
        if (updatedRes.data && updatedRes.data.success) {
          setProject(updatedRes.data.project);
        }
      }
    } catch (err) {
      console.error('Error completing project:', err);
      toast.error(err.response?.data?.message || 'Failed to mark project as completed. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400 font-medium">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-3">
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
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (s === 'in-progress') {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
    if (s === 'completed') {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  const isFreelancerUser = user?.role === 'freelancer';
  const isClientUser = user?.role === 'client';
  const isOpen = status === 'open';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100 bg-slate-950">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/projects" className="hover:text-emerald-400 font-medium">
            Projects
          </Link>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-[200px]">
            {title}
          </span>
        </div>
        <Link
          to="/projects"
          className="text-emerald-400 font-bold hover:underline"
        >
          ← Back to all projects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {category || 'General'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusBadge(
                  status
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-2 border-b border-slate-800 font-medium">
              <span>Posted on {formattedPostedDate}</span>
              <span>•</span>
              <span>{applications.length} proposal(s) received</span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-base font-black text-white">
                Project Description
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {description}
              </div>
            </div>

            {/* Skills Required */}
            {skills && skills.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h2 className="text-base font-black text-white">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700"
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
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📝</span> Apply for this Project
              </h2>

              {hasApplied ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center space-y-2">
                  <span className="text-2xl">✅</span>
                  <h3 className="text-base font-bold text-emerald-400">
                    Already Applied
                  </h3>
                  <p className="text-xs text-slate-300">
                    You have already submitted a proposal for this project.
                  </p>
                </div>
              ) : !isOpen ? (
                <div className="bg-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs font-semibold">
                  This project is currently <span className="capitalize">{status}</span> and is not accepting new proposals.
                </div>
              ) : (
                <form onSubmit={handleProposalSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Your Bid Amount ($ USD) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={bidAmountInput}
                      onChange={(e) => setBidAmountInput(e.target.value)}
                      placeholder="e.g. 2500"
                      disabled={submitting}
                      className="w-full text-sm rounded-lg border border-slate-700 p-2.5 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Proposal / Cover Letter <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={proposalInput}
                      onChange={(e) => setProposalInput(e.target.value)}
                      placeholder="Describe your relevant experience, technical approach, and delivery timeline..."
                      disabled={submitting}
                      className="w-full text-sm rounded-lg border border-slate-700 p-2.5 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting Proposal...' : 'Submit Proposal '}
                  </Button>
                </form>
              )}
            </div>
          )}
          {/* Project Reviews Section */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⭐</span> Project Reviews ({reviews.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Testimonials and contract feedback submitted for this project.
                </p>
                {!canReview && (
                  <p className="text-xs font-medium mt-1">
                    {!isCompleted ? (
                      <span className="text-amber-400">
                        Reviews become available once the project is completed.
                      </span>
                    ) : isCompleted && isParticipant && hasReviewed ? (
                      <span className="text-emerald-400">
                        You already reviewed this project. ✓
                      </span>
                    ) : isCompleted && !isParticipant ? (
                      <span className="text-slate-400">
                        Only the client and hired freelancer can review this project.
                      </span>
                    ) : null}
                  </p>
                )}
              </div>

              {canReview && (
                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer shadow-sm text-sm transition-colors"
                >
                  ★ Leave a Review
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="p-6 bg-slate-800/40 rounded-xl text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">
                  No reviews submitted for this project yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => {
                  const revName = r.reviewer?.name || 'User';
                  const revRole = r.reviewer?.role || 'User';
                  return (
                    <div
                      key={r._id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {r.reviewer?.profileImage ? (
                            <img
                              src={r.reviewer.profileImage}
                              alt={revName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center">
                              {revName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-white">
                              {revName}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-2 capitalize">
                              ({revRole})
                            </span>
                          </div>
                        </div>
                        <div className="text-amber-400 text-xs font-bold">
                          {'★'.repeat(r.rating)} ({r.rating}/5)
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-xs text-slate-300 leading-relaxed pl-10">
                          "{r.comment}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Column - Sticky on Desktop */}
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Action Card */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Project Budget
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {formattedBudget}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800 font-medium">
              <div className="flex justify-between py-1">
                <span>Deadline / Est. Duration:</span>
                <span className="font-bold text-white">
                  {formattedDeadline}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Escrow Protection:</span>
                <span className="font-bold text-emerald-400">
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
                  {status === 'in-progress' ? (
                    <>
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full font-bold"
                        onClick={() => handlePayNow(_id || id)}
                        disabled={paying}
                      >
                        {paying ? 'Connecting to Stripe...' : 'Pay Now 💳'}
                      </Button>

                      {isClientParticipant && (
                        <Button
                          variant="outline"
                          size="md"
                          className="w-full font-bold flex items-center justify-center gap-1.5"
                          onClick={() => setShowCompleteModal(true)}
                        >
                          ✅ Mark as Completed
                        </Button>
                      )}
                    </>
                  ) : status === 'completed' ? (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center text-xs font-bold text-purple-400">
                      Project Completed ✅
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-xs text-amber-400 font-semibold">
                      Accept a proposal to enable payment
                    </div>
                  )}

                  <Link to={`/applications?projectId=${_id || id}`} className="block">
                    <Button variant="outline" size="md" className="w-full">
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
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About the Client
            </h3>

            <div className="space-y-3 text-sm">
              <div className="font-black text-white text-base">
                {clientObj.name || 'Client'}
              </div>

              {clientObj.email && (
                <div className="text-xs text-slate-400 font-medium">
                  ✉️ {clientObj.email}
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold text-emerald-400">Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Proposal Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <form
            onSubmit={handleProposalSubmit}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Submit Your Proposal
              </h3>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Applying for:{' '}
              <strong className="text-white">{title}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Bid Amount ($ USD) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bidAmountInput}
                  onChange={(e) => setBidAmountInput(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-700 p-2.5 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Letter / Proposal <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={proposalInput}
                  onChange={(e) => setProposalInput(e.target.value)}
                  placeholder="Describe your relevant experience and why you are the best fit for this project..."
                  className="w-full text-sm rounded-lg border border-slate-700 p-2.5 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                {submitting ? 'Submitting...' : 'Submit Proposal '}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <form
            onSubmit={handleReviewSubmit}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⭐</span> Leave a Contract Review
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Project:{' '}
              <strong className="text-white">{title}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Overall Rating (1 to 5 Stars) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full text-sm rounded-lg border border-slate-700 p-2.5 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                  <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                  <option value={1}>⭐ (1 - Unsatisfactory)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Written Feedback / Comment
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your experience working together on this project..."
                  className="w-full text-sm rounded-lg border border-slate-700 p-2.5 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review ⭐'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Mark as Completed Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>✅</span> Mark Project as Completed?
              </h3>
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="text-slate-400 hover:text-white text-lg"
                disabled={completing}
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to mark this project as completed? This will make the project eligible for Reviews & Ratings.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setShowCompleteModal(false)}
                disabled={completing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleCompleteProject}
                disabled={completing}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
              >
                {completing ? 'Completing...' : 'Mark as Completed'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

