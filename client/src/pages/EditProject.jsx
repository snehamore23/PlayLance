import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: 'Full-Stack React & Node.js Developer for SaaS MVP',
    description: 'We are developing an MVP for our B2B SaaS intelligence tool and need an experienced MERN stack engineer to build both frontend client dashboards and backend RESTful services.',
    category: 'Web Development',
    skills: 'React, Node.js, Express, MongoDB, Tailwind CSS, JWT',
    budget: '3500',
    deadline: '30 days',
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
    // Placeholder update behavior
    navigate(`/projects/${id || '1'}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Edit Project #{id || '1'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update the scope, timeline, or budget requirements for this PayLance listing.
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
            value={formData.title}
            onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Skills */}
          <Input
            label="Required Skills"
            id="skills"
            name="skills"
            required
            value={formData.skills}
            onChange={handleChange}
          />

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Estimated Budget ($ USD)"
              id="budget"
              name="budget"
              required
              value={formData.budget}
              onChange={handleChange}
            />

            <Input
              label="Estimated Deadline"
              id="deadline"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => navigate(`/projects/${id || '1'}`)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Update Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
