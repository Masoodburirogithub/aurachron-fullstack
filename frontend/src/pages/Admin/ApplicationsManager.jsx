// src/pages/Admin/ApplicationsManager.jsx
import React, { useState, useEffect } from 'react';
import { FiDownload, FiMail, FiEye } from 'react-icons/fi';
import { adminAPI, careersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ApplicationsManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        toast.error('Please login again');
        window.location.href = '/admin/login';
        return;
      }
      
      const response = await careersAPI.getApplications();
      console.log('Applications fetched:', response.data);
      
      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      } else {
        toast.error('Failed to fetch applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await careersAPI.updateApplicationStatus(id, status);
      if (response.data.success) {
        toast.success('Status updated successfully');
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/admin/login';
      } else {
        toast.error('Failed to update status');
      }
    }
  };

  const downloadCV = async (applicationId, applicantName) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    // Use fetch with Authorization header
    const response = await fetch(`/api/careers/applications/${applicationId}/download-cv`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${applicantName}_CV.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('CV downloaded successfully');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to download CV');
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and review job applications</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {applications.length} applications
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    <div className="text-center">
                      <p className="text-gray-400">No applications received yet</p>
                      <p className="text-sm text-gray-400 mt-1">Applications will appear here when candidates apply</p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{app.fullName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{app.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{app.position}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">{app.experience ? `${app.experience} years` : '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      {app.cvUrl ? (
                        <button
                          onClick={() => downloadCV(app.id, app.fullName)}
                          className="flex items-center gap-1 text-[#F59E0B] hover:text-[#B45309] transition-colors text-sm font-medium"
                        >
                          <FiDownload size={14} /> Download CV
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No CV</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="px-2 py-1 border rounded-lg text-sm focus:ring-1 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                        <a
                          href={`mailto:${app.email}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Send Email"
                        >
                          <FiMail size={16} />
                        </a>
                        {app.systemIdea && (
                          <button
                            onClick={() => {
                              toast(`System Idea: ${app.systemIdea}`, { 
                                duration: 8000,
                                icon: '💡'
                              });
                            }}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="View System Idea"
                          >
                            <FiEye size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsManager;