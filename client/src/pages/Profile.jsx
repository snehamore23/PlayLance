import React, { useState } from 'react';
import Button from '../components/Button';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const profileData = {
    name: 'Alex Morgan',
    role: 'Senior Full-Stack & Cloud Engineer',
    email: 'alex.morgan@paylance.dev',
    location: 'Austin, Texas, USA',
    rate: '$85/hr',
    bio: 'Experienced full-stack engineer specializing in React, Node.js, TypeScript, and high-throughput cloud microservices. 7+ years delivering scalable consumer and B2B SaaS platforms with clean code and robust test coverage.',
    skills: [
      'React.js',
      'Node.js',
      'Express.js',
      'TypeScript',
      'MongoDB',
      'PostgreSQL',
      'Tailwind CSS',
      'AWS / Docker',
      'GraphQL',
      'Next.js',
    ],
    experience: [
      {
        id: 1,
        title: 'Lead Full-Stack Developer',
        company: 'Veloce Dynamics (Remote)',
        period: '2023 - Present',
        description: 'Architected high-performance fintech payment gateways handling over 150k monthly transactions with 99.98% uptime.',
      },
      {
        id: 2,
        title: 'Senior Frontend Engineer',
        company: 'CloudStream Systems',
        period: '2021 - 2023',
        description: 'Led a distributed team of 6 engineers building an enterprise data visualization suite in React and WebGL.',
      },
      {
        id: 3,
        title: 'Software Developer',
        company: 'PixelCraft Labs',
        period: '2019 - 2021',
        description: 'Delivered customized MERN stack web applications for fast-growing startup clients.',
      },
    ],
    portfolio: [
      {
        id: 1,
        title: 'DefiPay Crypto Wallet & Analytics',
        category: 'Web3 & Fintech',
        link: 'https://example.com/project1',
        description: 'A multi-currency crypto tracking dashboard with real-time WebSocket feeds and biometric authentication flows.',
      },
      {
        id: 2,
        title: 'Pulse Healthcare Telemedicine App',
        category: 'HealthTech',
        link: 'https://example.com/project2',
        description: 'HIPAA-compliant video consultation platform connecting board-certified doctors with over 50,000 patients.',
      },
      {
        id: 3,
        title: 'OmniFlow Inventory Automation Engine',
        category: 'Logistics SaaS',
        link: 'https://example.com/project3',
        description: 'AI-driven logistics supply chain monitoring dashboard built with Node.js microservices and Redis queues.',
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Placeholder */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-md">
                AM
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Online" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {profileData.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Verified Talent
                </span>
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
                {profileData.role}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  📍 {profileData.location}
                </span>
                <span className="flex items-center gap-1">
                  ✉️ {profileData.email}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  💵 {profileData.rate}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => setIsEditing(!isEditing)}
            className="self-stretch sm:self-auto"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </div>

        {/* Bio */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Professional Summary
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-4xl">
            {profileData.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Core Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Experience & Portfolio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experience Column */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💼</span> Work Experience
            </h2>
            <span className="text-xs text-slate-400">3 roles verified</span>
          </div>

          <div className="space-y-6">
            {profileData.experience.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-6 border-l-2 border-emerald-500/30 space-y-1"
              >
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {exp.company}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Showcase Column */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎨</span> Portfolio Projects
            </h2>
            <span className="text-xs text-slate-400">Featured Work</span>
          </div>

          <div className="space-y-4">
            {profileData.portfolio.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 bg-slate-50/50 dark:bg-slate-850 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.category}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    View Project ↗
                  </a>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
