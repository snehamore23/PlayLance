import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';

const ProjectDetails = () => {
  const { id } = useParams();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Placeholder project details
  const project = {
    id: id || '1',
    title: 'Full-Stack React & Node.js Developer for SaaS MVP',
    status: 'Open for Proposals',
    budget: '$3,500',
    type: 'Fixed-Price Milestone Contract',
    deadline: 'Est. 4-6 Weeks',
    postedDate: 'September 20, 2026',
    proposalsCount: 12,
    category: 'Web Development',
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT'],
    description: `We are developing an MVP for our B2B SaaS intelligence tool and need an experienced MERN stack engineer to build both frontend client dashboards and backend RESTful services.

Key Deliverables:
1. Interactive client dashboard with real-time analytics graphs.
2. Clean role-based authentication (Admin, Team Member, Client Viewer).
3. Optimized MongoDB database schemas and indexing.
4. Seamless integration with our third-party data enrichment APIs.

Requirements:
- Proven experience with React, Tailwind CSS, and Node/Express.
- Solid understanding of state management and responsive UI best practices.
- Excellent communication and clean Git commit habits.`,
    client: {
      name: 'Apex Finance Corp',
      location: 'New York, USA',
      memberSince: 'March 2024',
      rating: 4.95,
      reviewsCount: 34,
      totalSpent: '$48,500+',
      verifiedPayment: true,
      openJobs: 3,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/projects" className="hover:text-emerald-500">Projects</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200 font-medium">Project #{project.id}</span>
        </div>
        <Link to="/projects" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
          ← Back to all projects
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {project.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>Posted on {project.postedDate}</span>
              <span>•</span>
              <span>{project.proposalsCount} proposals received</span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Project Description
              </h2>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {project.description}
              </div>
            </div>

            {/* Skills Required */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
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
                {project.budget}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {project.type}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between py-1">
                <span>Estimated Duration:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{project.deadline}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Escrow Protection:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Guaranteed</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setShowApplyModal(true)}
              >
                Apply Now (Submit Proposal)
              </Button>

              <Link to={`/projects/${project.id}/edit`} className="block">
                <Button variant="outline" size="md" className="w-full">
                  Edit Project (Owner)
                </Button>
              </Link>
            </div>
          </div>

          {/* Client Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              About the Client
            </h3>

            <div className="space-y-3 text-sm">
              <div className="font-bold text-slate-900 dark:text-white text-base">
                {project.client.name}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>⭐ {project.client.rating}</span>
                <span className="text-slate-400">({project.client.reviewsCount} reviews)</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium">{project.client.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Spent:</span>
                  <span className="font-medium">{project.client.totalSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Member Since:</span>
                  <span className="font-medium">{project.client.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-semibold text-emerald-500">Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Apply Proposal Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Your Proposal
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Applying for: <strong className="text-slate-700 dark:text-slate-300">{project.title}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Bid Amount ($ USD)
                </label>
                <input
                  type="text"
                  defaultValue="3500"
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  defaultValue="30 days"
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Letter / Proposal
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your relevant experience and why you are the best fit for this project..."
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button variant="ghost" size="md" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={() => setShowApplyModal(false)}>
                Submit Proposal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
