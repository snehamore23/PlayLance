import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
  const featuredProjects = [
    {
      id: '1',
      title: 'Full-Stack React & Node.js Developer for Fintech MVP',
      client: { name: 'Apex Finance', location: 'New York, NY', rating: 4.9 },
      category: 'Web Development',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      budget: '$3,500',
      type: 'Fixed Price',
      deadline: 'Est. 1 month',
      proposalsCount: 12,
      postedAt: '1 hour ago',
      description: 'We need an experienced full-stack engineer to develop our core investor portal with interactive charts and automated reporting.',
    },
    {
      id: '2',
      title: 'UI/UX Redesign for AI Analytics Platform',
      client: { name: 'CognitiveLabs', location: 'London, UK', rating: 5.0 },
      category: 'UI/UX Design',
      skills: ['Figma', 'Prototyping', 'Design Systems', 'UX Research'],
      budget: '$2,200',
      type: 'Fixed Price',
      deadline: 'Est. 3 weeks',
      proposalsCount: 7,
      postedAt: '3 hours ago',
      description: 'Looking for a senior UI/UX designer to overhaul our dashboard user flows and build a Figma design system compliant with WCAG.',
    },
    {
      id: '3',
      title: 'Cross-Platform Mobile App for On-Demand Logistics',
      client: { name: 'HyperShip Inc.', location: 'Berlin, DE', rating: 4.8 },
      category: 'Mobile Apps',
      skills: ['React Native', 'Firebase', 'Google Maps API', 'TypeScript'],
      budget: '$5,000',
      type: 'Fixed Price',
      deadline: 'Est. 2 months',
      proposalsCount: 15,
      postedAt: '5 hours ago',
      description: 'Build an iOS and Android app for delivery couriers featuring real-time GPS tracking, push notifications, and proof-of-delivery.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Post a Project or Browse Jobs',
      description: 'Clients post requirements with custom budgets. Freelancers discover curated projects tailored to their core technical stack.',
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Review Proposals & Collaborate',
      description: 'Evaluate competitive bids, review verified portfolio scores, and chat in real-time to align on project milestones.',
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Pay Securely on Completion',
      description: 'Funds are protected in PayLance escrow. Release payments only when milestones are completed to your full satisfaction.',
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950/10 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
            <span>🚀</span> Welcome to PayLance Freelancing Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Find Work. Hire Talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600">
              Get Things Done.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
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

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-base">✓</span> Zero Upfront Fees
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-base">✓</span> Verified Escrow Protection
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-base">✓</span> Top 1% Global Talent
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
            Simple Process
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            How PayLance Works
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From initial project posting to final milestone release, our platform ensures trust at every single step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
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
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Active Opportunities
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Projects
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Explore hand-picked, verified opportunities ready for proposals today.
            </p>
          </div>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              View All Projects →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
