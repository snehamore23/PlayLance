import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ProjectCard = ({ project }) => {
  const {
    id = '1',
    title = 'Full-Stack React & Node.js Developer for SaaS MVP',
    client = { name: 'Acme Technologies', location: 'San Francisco, CA', rating: 4.9 },
    category = 'Web Development',
    skills = ['React', 'Node.js', 'Tailwind CSS', 'MongoDB'],
    budget = '$2,500 - $4,000',
    type = 'Fixed Price',
    deadline = 'Est. 1 month',
    proposalsCount = 8,
    postedAt = '2 hours ago',
    description = 'We are looking for an experienced full-stack developer to help us build out the MVP of our modern analytics dashboard. Must have prior experience with REST APIs and clean component architecture.',
  } = project || {};

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Posted {postedAt}
          </span>
        </div>

        <Link to={`/projects/${id}`}>
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
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {type} • {deadline}
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {budget}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {proposalsCount} proposals
          </span>
          <Link to={`/projects/${id}`}>
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
