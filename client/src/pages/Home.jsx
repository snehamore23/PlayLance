import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/projects');
        if (res.data && res.data.success) {
          setFeaturedProjects((res.data.projects || []).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured projects for Home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Post a Project or Browse Jobs',
      description: 'Clients post requirements with custom budgets. Freelancers discover curated projects tailored to their core technical stack.',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Review Proposals & Collaborate',
      description: 'Evaluate competitive bids, review verified portfolio scores, and chat in real-time to align on project milestones.',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Pay Securely on Completion',
      description: 'Funds are protected in PayLance escrow. Release payments only when milestones are completed to your full satisfaction.',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16 bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Find Work. Hire Talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
              Get Things Done.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            PayLance connects forward-thinking companies and top-tier independent professionals with verified contracts, escrow protection, and rapid delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/projects" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-8">
                Find Projects
              </Button>
            </Link>
            <Link to="/post-project" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                Hire Freelancers
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-base">✓</span> Zero Upfront Fees
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-base">✓</span> Verified Escrow Protection
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-base">✓</span> Top 1% Global Talent
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
            Simple Process
          </span>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            How PayLance Works
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            From initial project posting to final milestone release, our platform ensures trust at every single step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md relative flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <div>
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-3xl font-black text-slate-700">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Active Opportunities
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-white">
              Featured Projects
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explore hand-picked, verified opportunities ready for proposals today.
            </p>
          </div>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              View All Projects →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Loading featured projects...
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="p-12 bg-slate-900/80 rounded-2xl border border-slate-800 text-center space-y-2 shadow-sm">
            <p className="text-lg font-bold text-white">
              No projects available yet.
            </p>
            <p className="text-xs text-slate-400">Check back soon or post a new project!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

