// src/pages/Admin/VisitorsManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiEye, FiMapPin, FiMonitor, FiSmartphone, 
  FiTablet, FiGlobe, FiDownload, FiSearch, FiLoader,
  FiCalendar, FiClock, FiTrendingUp, FiUserCheck, FiUserPlus
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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVisitors();
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await visitorAPI.getAllVisitors(currentPage, itemsPerPage, searchTerm);
      if (response.data?.success) {
        setVisitors(response.data.data);
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
      const response = await visitorAPI.getVisitorStats();
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
      window.open('/api/admin/visitors/export/csv', '_blank');
      toast.success('Export started');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-[#F59E0B]" />
      </div>
    );
  }

  // Calculate returning visitors
  const returningVisitors = (stats?.total || 0) - (stats?.unique || 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Website Visitors</h1>
          <p className="text-gray-500 text-sm mt-1">Track and analyze your website traffic</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FiDownload size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards - ACCURATE DATA */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 shadow-sm border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Visitors</p>
                <p className="text-2xl font-bold text-indigo-700">{stats.total || 0}</p>
              </div>
              <FiUsers className="w-8 h-8 text-indigo-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
            <div>
              <p className="text-gray-500 text-sm">Today</p>
              <p className="text-2xl font-bold text-green-700">{stats.today || 0}</p>
            </div>
            <p className="text-xs text-green-600 mt-1">Unique visitors today</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200">
            <div>
              <p className="text-gray-500 text-sm">This Week</p>
              <p className="text-2xl font-bold text-blue-700">{stats.week || 0}</p>
            </div>
            <p className="text-xs text-blue-600 mt-1">Last 7 days</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-200">
            <div>
              <p className="text-gray-500 text-sm">This Month</p>
              <p className="text-2xl font-bold text-purple-700">{stats.month || 0}</p>
            </div>
            <p className="text-xs text-purple-600 mt-1">Last 30 days</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm border border-orange-200">
            <div>
              <p className="text-gray-500 text-sm">New Visitors</p>
              <p className="text-2xl font-bold text-orange-700">{stats.unique || 0}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <FiUserPlus size={12} className="text-orange-500" />
              <p className="text-xs text-orange-600">First-time this week</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 shadow-sm border border-cyan-200">
            <div>
              <p className="text-gray-500 text-sm">Returning</p>
              <p className="text-2xl font-bold text-cyan-700">{returningVisitors}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <FiUserCheck size={12} className="text-cyan-500" />
              <p className="text-xs text-cyan-600">Returning visitors</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 shadow-sm border border-pink-200">
            <div>
              <p className="text-gray-500 text-sm">Avg/Day</p>
              <p className="text-2xl font-bold text-pink-700">{stats.avgDaily || 0}</p>
            </div>
            <p className="text-xs text-pink-600 mt-1">Last 7 days average</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {stats?.dailyViews && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Unique Visitors Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Daily Unique Visitors (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2} name="Unique Visitors" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Device Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.devices || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ deviceType, percent }) => `${deviceType || 'Unknown'}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
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
      )}

      {/* Browser Distribution Bar Chart */}
      {stats?.browsers && stats.browsers.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Browser Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.browsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="browser" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="_count" fill="#F59E0B" name="Unique Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by country, city, or device..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F59E0B]"
          />
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 text-[#F59E0B] border border-[#F59E0B] rounded-lg hover:bg-[#F59E0B] hover:text-white transition"
        >
          Refresh Stats
        </button>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Session ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Browser/OS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Visits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">First Seen</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No visitors found
                   </td>
                 </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-600">{visitor.sessionId?.slice(0, 12)}...</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} className="text-gray-400" />
                        <span className="text-sm">{visitor.city || 'Unknown'}, {visitor.country || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {visitor.deviceType === 'mobile' && <FiSmartphone size={14} className="text-blue-500" />}
                        {visitor.deviceType === 'tablet' && <FiTablet size={14} className="text-green-500" />}
                        {visitor.deviceType === 'desktop' && <FiMonitor size={14} className="text-purple-500" />}
                        <span className="text-sm capitalize">{visitor.deviceType || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div>{visitor.browser || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{visitor.os || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{visitor.visitCount || 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{new Date(visitor.firstVisit).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(visitor.firstVisit).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{new Date(visitor.lastVisit).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(visitor.lastVisit).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => fetchVisitorDetails(visitor.id)}
                        className="text-[#F59E0B] hover:text-[#B45309] text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* Add pagination component here if needed */}
      </div>

      {/* Visitor Details Modal */}
      {showModal && selectedVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white">
              <h2 className="text-xl font-bold">Visitor Details</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white text-2xl">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Session ID</p>
                  <p className="text-sm font-mono break-all">{selectedVisitor.sessionId}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">IP Address</p>
                  <p className="text-sm">{selectedVisitor.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="text-sm">{selectedVisitor.city || 'Unknown'}, {selectedVisitor.country || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Device</p>
                  <p className="text-sm capitalize">{selectedVisitor.deviceType || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Browser</p>
                  <p className="text-sm">{selectedVisitor.browser || 'Unknown'} {selectedVisitor.browserVersion || ''}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Operating System</p>
                  <p className="text-sm">{selectedVisitor.os || 'Unknown'} {selectedVisitor.osVersion || ''}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">First Visit</p>
                  <p className="text-sm">{new Date(selectedVisitor.firstVisit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Last Visit</p>
                  <p className="text-sm">{new Date(selectedVisitor.lastVisit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Visits</p>
                  <p className="text-sm font-bold">{selectedVisitor.visitCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Time Spent</p>
                  <p className="text-sm">{Math.floor(selectedVisitor.totalTimeSpent / 60)} minutes</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Referrer</p>
                  <p className="text-sm break-all">{selectedVisitor.referrer || 'Direct'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Landing Page</p>
                  <p className="text-sm break-all">{selectedVisitor.landingPage || '/'}</p>
                </div>
              </div>

              {selectedVisitor.pageViews?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Page Views</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedVisitor.pageViews.map((view, idx) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-2">
                        <span className="text-gray-600 truncate max-w-md">{view.pageUrl}</span>
                        <span className="text-gray-400 text-xs">{new Date(view.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
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