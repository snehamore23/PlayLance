import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ProjectCard = ({ project }) => {
  if (!project) return null;

  const {
    _id,
    id,
    title,
    description,
    category,
    skills = [],
    budget,
    deadline,
    client,
    status = 'open',
    createdAt,
  } = project;

  const projectId = _id || id;

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

  const formattedPostedAt = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  const clientName =
    typeof client === 'object' && client !== null
      ? client.name || client.email || 'Client'
      : client || 'Client';

  const getStatusBadge = (st) => {
    const s = (st || 'open').toLowerCase();
    if (s === 'open') {
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
    if (s === 'in-progress') {
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
    if (s === 'completed') {
      return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    }
    return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {category || 'General'}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase border ${getStatusBadge(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <Link to={`/projects/${projectId}`}>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {skills && skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {typeof skill === 'string' ? skill : String(skill)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Due: {formattedDeadline} • Posted: {formattedPostedAt}
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {formattedBudget}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            By {clientName}
          </span>
          <Link to={`/projects/${projectId}`}>
            <Button size="sm" variant="primary">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
