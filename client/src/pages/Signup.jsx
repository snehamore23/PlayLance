import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Freelancer', // 'Client' or 'Freelancer'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit behavior for now
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-lg">
              P
            </span>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pay<span className="text-emerald-500">Lance</span> 🚀
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
            Create your PayLance account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join thousands of professionals and clients getting work done.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('Freelancer')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  formData.role === 'Freelancer'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-2xl mb-1">💻</span>
                <span className="font-semibold text-sm">Freelancer</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Looking for projects</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('Client')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  formData.role === 'Client'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-2xl mb-1">🏢</span>
                <span className="font-semibold text-sm">Client</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hiring top talent</span>
              </button>
            </div>
          </div>

          <Input
            label="Full Name"
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            required
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
