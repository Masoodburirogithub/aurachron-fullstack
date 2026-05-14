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
import RagDocumentsManager from './RagDocumentsManager';
import RagUsersManager from './RagUsersManager';
import AdminNotification from './AdminNotification';
import VisitorsManager from './VisitorsManager';
import DemoRequestsManager from './DemoRequestsManager';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-auto min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar with mobile responsiveness */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onLogout={handleLogout} isMobile={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 overflow-auto">
        {/* Admin Header with Notification - Responsive */}
        <div className="bg-white shadow-sm sticky top-0 z-20 px-4 sm:px-6 md:px-8 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Aurachron Admin Panel</h1>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
              {/* Notification Component */}
              <AdminNotification />
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content - Responsive padding */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/visitors" element={<VisitorsManager />} />
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
            <Route path="/rag" element={<RagDocumentsManager />} />
            <Route path="/rag-users" element={<RagUsersManager />} />
            <Route path="/demo-requests" element={<DemoRequestsManager />} />
          </Routes>
        </div>
      </div>

      {/* Add responsive styles */}
      <style >{`
        @media (max-width: 767px) {
          .sidebar-transition {
            transition: transform 0.3s ease-in-out;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;