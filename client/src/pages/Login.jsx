import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login(formData.email, formData.password);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      const backendError = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMsg(backendError);
      toast.error(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in bg-slate-950">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-xl animate-scale-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              P
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              Pay<span className="text-emerald-400">Lance</span>
            </span>
          </Link>
          <h2 className="text-xl font-black tracking-tight text-white pt-2">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Welcome back! Please enter your credentials below.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-slide-down">
            {errorMsg}
          </div>
        )}

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
            disabled={isSubmitting}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer transition-colors p-1 flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-xs text-slate-400 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 mr-2 cursor-pointer"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

