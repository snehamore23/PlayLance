import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const PostProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    skills: '',
    budget: '',
    deadline: '',
  });

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit behavior for now
    navigate('/my-projects');
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
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
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
              placeholder="Outline the core deliverables, milestones, tech requirements, and any preferred architectural patterns..."
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
            <p className="text-xs text-slate-500">Provide as much detail as possible to get accurate proposals.</p>
          </div>

          {/* Skills */}
          <Input
            label="Required Skills"
            id="skills"
            name="skills"
            required
            placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS (comma-separated)"
            value={formData.skills}
            onChange={handleChange}
            helperText="Separate multiple skills with commas."
          />

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Estimated Budget ($ USD)"
              id="budget"
              name="budget"
              required
              placeholder="e.g. 2500"
              value={formData.budget}
              onChange={handleChange}
              helperText="Set a fixed milestone budget or hourly target."
            />

            <Input
              label="Estimated Deadline"
              id="deadline"
              name="deadline"
              required
              placeholder="e.g. 30 days or 2026-11-15"
              value={formData.deadline}
              onChange={handleChange}
              helperText="Expected completion timeline."
            />
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => navigate('/my-projects')}
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Publish Project 🚀
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
