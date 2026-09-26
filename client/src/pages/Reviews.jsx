import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';

const Reviews = () => {
  const { user } = useAuth();
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const currentUserId = String(user?.id || user?._id || '');

  const fetchUserReviews = async () => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/reviews/user/${currentUserId}`);
      if (res.data && res.data.success) {
        const allReviews = res.data.reviews || [];

        const received = allReviews.filter((review) => {
          const reviewedUserId = String(
            review.reviewedUser?.id ||
            review.reviewedUser?._id ||
            review.reviewedUser ||
            ''
          );
          return reviewedUserId !== '' && reviewedUserId === currentUserId;
        });

        const given = allReviews.filter((review) => {
          const reviewerId = String(
            review.reviewer?.id ||
            review.reviewer?._id ||
            review.reviewer ||
            ''
          );
          return reviewerId !== '' && reviewerId === currentUserId;
        });

        setReceivedReviews(received);
        setGivenReviews(given);
      } else {
        setReceivedReviews([]);
        setGivenReviews([]);
      }
    } catch (err) {
      console.error('Error fetching user reviews:', err);
      setError(err.response?.data?.message || 'Failed to load your reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUserReviews();
    }
  }, [currentUserId]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      setDeletingId(reviewId);
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res.data && res.data.success) {
        toast.success('Review deleted successfully');
        await fetchUserReviews();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Compute rating metrics derived ONLY from receivedReviews
  const totalReceived = receivedReviews.length;
  const avgRatingNum =
    totalReceived > 0
      ? receivedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        totalReceived
      : 0;
  const averageRating = totalReceived > 0 ? avgRatingNum.toFixed(1) : '0.0';

  const getRatingPercentage = (star) => {
    if (totalReceived === 0) return 0;
    const count = receivedReviews.filter(
      (review) => Math.min(5, Math.max(1, Math.round(Number(review.rating || 0)))) === star
    ).length;
    return Math.round((count / totalReceived) * 100);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Client & Partner Reviews
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Verified performance ratings and contract feedback received on PayLance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Breakdown Card (Derived from Received Feedback only) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 h-fit">
          <div className="text-center space-y-2">
            <div className="text-5xl font-black text-slate-900 dark:text-white">
              {averageRating}
            </div>
            <div className="flex justify-center text-amber-400 text-lg">
              {'★'.repeat(Math.round(Number(averageRating))) +
                '☆'.repeat(5 - Math.round(Number(averageRating)))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Based on {totalReceived} verified PayLance contract review(s)
            </p>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = getRatingPercentage(star);
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-12 text-slate-500 font-medium">
                    {star} star{star > 1 ? 's' : ''}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-slate-600 dark:text-slate-400">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Column: Received Feedback & Given Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Received Feedback */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Received Feedback ({totalReceived})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium">
                Loading received reviews...
              </div>
            ) : error ? (
              <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-center text-xs">
                {error}
              </div>
            ) : receivedReviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <div className="text-3xl">⭐</div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No reviews received yet.
                </p>
                <p className="text-xs max-w-sm mx-auto text-slate-500">
                  Complete contracts with clients or freelancers on PayLance to receive verified reviews and build your reputation.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {receivedReviews.map((r) => {
                  const reviewerName = r.reviewer?.name || 'PayLance User';
                  const reviewerRole = r.reviewer?.role || 'User';
                  const projectTitle = r.project?.title || 'Contract';

                  return (
                    <div
                      key={r._id}
                      className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {r.reviewer?.profileImage ? (
                            <img
                              src={r.reviewer.profileImage}
                              alt={reviewerName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                              {reviewerName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {reviewerName}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                              {reviewerRole} • {formatDate(r.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="text-amber-400 text-sm font-bold flex items-center gap-1">
                          <span>{'★'.repeat(Math.floor(r.rating || 0))}</span>
                          <span className="text-xs text-slate-600 dark:text-slate-300">
                            ({r.rating})
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Project: {projectTitle}
                      </p>

                      {r.comment && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                          "{r.comment}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Given Reviews */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Given Reviews ({givenReviews.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium">
                Loading given reviews...
              </div>
            ) : error ? (
              <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-center text-xs">
                {error}
              </div>
            ) : givenReviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <div className="text-3xl">📝</div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  You haven't submitted any reviews yet.
                </p>
                <p className="text-xs max-w-sm mx-auto text-slate-500">
                  After completing a project, you can leave contract reviews for your clients or freelancers.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {givenReviews.map((r) => {
                  const reviewedName = r.reviewedUser?.name || 'User';
                  const reviewedRole = r.reviewedUser?.role || 'User';
                  const projectTitle = r.project?.title || 'Contract';
                  const canDelete =
                    String(r.reviewer?.id || r.reviewer?._id || r.reviewer || '') ===
                    currentUserId;

                  return (
                    <div
                      key={r._id}
                      className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {r.reviewedUser?.profileImage ? (
                            <img
                              src={r.reviewedUser.profileImage}
                              alt={reviewedName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                              {reviewedName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {reviewedName}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                              {reviewedRole} • {formatDate(r.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-amber-400 text-sm font-bold flex items-center gap-1">
                            <span>{'★'.repeat(Math.floor(r.rating || 0))}</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                              ({r.rating})
                            </span>
                          </div>
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(r._id)}
                              disabled={deletingId === r._id}
                              className="text-xs text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Review"
                            >
                              {deletingId === r._id ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Project: {projectTitle}
                      </p>

                      {r.comment && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
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
      </div>
    </div>
  );
};

export default Reviews;
