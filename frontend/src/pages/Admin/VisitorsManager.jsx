// src/pages/Admin/VisitorsManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiEye, FiMapPin, FiMonitor, FiSmartphone, 
  FiTablet, FiGlobe, FiDownload, FiSearch, FiLoader,
  FiCalendar, FiClock, FiTrendingUp, FiUserCheck, FiUserPlus,
  FiArrowLeft, FiArrowRight, FiChevronDown
} from 'react-icons/fi';
import { visitorAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const VisitorsManager = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const itemsPerPage = 10;
  
  // Date range state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Helper function to get readable page name
  const getReadablePageName = (url) => {
    if (!url) return 'Unknown Page';
    
    // Remove query parameters
    let cleanUrl = url.split('?')[0];
    
    // Map routes to readable names
    const pageMappings = {
      '/': '🏠 Home Page',
      '/about': '📄 About Page',
      '/services': '⚙️ Services Page',
      '/case-studies': '📁 Case Studies Page',
      '/careers': '💼 Careers Page',
      '/contact': '📞 Contact Page',
      '/admin': '🔧 Admin Dashboard',
      '/admin/login': '🔐 Admin Login',
      '/admin/dashboard': '📊 Admin Dashboard',
      '/admin/case-studies': '📋 Admin - Case Studies',
      '/admin/careers': '👔 Admin - Careers',
      '/admin/contacts': '✉️ Admin - Contacts',
      '/admin/applications': '📝 Admin - Applications',
      '/admin/services': '🔧 Admin - Services',
      '/admin/hero': '🎨 Admin - Hero Section',
      '/admin/rag': '🧠 Admin - RAG Knowledge Base',
      '/admin/rag-users': '👥 Admin - RAG Conversations',
      '/admin/visitors': '📊 Admin - Website Visitors',
    };
    
    // Check for uploads (images/videos)
    if (cleanUrl.includes('/uploads/')) {
      if (cleanUrl.includes('.mp4') || cleanUrl.includes('.webm')) {
        return '🎬 Video View';
      }
      if (cleanUrl.includes('.jpg') || cleanUrl.includes('.jpeg') || cleanUrl.includes('.png') || cleanUrl.includes('.gif')) {
        return '🖼️ Image View';
      }
      return '📁 File Download';
    }
    
    // Check for detail pages
    if (cleanUrl.includes('/case-studies/') && cleanUrl !== '/case-studies') {
      return '📖 Case Study Detail';
    }
    if (cleanUrl.includes('/services/') && cleanUrl !== '/services') {
      return '🔧 Service Detail';
    }
    
    return pageMappings[cleanUrl] || cleanUrl || 'Unknown Page';
  };

  useEffect(() => {
    fetchVisitors();
    fetchStats();
  }, [currentPage, searchTerm, isFilterApplied]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await visitorAPI.getAllVisitors(currentPage, itemsPerPage, searchTerm, startDate, endDate);
      if (response.data?.success) {
        setVisitors(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast.error('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await visitorAPI.getVisitorStats(startDate, endDate);
      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchVisitorDetails = async (id) => {
    try {
      const response = await visitorAPI.getVisitorById(id);
      if (response.data?.success) {
        setSelectedVisitor(response.data.data);
        setShowModal(true);
      }
    } catch (error) {
      toast.error('Failed to load visitor details');
    }
  };

  const exportCSV = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }
    
    // Build URL with date filters
    let url = '/api/admin/visitors/export/csv';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    // Fetch with authentication header
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/admin/login';
        return;
      }
      throw new Error('Export failed');
    }
    
    // Get the blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `visitors_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    
    toast.success('Export completed successfully');
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Failed to export CSV');
  }
};

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      toast.error('Please select at least one date');
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }
    setIsFilterApplied(true);
    setCurrentPage(1);
    setShowDateFilter(false);
    toast.success('Date filter applied');
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsFilterApplied(false);
    setCurrentPage(1);
    toast.success('Date filter cleared');
  };

  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-[#F59E0B] mx-auto mb-3" />
          <p className="text-gray-500">Loading visitors data...</p>
        </div>
      </div>
    );
  }

  const returningVisitors = (stats?.total || 0) - (stats?.unique || 0);

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Website Visitors</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Track and analyze your website traffic</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#F59E0B] transition w-full sm:w-auto"
        >
          <FiDownload size={16} /> Export CSV
        </button>
      </div>

      {/* Mobile Date Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowDateFilter(!showDateFilter)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FiCalendar className="text-[#F59E0B]" />
            <span className="text-sm font-medium">Filter by Date</span>
            {isFilterApplied && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Active</span>
            )}
          </div>
          <FiChevronDown className={`transform transition-transform ${showDateFilter ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Date Range Filter Section */}
      <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 ${showDateFilter ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" size={18} />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5">
              <button
                onClick={applyDateFilter}
                className="flex-1 px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-medium hover:bg-[#FBBF24] transition"
              >
                Apply
              </button>
              <button
                onClick={clearDateFilter}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
          {isFilterApplied && (
            <span className="hidden md:inline-block text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Filter Active
            </span>
          )}
        </div>
        {isFilterApplied && (
          <div className="mt-3 md:hidden text-center">
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Filter Active
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">Total Visitors</p>
            <p className="text-xl font-bold text-indigo-600">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">Today</p>
            <p className="text-xl font-bold text-green-600">{stats.today || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">This Week</p>
            <p className="text-xl font-bold text-blue-600">{stats.week || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">This Month</p>
            <p className="text-xl font-bold text-purple-600">{stats.month || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">New Visitors</p>
            <p className="text-xl font-bold text-orange-600">{stats.unique || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">Returning</p>
            <p className="text-xl font-bold text-cyan-600">{returningVisitors}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs">Avg/Day</p>
            <p className="text-xl font-bold text-pink-600">{stats.avgDaily || 0}</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {stats?.dailyViews && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 w-full">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Daily Unique Visitors (Last 7 Days)</h3>
            <div className="w-full h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} name="Unique Visitors" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 w-full">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Device Distribution</h3>
            <div className="w-full h-[250px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.devices || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ deviceType, percent }) => `${deviceType || 'Unknown'}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="_count"
                    nameKey="deviceType"
                  >
                    {(stats.devices || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Browser Distribution */}
      {stats?.browsers && stats.browsers.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 w-full">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Browser Distribution</h3>
          <div className="w-full h-[250px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.browsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="browser" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                <Bar dataKey="_count" fill="#F59E0B" name="Visitors" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by country, city, or device..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Browser/OS</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Seen</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-3 py-8 text-center text-gray-400">
                    No visitors found
                  </td>
                </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-mono text-gray-500">{visitor.sessionId?.slice(0, 12)}...</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600 truncate max-w-[120px]">{visitor.city || 'Unknown'}, {visitor.country || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {visitor.deviceType === 'mobile' && <FiSmartphone size={14} className="text-blue-400 flex-shrink-0" />}
                        {visitor.deviceType === 'tablet' && <FiTablet size={14} className="text-green-400 flex-shrink-0" />}
                        {visitor.deviceType === 'desktop' && <FiMonitor size={14} className="text-purple-400 flex-shrink-0" />}
                        <span className="text-sm text-gray-600 capitalize">{visitor.deviceType || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-sm text-gray-600">{visitor.browser || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{visitor.os || 'Unknown'}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-sm font-medium text-gray-700">{visitor.visitCount || 1}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-sm text-gray-600">{new Date(visitor.firstVisit).toLocaleDateString()}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="text-sm text-gray-600">{new Date(visitor.lastVisit).toLocaleDateString()}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => fetchVisitorDetails(visitor.id)}
                        className="text-[#F59E0B] hover:text-[#B45309] text-sm font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 order-2 sm:order-1">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-white transition"
              >
                <FiArrowLeft size={14} />
              </button>
              <span className="px-3 py-1 rounded-lg bg-[#F59E0B] text-white text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-white transition"
              >
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visitor Details Modal */}
      {showModal && selectedVisitor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 border-b bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white">
              <h2 className="text-base sm:text-lg font-bold">Visitor Details</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-xl sm:text-2xl leading-none">
                &times;
              </button>
            </div>
            
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Session ID</p>
                  <p className="text-xs sm:text-sm font-mono text-gray-700 break-all">{selectedVisitor.sessionId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">IP Address</p>
                  <p className="text-sm text-gray-700">{selectedVisitor.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Location</p>
                  <p className="text-sm text-gray-700">{selectedVisitor.city || 'Unknown'}, {selectedVisitor.country || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Device</p>
                  <p className="text-sm text-gray-700 capitalize">{selectedVisitor.deviceType || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Browser</p>
                  <p className="text-sm text-gray-700">{selectedVisitor.browser || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">OS</p>
                  <p className="text-sm text-gray-700">{selectedVisitor.os || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">First Visit</p>
                  <p className="text-sm text-gray-700">{new Date(selectedVisitor.firstVisit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Last Visit</p>
                  <p className="text-sm text-gray-700">{new Date(selectedVisitor.lastVisit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Total Visits</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedVisitor.visitCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Time Spent</p>
                  <p className="text-sm text-gray-700">{Math.floor(selectedVisitor.totalTimeSpent / 60)} minutes</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Referrer</p>
                  <p className="text-sm text-gray-700 break-all">{selectedVisitor.referrer || 'Direct'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Landing Page</p>
                  <p className="text-sm text-gray-700 break-all">{selectedVisitor.landingPage || '/'}</p>
                </div>
              </div>

              {/* Page Views Section with Clean Names */}
              {selectedVisitor.pageViews?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Page Views</h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {selectedVisitor.pageViews.map((view, idx) => {
                      const pageName = getReadablePageName(view.pageUrl);
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between text-sm border-b border-gray-100 pb-1.5 gap-1">
                          <span className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-md">
                            {pageName}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(view.createdAt).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorsManager;