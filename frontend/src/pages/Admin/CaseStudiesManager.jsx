// src/pages/Admin/CaseStudiesManager.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { adminAPI, caseStudiesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CaseStudiesManager = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    industry: '',
    technology: '',
    challenge: '',
    solution: '',
    result: '',
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await caseStudiesAPI.getAll();
      setCaseStudies(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch case studies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudy) {
        await adminAPI.updateCaseStudy(editingStudy.id, formData);
        toast.success('Case study updated successfully');
      } else {
        await adminAPI.createCaseStudy(formData);
        toast.success('Case study created successfully');
      }
      setIsModalOpen(false);
      setEditingStudy(null);
      setFormData({
        title: '',
        subtitle: '',
        industry: '',
        technology: '',
        challenge: '',
        solution: '',
        result: '',
      });
      fetchCaseStudies();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      try {
        await adminAPI.deleteCaseStudy(id);
        toast.success('Case study deleted successfully');
        fetchCaseStudies();
      } catch (error) {
        toast.error('Failed to delete case study');
      }
    }
  };

  const handleEdit = (study) => {
    setEditingStudy(study);
    setFormData({
      title: study.title,
      subtitle: study.subtitle || '',
      industry: study.industry,
      technology: study.technology,
      challenge: study.challenge,
      solution: study.solution,
      result: study.result,
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Case Studies Management</h1>
        <button
          onClick={() => {
            setEditingStudy(null);
            setFormData({
              title: '',
              subtitle: '',
              industry: '',
              technology: '',
              challenge: '',
              solution: '',
              result: '',
            });
            setIsModalOpen(true);
          }}
          className="bg-accent text-primary px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add Case Study
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technology</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {caseStudies.map((study) => (
              <tr key={study.id}>
                <td className="px-6 py-4">{study.title}</td>
                <td className="px-6 py-4">{study.industry}</td>
                <td className="px-6 py-4">{study.technology}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(study)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(study.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingStudy ? 'Edit Case Study' : 'Add Case Study'}
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Industry *</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Technology *</label>
                <input
                  type="text"
                  required
                  value={formData.technology}
                  onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Challenge *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Solution *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Result *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold"
                >
                  {editingStudy ? 'Update' : 'Create'}
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