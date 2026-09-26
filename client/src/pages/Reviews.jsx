import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUserReviews = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/reviews/user/${user._id}`);
      if (res.data && res.data.success) {
        setReviews(res.data.reviews || []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching user reviews:', err);
      setError(err.response?.data?.message || 'Failed to load your reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, [user?._id]);

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

  // Compute rating metrics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : user?.rating
      ? Number(user.rating).toFixed(1)
      : '0.0';

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 0)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const getPercentage = (count) => (totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0);

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
        {/* Rating Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 h-fit">
          <div className="text-center space-y-2">
            <div className="text-5xl font-black text-slate-900 dark:text-white">
              {avgRating}
            </div>
            <div className="flex justify-center text-amber-400 text-lg">
              {'★'.repeat(Math.round(Number(avgRating))) + '☆'.repeat(5 - Math.round(Number(avgRating)))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Based on {totalReviews} verified PayLance contract review(s)
            </p>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = getPercentage(starCounts[star]);
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-12 text-slate-500 font-medium">{star} star{star > 1 ? 's' : ''}</span>
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

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Received Feedback ({totalReviews})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium">
                Loading reviews...
              </div>
            ) : error ? (
              <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-center text-xs">
                {error}
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <div className="text-3xl">⭐</div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No reviews received yet
                </p>
                <p className="text-xs max-w-sm mx-auto">
                  Complete contracts with clients or freelancers on PayLance to receive verified reviews and build your reputation.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.map((r) => {
                  const reviewerName = r.reviewer?.name || 'PayLance User';
                  const reviewerRole = r.reviewer?.role || 'User';
                  const projectTitle = r.project?.title || 'Contract';
                  const isOwnReview = r.reviewer?._id === user?._id;

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

                        <div className="flex items-center gap-3">
                          <div className="text-amber-400 text-sm font-bold flex items-center gap-1">
                            <span>{'★'.repeat(Math.floor(r.rating))}</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300">({r.rating})</span>
                          </div>
                          {isOwnReview && (
                            <button
                              onClick={() => handleDeleteReview(r._id)}
                              disabled={deletingId === r._id}
                              className="text-xs text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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
