import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate/prepare API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMsg('If an account exists for this email, password reset instructions have been sent.');
      toast.success('Password reset link requested.');
    } catch (err) {
      console.error('Password reset error:', err);
      setErrorMsg('Failed to process request. Please try again.');
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
            Reset your password
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Enter the email address associated with your PayLance account to receive password recovery instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-slide-down">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-slide-down">
            {successMsg}
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            disabled={isSubmitting}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending Link...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 font-medium">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
