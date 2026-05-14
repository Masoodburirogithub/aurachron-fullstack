// src/pages/Admin/CareersManager.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiDownload, FiEye, FiMail } from 'react-icons/fi';
import { adminAPI, careersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CareersManager = () => {
  const [positions, setPositions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    experience: '',
    description: '',
    requirements: [],
  });
  const [requirementInput, setRequirementInput] = useState('');

  useEffect(() => {
    fetchPositions();
    fetchApplications();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await careersAPI.getPositions();
      setPositions(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch positions');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await careersAPI.getApplications();
      if (response.data.success) {
        setApplications(response.data.data);
        console.log('Applications fetched:', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
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

  const updateApplicationStatus = async (id, status) => {
    try {
      await careersAPI.updateApplicationStatus(id, status);
      toast.success('Status updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()],
      });
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        await adminAPI.updatePosition(editingPosition.id, formData);
        toast.success('Position updated successfully');
      } else {
        await adminAPI.createPosition(formData);
        toast.success('Position created successfully');
      }
      setIsModalOpen(false);
      setEditingPosition(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'full-time',
        experience: '',
        description: '',
        requirements: [],
      });
      fetchPositions();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        await adminAPI.deletePosition(id);
        toast.success('Position deleted successfully');
        fetchPositions();
      } catch (error) {
        toast.error('Failed to delete position');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setShowApplications(false)}
            className={`px-4 py-2 rounded-lg font-medium transition ${!showApplications ? 'bg-[#F59E0B]/70 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Positions ({positions.length})
          </button>
          <button
            onClick={() => setShowApplications(true)}
            className={`px-4 py-2 rounded-lg font-medium transition ${showApplications ? 'bg-[#F59E0B]/70 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Applications ({applications.length})
          </button>
        </div>
        {!showApplications && (
          <button
            onClick={() => {
              setEditingPosition(null);
              setFormData({
                title: '',
                department: '',
                location: '',
                type: 'full-time',
                experience: '',
                description: '',
                requirements: [],
              });
              setIsModalOpen(true);
            }}
            className="bg-[#F59E0B] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add Position
          </button>
        )}
      </div>

      {/* Positions List */}
      {!showApplications && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {positions.map((position) => (
            <div key={position.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                  <p className="text-gray-600 mb-2">{position.department} • {position.location}</p>
                  <p className="text-sm text-gray-500 mb-3">{position.type} • {position.experience}</p>
                  <p className="text-gray-700 line-clamp-2">{position.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingPosition(position);
                    setFormData({
                      title: position.title,
                      department: position.department,
                      location: position.location,
                      type: position.type,
                      experience: position.experience,
                      description: position.description,
                      requirements: position.requirements,
                    });
                    setIsModalOpen(true);
                  }} className="text-blue-600 hover:text-blue-800 p-1">
                    <FiEdit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(position.id)} className="text-red-600 hover:text-red-800 p-1">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications List with CV Column - FIXED */}
      {showApplications && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
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
                      No applications received yet
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
                        <div className="text-sm text-gray-600">{app.experience || 'N/A'} years</div>
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
                          <span className="text-gray-400 text-sm">No CV uploaded</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)} border-0 focus:ring-1 focus:ring-[#F59E0B] cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
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
                                toast(`System Idea: ${app.systemIdea}`, { duration: 5000 });
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
      )}

      {/* Modal (same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingPosition ? 'Edit Position' : 'Add Position'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Experience *</label>
                <input
                  type="text"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    placeholder="Add a requirement"
                  />
                  <button type="button" onClick={addRequirement} className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#FBBF24] transition">
                    Add
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {formData.requirements.map((req, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm">{req}</span>
                      <button type="button" onClick={() => removeRequirement(idx)} className="text-red-600 hover:text-red-800">
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#FBBF24] transition">
                  {editingPosition ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersManager;