// src/pages/Admin/HeroSettingsManager.jsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiLoader, FiUpload, FiTrash2, FiPlus } from 'react-icons/fi';
import { heroAPI } from '../../services/api';
import toast from 'react-hot-toast';

const HeroSettingsManager = () => {
  const [settings, setSettings] = useState({
    title: "Ship Production-Ready Systems at AI Speed",
    subtitle: "We combine deep systems engineering with AI-native delivery to build scalable, secure applications in half the time. Zero technical debt. Full IP ownership.",
    badgeText: "Aurachron Systems Leading AI-Augmented Engineering Firm • 2026",
    buttonText: "Launch Your Project",
    buttonLink: "/contact",
    demoButtonText: "Watch Demo",
    stats: [
      { value: "50+", label: "Projects Delivered", icon: "TrendingUp" },
      { value: "<2 weeks", label: "Avg. MVP to Live", icon: "Clock" },
      { value: "100%", label: "Client Satisfaction", icon: "Award" }
    ],
    videoUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await heroAPI.getSettings();
      console.log('Hero settings:', response.data);
      
      if (response.data?.success && response.data.data) {
        setSettings(response.data.data);
        if (response.data.data.videoUrl) {
          setPreviewUrl(response.data.data.videoUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast.error('Failed to load hero settings');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video size must be less than 50MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }
    
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const uploadVideo = async () => {
    if (!videoFile) return;
    
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('video', videoFile);
      const response = await heroAPI.uploadVideo(formData);
      
      if (response.data.success) {
        setSettings({ ...settings, videoUrl: response.data.data.videoUrl });
        toast.success('Video uploaded successfully');
        setVideoFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setSettings({
      ...settings,
      stats: [...(settings.stats || []), { value: "", label: "", icon: "TrendingUp" }]
    });
  };

  const removeStat = (index) => {
    const newStats = [...(settings.stats || [])];
    newStats.splice(index, 1);
    setSettings({ ...settings, stats: newStats });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...(settings.stats || [])];
    newStats[index][field] = value;
    setSettings({ ...settings, stats: newStats });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If there's a pending video upload, upload it first
      if (videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);
        const videoResponse = await heroAPI.uploadVideo(formData);
        if (videoResponse.data.success) {
          settings.videoUrl = videoResponse.data.data.videoUrl;
          setVideoFile(null);
        }
      }
      
      await heroAPI.updateSettings(settings);
      toast.success('Hero settings updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading hero settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hero Section Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize the main hero banner on your homepage</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Badge Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Badge Text</label>
          <input
            type="text"
            value={settings.badgeText || ''}
            onChange={(e) => setSettings({ ...settings, badgeText: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Pakistan's Leading AI Firm"
          />
          <p className="text-xs text-gray-500 mt-1">The small badge above the main title</p>
        </div>

        {/* Main Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Main Title</label>
          <textarea
            rows="2"
            value={settings.title || ''}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter main title"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle / Description</label>
          <textarea
            rows="3"
            value={settings.subtitle || ''}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter description"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Button Text</label>
            <input
              type="text"
              value={settings.buttonText || ''}
              onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Primary Button Link</label>
            <input
              type="text"
              value={settings.buttonLink || ''}
              onChange={(e) => setSettings({ ...settings, buttonLink: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="/contact"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Secondary Button Text</label>
          <input
            type="text"
            value={settings.demoButtonText || ''}
            onChange={(e) => setSettings({ ...settings, demoButtonText: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Background Video</label>
          {previewUrl && (
            <div className="mb-3">
              <video src={previewUrl} className="w-full h-48 object-cover rounded-lg" controls />
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            {videoFile && (
              <button
                type="button"
                onClick={uploadVideo}
                disabled={saving}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <FiUpload /> Upload
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload MP4, WebM, or OGG (Max 50MB)</p>
          {settings.videoUrl && !videoFile && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-green-600">✓ Video uploaded</span>
              <button
                type="button"
                onClick={() => {
                  setSettings({ ...settings, videoUrl: "" });
                  setPreviewUrl("");
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">Statistics Cards</label>
            <button
              type="button"
              onClick={addStat}
              className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center gap-1"
            >
              <FiPlus size={14} /> Add Stat
            </button>
          </div>
          
          <div className="space-y-3">
            {(settings.stats || []).map((stat, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Value (e.g., 50+)"
                  value={stat.value || ''}
                  onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Label (e.g., Projects)"
                  value={stat.label || ''}
                  onChange={(e) => updateStat(idx, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <select
                  value={stat.icon || 'TrendingUp'}
                  onChange={(e) => updateStat(idx, 'icon', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="TrendingUp">📈 Trending Up</option>
                  <option value="Clock">⏰ Clock</option>
                  <option value="Award">🏆 Award</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeStat(idx)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
            
            {(!settings.stats || settings.stats.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No statistics added. Click "Add Stat" to create one.</p>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Live Preview</h3>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs mb-3">
              <span>{settings.badgeText || "Badge Text"}</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{settings.title || "Your Title Here"}</h2>
            <p className="text-sm text-white/80 mb-3">{settings.subtitle || "Your description here"}</p>
            <div className="flex gap-3">
              <span className="bg-white text-indigo-600 px-4 py-1 rounded-lg text-xs font-semibold">
                {settings.buttonText || "Button"}
              </span>
              <span className="border border-white/30 px-4 py-1 rounded-lg text-xs">
                {settings.demoButtonText || "Demo"}
              </span>
            </div>
            <div className="flex gap-3 mt-3">
              {(settings.stats || []).slice(0, 3).map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-sm font-bold">{stat.value || "Value"}</div>
                  <div className="text-[10px] text-white/70">{stat.label || "Label"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSettingsManager;