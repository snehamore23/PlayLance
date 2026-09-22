import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import PostProject from './pages/PostProject';
import EditProject from './pages/EditProject';
import Applications from './pages/Applications';
import MyProjects from './pages/MyProjects';
import Messages from './pages/Messages';
import Payments from './pages/Payments';
import Reviews from './pages/Reviews';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes with MainLayout (Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Workspace / Dashboard Routes with DashboardLayout (Sidebar + Header) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
