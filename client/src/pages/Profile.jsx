import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    skills: '',
    experience: '',
    portfolio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/profile');
        if (response.data && response.data.success) {
          setProfile(response.data.user);
          if (setUser) {
            setUser((prev) => ({ ...prev, ...response.data.user }));
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profileData = profile || user || {};

  const handleStartEditing = () => {
    setFormData({
      name: profileData.name || '',
      bio: profileData.bio || '',
      location: profileData.location || '',
      skills: Array.isArray(profileData.skills)
        ? profileData.skills.join(', ')
        : profileData.skills || '',
      experience:
        typeof profileData.experience === 'string'
          ? profileData.experience
          : JSON.stringify(profileData.experience || ''),
      portfolio: Array.isArray(profileData.portfolio)
        ? profileData.portfolio.join(', ')
        : profileData.portfolio || '',
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills
          ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        experience: formData.experience,
        portfolio: formData.portfolio
          ? formData.portfolio.split(',').map((p) => p.trim()).filter(Boolean)
          : [],
      };

      const response = await api.put('/users/profile', payload);
      if (response.data && response.data.success) {
        setProfile(response.data.user);
        if (setUser) {
          setUser((prev) => ({ ...prev, ...response.data.user }));
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile && !user) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Loading profile...
      </div>
    );
  }

  const renderSkills = (skills) => {
    let skillList = [];
    if (Array.isArray(skills)) {
      skillList = skills;
    } else if (typeof skills === 'string' && skills.trim() !== '') {
      skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (!skillList || skillList.length === 0) {
      return <p className="text-xs text-slate-500 italic">Not added yet</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {skillList.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {typeof skill === 'string' ? skill : skill.name || String(skill)}
          </span>
        ))}
      </div>
    );
  };

  const renderExperience = (experience) => {
    if (!experience) {
      return <p className="text-xs text-slate-500 italic">Not added yet</p>;
    }

    if (Array.isArray(experience) && experience.length > 0) {
      return (
        <div className="space-y-6">
          {experience.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="relative pl-6 border-l-2 border-emerald-500/30 space-y-1"
            >
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {exp.title || 'Role'}
                </h3>
                {exp.period && (
                  <span className="text-xs text-slate-400 font-medium">
                    {exp.period}
                  </span>
                )}
              </div>
              {exp.company && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {exp.company}
                </p>
              )}
              {exp.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof experience === 'string' && experience.trim() !== '') {
      return (
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
          {experience}
        </p>
      );
    }

    return <p className="text-xs text-slate-500 italic">Not added yet</p>;
  };

  const renderPortfolio = (portfolio) => {
    if (!portfolio) {
      return <p className="text-xs text-slate-500 italic">Not added yet</p>;
    }

    let items = [];
    if (Array.isArray(portfolio)) {
      items = portfolio;
    } else if (typeof portfolio === 'string' && portfolio.trim() !== '') {
      items = portfolio.split(',').map((p) => p.trim()).filter(Boolean);
    }

    if (items.length === 0) {
      return <p className="text-xs text-slate-500 italic">Not added yet</p>;
    }

    return (
      <div className="space-y-4">
        {items.map((item, idx) => {
          if (typeof item === 'object' && item !== null) {
            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 bg-slate-50/50 dark:bg-slate-850 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.category || 'Project'}
                  </span>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      View Project ↗
                    </a>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title || 'Untitled Project'}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            );
          }

          const isUrl =
            typeof item === 'string' &&
            (item.startsWith('http://') || item.startsWith('https://'));

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 bg-slate-50/50 dark:bg-slate-850 transition-all space-y-1"
            >
              {isUrl ? (
                <a
                  href={item}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline break-all"
                >
                  🔗 {item}
                </a>
              ) : (
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {item}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt={profileData.name || 'User'}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-md">
                  {getInitials(profileData.name)}
                </div>
              )}
              <span
                className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                title="Online"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {profileData.name || 'Not added yet'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {profileData.role || 'User'}
                </span>
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium capitalize">
                {profileData.role ? `${profileData.role} Profile` : 'Not added yet'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  📍 {profileData.location || 'Not added yet'}
                </span>
                <span className="flex items-center gap-1">
                  ✉️ {profileData.email || 'Not added yet'}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  ⭐ {profileData.rating !== undefined && profileData.rating !== null ? `${profileData.rating} / 5` : 'Not added yet'}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                handleStartEditing();
              }
            }}
            className="self-stretch sm:self-auto"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Edit Profile Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Austin, Texas, USA"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Bio / Professional Summary
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself and your professional expertise..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Core Technical Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React.js, Node.js, Express, MongoDB"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Work Experience
              </label>
              <textarea
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Describe your work experience and key accomplishments..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Portfolio Projects / Links (comma separated)
              </label>
              <input
                type="text"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://github.com/myproject, https://myportfolio.com"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        ) : (
          <>
            {/* Bio */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Professional Summary
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-4xl">
                {profileData.bio || 'Not added yet'}
              </p>
            </div>

            {/* Skills */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Core Technical Skills
              </h2>
              {renderSkills(profileData.skills)}
            </div>
          </>
        )}
      </div>

      {/* Experience & Portfolio Section */}
      {!isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience Column */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>💼</span> Work Experience
              </h2>
            </div>

            {renderExperience(profileData.experience)}
          </div>

          {/* Portfolio Showcase Column */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎨</span> Portfolio Projects
              </h2>
            </div>

            {renderPortfolio(profileData.portfolio)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
