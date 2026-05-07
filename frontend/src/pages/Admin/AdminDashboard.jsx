// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import CaseStudiesManager from './CaseStudiesManager';
import CareersManager from './CareersManager';
import ContactsManager from './ContactsManager';
import ApplicationsManager from './ApplicationsManager';
import DashboardHome from './DashboardHome';
import { adminAPI } from '../../services/api';
import { initSocket, disconnectSocket } from '../../services/socket';
import toast from 'react-hot-toast';
import ServicesManager from './ServicesManager';
import PageSettingsManager from './PageSettingsManager';
import NavigationManager from './NavigationManager';
import DynamicServicesManager from './DynamicServicesManager';
import HeroSettingsManager from './HeroSettingsManager';


const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
    
    // Initialize WebSocket for real-time updates
    const socket = initSocket();
    socket.on('case-study-created', () => {
      toast.success('New case study added!');
      fetchStats();
    });
    socket.on('position-created', () => {
      toast.success('New position added!');
      fetchStats();
    });
    
    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<DashboardHome stats={stats} />} />
            <Route path="/case-studies" element={<CaseStudiesManager />} />
            <Route path="/careers" element={<CareersManager />} />
            <Route path="/contacts" element={<ContactsManager />} />
            <Route path="/applications" element={<ApplicationsManager />} />
            <Route path="/services" element={<ServicesManager />} />
            <Route path="/page-settings" element={<PageSettingsManager />} />
            <Route path="/navigation" element={<NavigationManager />} />
            <Route path="/header-services" element={<DynamicServicesManager />} />
            <Route path="/hero" element={<HeroSettingsManager />} />


          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;