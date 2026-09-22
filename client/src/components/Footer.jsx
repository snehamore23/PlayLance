import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-lg">
                P
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Pay<span className="text-emerald-400">Lance</span> 🚀
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern full-stack freelancing platform connecting ambitious clients with world-class independent talent. Secure contracts, guaranteed milestones, and streamlined collaboration.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                ● Platform Operational
              </span>
            </div>
          </div>

          {/* Column: For Clients */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Clients
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/post-project" className="hover:text-emerald-400 transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-emerald-400 transition-colors">
                  Explore Talent
                </Link>
              </li>
              <li>
                <Link to="/payments" className="hover:text-emerald-400 transition-colors">
                  Escrow Protection
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-emerald-400 transition-colors">
                  Client Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: For Freelancers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Freelancers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="hover:text-emerald-400 transition-colors">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-emerald-400 transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/payments" className="hover:text-emerald-400 transition-colors">
                  Direct Payments
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                  Profile Showcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-emerald-400 transition-colors">
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-emerald-400 transition-colors">
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PayLance. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
