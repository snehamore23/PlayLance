import React, { useState } from 'react';
import Button from '../components/Button';

const Applications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      freelancer: 'Sarah Jenkins',
      role: 'Full-Stack Developer • 5.0 ⭐ (42 reviews)',
      projectTitle: 'Full-Stack React & Node.js Developer for SaaS MVP',
      bidAmount: '$3,200',
      duration: '25 days',
      status: 'Pending',
      submittedDate: '2 hours ago',
      proposal: 'Hi! I have extensive experience building scalable SaaS products using the MERN stack with Tailwind CSS. I recently shipped a similar dashboard for a fintech company with real-time analytics. I can start immediately and deliver high-quality, fully tested code.',
    },
    {
      id: 2,
      freelancer: 'David Chen',
      role: 'Senior React Engineer • 4.9 ⭐ (38 reviews)',
      projectTitle: 'UI/UX Redesign for AI Analytics Platform',
      bidAmount: '$2,100',
      duration: '18 days',
      status: 'Pending',
      submittedDate: '5 hours ago',
      proposal: 'Hello! I specialize in design systems, Figma component libraries, and Tailwind CSS. I have audited your product brief and have concrete suggestions on how to improve UX conversion and reduce customer drop-off.',
    },
    {
      id: 3,
      freelancer: 'Elena Rostova',
      role: 'Cloud & Node Specialist • 4.8 ⭐ (19 reviews)',
      projectTitle: 'Kubernetes Cluster & CI/CD Pipeline Automation',
      bidAmount: '$3,750',
      duration: '20 days',
      status: 'Accepted',
      submittedDate: 'Yesterday',
      proposal: 'Dear Client, I am a certified AWS Solutions Architect with deep hands-on Docker and Kubernetes experience. I can configure your GitHub actions and Helm charts according to enterprise security standards.',
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Project Applications & Proposals
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review incoming bids, evaluate freelancer portfolios, and accept contracts.
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center">
                    {app.freelancer[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.freelancer}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.role}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : app.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Applied for: <strong className="text-slate-700 dark:text-slate-300">{app.projectTitle}</strong> • {app.submittedDate}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                "{app.proposal}"
              </p>
            </div>

            {/* Bid info and buttons */}
            <div className="md:w-60 shrink-0 flex flex-col justify-between pt-4 md:pt-0 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-6 space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Bid Amount:</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {app.bidAmount}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Est. delivery: {app.duration}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  disabled={app.status === 'Accepted'}
                  onClick={() => handleStatusChange(app.id, 'Accepted')}
                >
                  Accept Proposal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  disabled={app.status === 'Rejected'}
                  onClick={() => handleStatusChange(app.id, 'Rejected')}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
