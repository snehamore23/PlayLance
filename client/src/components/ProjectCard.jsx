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

  const formatValidDate = (dateVal, fallback = 'No deadline') => {
    if (!dateVal) return fallback;
    const dateObj = new Date(dateVal);
    if (isNaN(dateObj.getTime())) return fallback;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formattedDeadline = formatValidDate(deadline, 'No deadline');
  const formattedPostedAt = formatValidDate(createdAt, 'Recently');

  const clientName =
    typeof client === 'object' && client !== null
      ? client.name || client.email || 'Client'
      : client || 'Client';

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

  return (
    <div className="spotlight-card rounded-2xl p-6 flex flex-col justify-between group cursor-pointer bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs dark:shadow-none">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 tracking-wide">
            {category || 'General'}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <Link to={`/projects/${projectId}`}>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {skills && skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {typeof skill === 'string' ? skill : String(skill)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Due: {formattedDeadline} • Posted: {formattedPostedAt}
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formattedBudget}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline font-medium">
            By <strong className="text-slate-800 dark:text-slate-200">{clientName}</strong>
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

