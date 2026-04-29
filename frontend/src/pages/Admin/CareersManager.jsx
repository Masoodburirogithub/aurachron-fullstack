// src/pages/Admin/CareersManager.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { adminAPI, careersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CareersManager = () => {
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
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
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await careersAPI.getPositions();
      setPositions(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch positions');
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Career Positions Management</h1>
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
          className="bg-accent text-primary px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add Position
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {positions.map((position) => (
          <div key={position.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                <p className="text-gray-600 mb-2">{position.department} • {position.location}</p>
                <p className="text-sm text-gray-500 mb-3">{position.type} • {position.experience}</p>
                <p className="text-gray-700">{position.description.substring(0, 150)}...</p>
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
                }} className="text-blue-600">
                  <FiEdit2 size={20} />
                </button>
                <button onClick={() => handleDelete(position.id)} className="text-red-600">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal similar to CaseStudiesManager */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
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
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
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
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
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
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="Add a requirement"
                  />
                  <button type="button" onClick={addRequirement} className="px-4 py-2 bg-accent rounded-lg">
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.requirements.map((req, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                      <span>{req}</span>
                      <button type="button" onClick={() => removeRequirement(idx)} className="text-red-600">
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold">
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