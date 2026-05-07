// src/pages/Admin/ServicesManager.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { servicesAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Available icons for selection
const availableIcons = [
  'Brain', 'Cloud', 'Smartphone', 'RefreshCw', 'Shield', 'TrendingUp',
  'Zap', 'Cpu', 'Database', 'Server', 'Network', 'Lock', 'User', 'Settings'
];

// Available gradients
const gradients = [
  'from-blue-500 to-indigo-500',
  'from-cyan-500 to-blue-500',
  'from-green-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-purple-500 to-pink-500',
  'from-yellow-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-purple-500'
];

// Available colors
const colors = ['blue', 'cyan', 'green', 'orange', 'purple', 'yellow', 'pink', 'indigo'];

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Brain',
    features: [],
    gradient: 'from-blue-500 to-indigo-500',
    color: 'blue',
    displayOrder: 0,
    isActive: true
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      // console.log('Fetched services:', response.data);
      
      if (response.data.success) {
        setServices(response.data.data);
      } else if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        setServices([]);
      }
      toast.success('Services loaded');
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData);
        toast.success('Service updated successfully');
      } else {
        await servicesAPI.create(formData);
        toast.success('Service created successfully');
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      resetForm();
      await fetchServices();
      
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.delete(id);
        toast.success('Service deleted successfully');
        await fetchServices();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete service');
      }
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || 'Brain',
      features: service.features || [],
      gradient: service.gradient || 'from-blue-500 to-indigo-500',
      color: service.color || 'blue',
      displayOrder: service.displayOrder || 0,
      isActive: service.isActive !== undefined ? service.isActive : true
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'Brain',
      features: [],
      gradient: 'from-blue-500 to-indigo-500',
      color: 'blue',
      displayOrder: 0,
      isActive: true
    });
    setFeatureInput('');
    setEditingService(null);
  };

  const toggleStatus = async (service) => {
    try {
      await servicesAPI.update(service.id, { ...service, isActive: !service.isActive });
      toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'}`);
      await fetchServices();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your services displayed on the homepage</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <FiPlus /> Add Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-indigo-600">{services.length}</div>
          <div className="text-sm text-gray-500">Total Services</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600">{services.filter(s => s.isActive).length}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-600">{services.filter(s => !s.isActive).length}</div>
          <div className="text-sm text-gray-500">Inactive</div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No services found. Click "Add Service" to create one.
                   </td>
                 </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="text-xl">{service.icon === 'Brain' ? '🧠' : service.icon === 'Cloud' ? '☁️' : service.icon === 'Smartphone' ? '📱' : service.icon === 'Shield' ? '🛡️' : '⚙️'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{service.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{service.features.length} features</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{service.displayOrder}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(service)}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          service.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {service.isActive ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-800" title="Edit">
                          <FiEdit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800" title="Delete">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., AI Development & Agents"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the service..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gradient</label>
                  <select
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {gradients.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {colors.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="Add a feature"
                  />
                  <button type="button" onClick={addFeature} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                    Add
                  </button>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                      <span>{feature}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-600">
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="true">Active (Visible on website)</option>
                  <option value="false">Inactive (Hidden)</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                  {submitting ? <><FiLoader className="w-4 h-4 animate-spin" /> {editingService ? 'Updating...' : 'Creating...'}</> : <>{editingService ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;