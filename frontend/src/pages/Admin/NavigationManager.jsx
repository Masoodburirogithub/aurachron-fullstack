// src/pages/Admin/NavigationManager.jsx
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye, FiEyeOff, FiMenu } from 'react-icons/fi';
import { navigationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NavigationManager = () => {
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    order: 0,
    isActive: true,
    isDropdown: false,
    dropdownItems: []
  });
  const [dropdownItemInput, setDropdownItemInput] = useState({ name: '', path: '' });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await navigationAPI.getAll();
      console.log('Fetched menus:', response.data);
      
      if (response.data.success) {
        setMenus(response.data.data);
      } else if (Array.isArray(response.data)) {
        setMenus(response.data);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast.error('Failed to fetch navigation menus');
    } finally {
      setLoading(false);
    }
  };

  const addDropdownItem = () => {
    if (dropdownItemInput.name && dropdownItemInput.path) {
      setFormData({
        ...formData,
        dropdownItems: [...formData.dropdownItems, { ...dropdownItemInput, id: Date.now().toString() }]
      });
      setDropdownItemInput({ name: '', path: '' });
    }
  };

  const removeDropdownItem = (index) => {
    setFormData({
      ...formData,
      dropdownItems: formData.dropdownItems.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingMenu) {
        await navigationAPI.update(editingMenu.id, formData);
        toast.success('Menu updated successfully');
      } else {
        await navigationAPI.create(formData);
        toast.success('Menu created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      await fetchMenus();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await navigationAPI.delete(id);
        toast.success('Menu deleted successfully');
        await fetchMenus();
      } catch (error) {
        toast.error('Failed to delete menu');
      }
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      path: menu.path || '',
      order: menu.order || 0,
      isActive: menu.isActive !== undefined ? menu.isActive : true,
      isDropdown: menu.isDropdown || false,
      dropdownItems: menu.dropdownItems || []
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      path: '',
      order: 0,
      isActive: true,
      isDropdown: false,
      dropdownItems: []
    });
    setEditingMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading navigation menus...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Navigation Menu Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your website navigation menu</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <FiPlus /> Add Menu Item
        </button>
      </div>

      {/* Menus Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {menus.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No menu items found. Click "Add Menu Item" to create one.</td></tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{menu.name}</td>
                    <td className="px-6 py-4 text-gray-600">{menu.path || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${menu.isDropdown ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {menu.isDropdown ? 'Dropdown' : 'Link'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{menu.order}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${menu.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {menu.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(menu)} className="text-blue-600 hover:text-blue-800"><FiEdit2 size={18} /></button>
                        <button onClick={() => handleDelete(menu.id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{editingMenu ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setIsModalOpen(false)}><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Menu Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Path / URL</label>
                <input type="text" value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="/services" />
                <p className="text-xs text-gray-500 mt-1">For dropdown menus, this can be left empty</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Menu Type</label>
                  <select value={formData.isDropdown} onChange={(e) => setFormData({ ...formData, isDropdown: e.target.value === 'true' })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="false">Single Link</option>
                    <option value="true">Dropdown Menu</option>
                  </select>
                </div>
              </div>
              
              {formData.isDropdown && (
                <div>
                  <label className="block text-sm font-medium mb-2">Dropdown Items</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Item Name" value={dropdownItemInput.name} onChange={(e) => setDropdownItemInput({ ...dropdownItemInput, name: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Path" value={dropdownItemInput.path} onChange={(e) => setDropdownItemInput({ ...dropdownItemInput, path: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg" />
                    <button type="button" onClick={addDropdownItem} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add</button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {formData.dropdownItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                        <span>{item.name} → {item.path}</span>
                        <button type="button" onClick={() => removeDropdownItem(idx)} className="text-red-600"><FiX /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select value={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50">
                  {submitting ? 'Saving...' : (editingMenu ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationManager;