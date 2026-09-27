import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import Input from '../components/Input';
import Button from '../components/Button';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/projects');
      if (response.data && response.data.success) {
        setProjects(response.data.projects || []);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const availableCategories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const statuses = ['All', 'open', 'in-progress', 'completed', 'cancelled'];

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (project.title && project.title.toLowerCase().includes(term)) ||
      (project.description && project.description.toLowerCase().includes(term));

    const matchesCategory =
      selectedCategory === 'All' ||
      (project.category && project.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' ||
      (project.status && project.status.toLowerCase() === selectedStatus.toLowerCase());

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Browse Available Projects
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Discover verified freelance jobs on PayLance with protected escrow payments.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="search"
              name="search"
              placeholder="Search by project title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          {searchTerm && (
            <Button variant="outline" size="md" onClick={() => setSearchTerm('')} className="shrink-0">
              Clear Search
            </Button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 capitalize font-medium cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results State */}
      {loading ? (
        <div className="p-12 text-center text-slate-600 dark:text-slate-400 font-medium">
          Loading projects from PayLance...
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-center space-y-3">
          <p className="font-semibold">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProjects}>
            Retry
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <div className="text-3xl">📁</div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            No projects available yet.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            {projects.length === 0
              ? 'Check back later or post a new project.'
              : 'No projects match your current search and filter criteria.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredProjects.length}</strong> of {projects.length} available project(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;

