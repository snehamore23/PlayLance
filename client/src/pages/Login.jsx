import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit behavior for now
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
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
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                />
                Remember me
              </label>
              <a href="#forgot" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
