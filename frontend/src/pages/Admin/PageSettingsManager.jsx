// src/pages/Admin/PageSettingsManager.jsx
import React, { useState, useEffect } from 'react';
import { pageSettingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiLoader } from 'react-icons/fi';

const PageSettingsManager = () => {
  const [settings, setSettings] = useState({
    title: 'Services We Offer',
    subtitle: 'Explore our full range of AI-augmented services designed to accelerate your digital transformation',
    badgeText: 'What We Do'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await pageSettingsAPI.getSettings('home', 'services');
      if (response.data?.success && response.data.data) {
        setSettings({
          title: response.data.data.title || 'Services We Offer',
          subtitle: response.data.data.subtitle || 'Explore our full range of AI-augmented services...',
          badgeText: response.data.data.metadata?.badgeText || 'What We Do'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await pageSettingsAPI.updateSettings('home', 'services', {
        title: settings.title,
        subtitle: settings.subtitle,
        metadata: { badgeText: settings.badgeText }
      });
      toast.success('Page settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Services Page Settings</h1>
        <p className="text-gray-500 text-sm">Customize the services section heading and text</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Badge Text</label>
          <input
            type="text"
            value={settings.badgeText}
            onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., What We Do"
          />
          <p className="text-xs text-gray-500 mt-1">The small badge above the main title</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Main Title</label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Services We Offer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtitle / Description</label>
          <textarea
            rows="3"
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe your services..."
          />
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Preview:</h3>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-3 py-1 text-sm text-indigo-600">
              {settings.badgeText}
            </span>
            <h2 className="text-2xl font-bold mt-2">{settings.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{settings.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSettingsManager;