// src/pages/Admin/CaseStudiesManager.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye, FiEyeOff, FiUpload, FiImage } from 'react-icons/fi';
// import { caseStudiesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { caseStudiesAPI, adminAPI, getImageUrl } from '../../services/api';
// import { getImageUrl } from '../../services/api';

const CaseStudiesManager = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    industry: '',
    technology: '',
    challenge: '',
    solution: '',
    result: '',
    displayOrder: 0,
    isActive: true,
    imageUrl: ''
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const response = await caseStudiesAPI.getAll();
      console.log('Fetched case studies:', response.data);
      
      if (response.data.success) {
        setCaseStudies(response.data.data);
      } else if (Array.isArray(response.data)) {
        setCaseStudies(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setCaseStudies(response.data.data);
      } else {
        setCaseStudies([]);
      }
      toast.success('Case studies loaded');
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast.error('Failed to fetch case studies');
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  // Handle image upload with compression
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB');
    return;
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please upload an image file');
    return;
  }
  
  // Compress image before upload
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Compress image
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Max dimensions
      const maxWidth = 1200;
      const maxHeight = 800;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to JPEG with 0.8 quality
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setImagePreview(compressedDataUrl);
      setFormData({ ...formData, imageUrl: compressedDataUrl });
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Prepare data - in production, you'd upload to cloud storage
      const submitData = { ...formData };
      
      if (editingStudy) {
        // UPDATE
        const response = await caseStudiesAPI.update(editingStudy.id, submitData);
        console.log('Update response:', response.data);
        toast.success('Case study updated successfully');
      } else {
        // CREATE
        const response = await caseStudiesAPI.create(submitData);
        console.log('Create response:', response.data);
        toast.success('Case study created successfully');
      }
      
      setIsModalOpen(false);
      setEditingStudy(null);
      resetForm();
      await fetchCaseStudies();
      
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
      try {
        await caseStudiesAPI.delete(id);
        toast.success('Case study deleted successfully');
        await fetchCaseStudies();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete case study');
      }
    }
  };

  const handleEdit = (study) => {
    setEditingStudy(study);
    setFormData({
      title: study.title || '',
      subtitle: study.subtitle || '',
      industry: study.industry || '',
      technology: study.technology || '',
      challenge: study.challenge || '',
      solution: study.solution || '',
      result: study.result || '',
      displayOrder: study.displayOrder || 0,
      isActive: study.isActive !== undefined ? study.isActive : true,
      imageUrl: study.imageUrl || ''
    });
    if (study.imageUrl) {
      setImagePreview(study.imageUrl);
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      industry: '',
      technology: '',
      challenge: '',
      solution: '',
      result: '',
      displayOrder: 0,
      isActive: true,
      imageUrl: ''
    });
    setImagePreview(null);
    setImageFile(null);
    setEditingStudy(null);
  };

  const toggleStatus = async (study) => {
    try {
      await caseStudiesAPI.update(study.id, { ...study, isActive: !study.isActive });
      toast.success(`Case study ${!study.isActive ? 'activated' : 'deactivated'}`);
      await fetchCaseStudies();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading case studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Case Studies Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your success stories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <FiPlus /> Add Case Study
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-indigo-600">{caseStudies.length}</div>
          <div className="text-sm text-gray-500">Total Case Studies</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600">{caseStudies.filter(s => s.isActive).length}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-600">{caseStudies.filter(s => !s.isActive).length}</div>
          <div className="text-sm text-gray-500">Inactive</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-purple-600">{caseStudies.filter(s => s.imageUrl).length}</div>
          <div className="text-sm text-gray-500">With Images</div>
        </div>
      </div>

      {/* Case Studies Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technology</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {caseStudies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No case studies found. Click "Add Case Study" to create one.
                  </td>
                </tr>
              ) : (
                caseStudies.map((study) => (
                  <tr key={study.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
  {study.imageUrl ? (
    <img 
      src={getImageUrl(study.imageUrl)}
      alt={study.title} 
      className="w-12 h-12 object-cover rounded"
      onError={(e) => {
        console.error('Image failed to load:', getImageUrl(study.imageUrl));
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
      }}
    />
  ) : (
    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
      <FiImage className="text-gray-400" />
    </div>
  )}
</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate">{study.title}</div>
                      {study.subtitle && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{study.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{study.industry}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{study.technology}</td>
                    <td className="px-6 py-4 text-gray-600">{study.displayOrder || 0}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(study)}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          study.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {study.isActive ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                        {study.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(study)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(study.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
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
                {editingStudy ? 'Edit Case Study' : 'Add Case Study'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiImage className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <div className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg inline-flex items-center gap-2">
                        <FiUpload />
                        Upload Image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Recommended size: 800x600px. Max 5MB.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter case study title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Short subtitle (optional)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Oil & Gas, PropTech"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Technology *</label>
                  <input
                    type="text"
                    required
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., AI Agents, LLM"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Challenge *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe the challenge..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Solution *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe the solution..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Result *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe the results/outcome..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controls sort order (lower = higher)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="true">Active (Visible on website)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      {editingStudy ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingStudy ? 'Update' : 'Create'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudiesManager;