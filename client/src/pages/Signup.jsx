import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Freelancer', // 'Client' or 'Freelancer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await signup(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      const backendError = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMsg(backendError);
      toast.error(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg space-y-8 bg-white dark:bg-slate-900/90 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl animate-scale-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              P
            </span>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pay<span className="text-emerald-500 dark:text-emerald-400">Lance</span>
            </span>
          </Link>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white pt-2">
            Create your PayLance account
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Join thousands of professionals and clients getting work done.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold animate-slide-down">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('Freelancer')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.role === 'Freelancer'
                    ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-2xl mb-1">💻</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">Freelancer</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Looking for projects</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('Client')}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.role === 'Client'
                    ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-2xl mb-1">🏢</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">Client</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Hiring top talent</span>
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="At least 8 characters (Uppercase, Lowercase, Number)"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none cursor-pointer transition-colors p-1 flex items-center justify-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

