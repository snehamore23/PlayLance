import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Input from '../components/Input';
import Button from '../components/Button';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');

  const categories = ['All', 'Web Development', 'Mobile Apps', 'UI/UX Design', 'DevOps & Cloud', 'AI & Machine Learning'];
  const skillsList = ['All', 'React', 'Node.js', 'Tailwind CSS', 'Figma', 'TypeScript', 'Python', 'MongoDB'];
  const budgetRanges = ['All', 'Under $1,000', '$1,000 - $3,000', '$3,000 - $5,000', '$5,000+'];

  const allProjects = [
    {
      id: '1',
      title: 'Full-Stack React & Node.js Developer for SaaS MVP',
      client: { name: 'Acme Technologies', location: 'San Francisco, CA', rating: 4.9 },
      category: 'Web Development',
      skills: ['React', 'Node.js', 'Tailwind CSS', 'MongoDB'],
      budget: '$2,500 - $4,000',
      type: 'Fixed Price',
      deadline: 'Est. 1 month',
      proposalsCount: 8,
      postedAt: '2 hours ago',
      description: 'We are looking for an experienced full-stack developer to help us build out the MVP of our modern analytics dashboard. Must have prior experience with REST APIs and clean component architecture.',
    },
    {
      id: '2',
      title: 'Modern Mobile Health & Fitness App in React Native',
      client: { name: 'VitalSync Corp', location: 'Austin, TX', rating: 4.8 },
      category: 'Mobile Apps',
      skills: ['React', 'TypeScript', 'Node.js'],
      budget: '$4,500',
      type: 'Fixed Price',
      deadline: 'Est. 6 weeks',
      proposalsCount: 14,
      postedAt: '4 hours ago',
      description: 'Looking for a React Native specialist to implement workout tracking, heart-rate device Bluetooth sync, and clean dark mode design.',
    },
    {
      id: '3',
      title: 'High-Converting Landing Page & Brand Identity Design',
      client: { name: 'Aura Studio', location: 'Berlin, Germany', rating: 5.0 },
      category: 'UI/UX Design',
      skills: ['Figma', 'Tailwind CSS'],
      budget: '$1,200',
      type: 'Fixed Price',
      deadline: 'Est. 10 days',
      proposalsCount: 5,
      postedAt: '5 hours ago',
      description: 'Need a senior Figma designer with Tailwind proficiency to redesign our main marketing page with high-converting CTAs and modern typography.',
    },
    {
      id: '4',
      title: 'Kubernetes Cluster & CI/CD Pipeline Automation',
      client: { name: 'ScaleCloud Global', location: 'Seattle, WA', rating: 4.9 },
      category: 'DevOps & Cloud',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Node.js'],
      budget: '$3,800',
      type: 'Fixed Price',
      deadline: 'Est. 3 weeks',
      proposalsCount: 6,
      postedAt: '1 day ago',
      description: 'Setup and harden an EKS cluster with automated GitHub Actions CI/CD workflows, Terraform state management, and Prometheus metrics.',
    },
    {
      id: '5',
      title: 'AI Customer Support Bot using LangChain & Python',
      client: { name: 'ChatFlow AI', location: 'Toronto, Canada', rating: 4.7 },
      category: 'AI & Machine Learning',
      skills: ['Python', 'MongoDB', 'React'],
      budget: '$5,500',
      type: 'Fixed Price',
      deadline: 'Est. 2 months',
      proposalsCount: 19,
      postedAt: '2 days ago',
      description: 'Develop a custom retrieval-augmented generation (RAG) assistant connected to our knowledge base and integrated into our web app.',
    },
    {
      id: '6',
      title: 'E-Commerce Store Redesign with Stripe Checkout',
      client: { name: 'Nordic Goods Co.', location: 'Oslo, Norway', rating: 5.0 },
      category: 'Web Development',
      skills: ['React', 'Tailwind CSS', 'Node.js'],
      budget: '$2,800',
      type: 'Fixed Price',
      deadline: 'Est. 3 weeks',
      proposalsCount: 11,
      postedAt: '2 days ago',
      description: 'Complete redesign of product catalog, responsive shopping bag, and customized multi-currency Stripe billing integration.',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse Available Projects
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Discover verified freelance jobs on PayLance with protected escrow payments.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="search"
              name="search"
              placeholder="Search by keywords (e.g. React, Full-Stack, Figma)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <Button variant="primary" size="md" className="shrink-0">
            Search Jobs
          </Button>
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
            >
              {skillsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Budget Range
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
            >
              {budgetRanges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Sort */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Showing <strong>{allProjects.length}</strong> available projects</span>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select className="bg-transparent border-none text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer">
            <option>Newest First</option>
            <option>Highest Budget</option>
            <option>Fewest Proposals</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
