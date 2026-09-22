import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-4xl shadow-inner border border-emerald-200 dark:border-emerald-800">
          🚀
        </div>

        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Sorry, we couldn’t find the page you’re looking for on PayLance. It might have been moved or deleted.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="lg">
              ← Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
