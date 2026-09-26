import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const PostProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    skills: '',
    budget: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'DevOps & Cloud',
    'AI & Machine Learning',
    'Content Writing',
    'Digital Marketing',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const isFreelancer = user?.role === 'freelancer';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFreelancer) {
      toast.error('Only clients can post projects.');
      setError('Access denied. Only client accounts are permitted to post projects.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Project description is required.');
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required.');
      return;
    }

    const numBudget = Number(formData.budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      setError('Budget must be a number greater than 0.');
      return;
    }

    if (!formData.deadline) {
      setError('Deadline date is required.');
      return;
    }
    const deadlineDate = new Date(formData.deadline);
    if (isNaN(deadlineDate.getTime())) {
      setError('Please select a valid deadline date.');
      return;
    }

    const skillsArray = formData.skills
      ? formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      skills: skillsArray,
      budget: numBudget,
      deadline: deadlineDate.toISOString(),
    };

    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/projects', payload);

      if (response.data && response.data.success) {
        toast.success('Project posted successfully!');
        navigate('/projects');
      } else {
        setError(response.data?.message || 'Failed to post project.');
      }
    } catch (err) {
      console.error('Error posting project:', err);
      const msg = err.response?.data?.message || 'Failed to post project. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Post a New Project
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tell the PayLance community about your project requirements and receive competitive bids.
        </p>
      </div>

      {isFreelancer && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>
            You are logged in as a <strong>Freelancer</strong>. Only client accounts are allowed to post projects.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Project Title"
            id="title"
            name="title"
            required
            placeholder="e.g. Build a Responsive E-Commerce Web App with React & Node.js"
            value={formData.title}
            onChange={handleChange}
            helperText="Write a clear, concise headline describing what you need built."
            disabled={isFreelancer || loading}
          />

          {/* Category */}
          <div className="space-y-1.5">
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Project Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isFreelancer || loading}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              disabled={isFreelancer || loading}
              placeholder="Outline the core deliverables, milestones, tech requirements, and any preferred architectural patterns..."
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
            />
            <p className="text-xs text-slate-500">Provide as much detail as possible to get accurate proposals.</p>
          </div>

          {/* Skills */}
          <Input
            label="Required Skills"
            id="skills"
            name="skills"
            required
            placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
            value={formData.skills}
            onChange={handleChange}
            helperText="Separate multiple skills with commas."
            disabled={isFreelancer || loading}
          />

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Estimated Budget ($ USD)"
              id="budget"
              name="budget"
              type="number"
              min="1"
              required
              placeholder="e.g. 2500"
              value={formData.budget}
              onChange={handleChange}
              helperText="Set a fixed budget (must be > 0)."
              disabled={isFreelancer || loading}
            />

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Estimated Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                disabled={isFreelancer || loading}
                className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
              />
              <p className="text-xs text-slate-500 mt-1">Target completion date.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => navigate('/projects')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isFreelancer || loading}
            >
              {loading ? 'Publishing Project...' : 'Publish Project 🚀'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
