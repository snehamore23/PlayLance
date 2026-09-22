import React, { useState } from 'react';
import Button from '../components/Button';

const Reviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      client: 'Apex Finance Corp',
      author: 'Jonathan Miller, CTO',
      rating: 5,
      date: 'Sep 15, 2026',
      project: 'Full-Stack React & Node.js Developer for SaaS MVP',
      feedback: 'Alex delivered top-tier work on our investor portal. Excellent communication, rock-solid React architecture, and completed ahead of schedule. Would definitely hire again!',
    },
    {
      id: 2,
      client: 'CognitiveLabs',
      author: 'Sophia Zhang, Lead Designer',
      rating: 5,
      date: 'Aug 29, 2026',
      project: 'UI/UX Redesign for AI Analytics Platform',
      feedback: 'Incredible attention to detail with Figma and Tailwind CSS. Translated our complex analytics views into intuitive and accessible user flows.',
    },
    {
      id: 3,
      client: 'Nordic Goods Co.',
      author: 'Lars Nygård, Founder',
      rating: 4.8,
      date: 'Jul 14, 2026',
      project: 'E-Commerce Store Redesign with Stripe',
      feedback: 'Great MERN stack developer! Implemented custom Stripe checkouts seamlessly and guided our team through database indexing best practices.',
    },
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    projectName: '',
    comment: '',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Client Reviews & Feedback
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Verified testimonials and performance ratings on the PayLance marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl font-black text-slate-900 dark:text-white">
              4.9
            </div>
            <div className="flex justify-center text-amber-400 text-lg">
              ★★★★★
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on 28 verified PayLance contracts
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-500">5 stars</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="w-8 text-right font-medium">92%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-500">4 stars</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '8%' }} />
              </div>
              <span className="w-8 text-right font-medium">8%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-500">3 stars</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="w-8 text-right font-medium">0%</span>
            </div>
          </div>
        </div>

        {/* Review List & Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reviews List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Feedback
            </h2>

            <div className="space-y-5">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {r.client}
                      </h4>
                      <p className="text-xs text-slate-500">{r.author} • {r.date}</p>
                    </div>
                    <div className="text-amber-400 text-sm font-bold">
                      {'★'.repeat(Math.floor(r.rating))} ({r.rating})
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Project: {r.project}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    "{r.feedback}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Leave a Contract Review
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Contract
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack React & Node.js MVP"
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                    <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                    <option value={1}>⭐ (1 - Unsatisfactory)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Written Feedback
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details of your experience working together..."
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" size="md">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
