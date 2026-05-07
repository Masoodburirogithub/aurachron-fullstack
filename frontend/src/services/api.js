// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000';

// console.log('API Base URL:', API_BASE_URL);
// console.log('Image Base URL:', IMAGE_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${IMAGE_BASE_URL}${imagePath}`;
  return `${IMAGE_BASE_URL}/uploads/${imagePath}`;
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);


// src/services/api.js - Add this to your existing file

// ==================== DYNAMIC SERVICES API (for Header dropdown) ====================
export const dynamicServiceAPI = {
  getAll: () => api.get('/dynamic-services'),
  getById: (id) => api.get(`/dynamic-services/${id}`),
  create: (data) => api.post('/dynamic-services', data),
  update: (id, data) => api.put(`/dynamic-services/${id}`, data),
  delete: (id) => api.delete(`/dynamic-services/${id}`),
};

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, role) => api.post('/auth/register', { email, password, role }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === 'admin';
  },
};

// ==================== CONTACT API ====================
export const contactAPI = {
  submit: (data) => api.post('/contact/submit', data),
  getAll: () => api.get('/contact/submissions'),
  updateStatus: (id, status) => api.put(`/contact/submissions/${id}/status`, { status }),
};

// ==================== CAREERS API ====================
export const careersAPI = {
  getPositions: () => api.get('/careers/positions'),
  getPositionById: (id) => api.get(`/careers/positions/${id}`),
  apply: (data) => api.post('/careers/apply', data),
  createPosition: (data) => api.post('/careers/positions', data),
  updatePosition: (id, data) => api.put(`/careers/positions/${id}`, data),
  deletePosition: (id) => api.delete(`/careers/positions/${id}`),
};

// ==================== CASE STUDIES API ====================
export const caseStudiesAPI = {
  getAll: () => api.get('/case-studies'),
  getById: (id) => api.get(`/case-studies/${id}`),
  create: (data) => api.post('/case-studies', data),
  update: (id, data) => api.put(`/case-studies/${id}`, data),
  delete: (id) => api.delete(`/case-studies/${id}`),
};

// ==================== SERVICES API ====================
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// ==================== PAGE SETTINGS API ====================
export const pageSettingsAPI = {
  getSettings: (page, section) => api.get(`/page-settings/${page}/${section}`),
  updateSettings: (page, section, data) => api.put(`/page-settings/${page}/${section}`, data),
};

// ==================== NAVIGATION API ====================
export const navigationAPI = {
  getAll: () => api.get('/navigation'),
  getById: (id) => api.get(`/navigation/${id}`),
  create: (data) => api.post('/navigation', data),
  update: (id, data) => api.put(`/navigation/${id}`, data),
  delete: (id) => api.delete(`/navigation/${id}`),
};

// src/services/api.js - Add this heroAPI export

// ==================== HERO API (for hero section) ====================
export const heroAPI = {
  getSettings: () => api.get('/hero'),
  updateSettings: (data) => api.put('/hero', data),
  uploadVideo: (formData) => api.post('/hero/upload-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Contacts
  getContacts: () => api.get('/admin/contacts'),
  updateContactStatus: (id, status) => api.put(`/admin/contacts/${id}/status`, { status }),
  
  // Applications
  getApplications: () => api.get('/admin/applications'),
  updateApplicationStatus: (id, status) => api.put(`/admin/applications/${id}/status`, { status }),
  
  // Case Studies (Admin)
  createCaseStudy: (data) => api.post('/admin/case-studies', data),
  updateCaseStudy: (id, data) => api.put(`/admin/case-studies/${id}`, data),
  deleteCaseStudy: (id) => api.delete(`/admin/case-studies/${id}`),
  
  // Positions (Admin)
  createPosition: (data) => api.post('/admin/positions', data),
  updatePosition: (id, data) => api.put(`/admin/positions/${id}`, data),
  deletePosition: (id) => api.delete(`/admin/positions/${id}`),
  
  // Services (Admin)
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
};

// ==================== CHATBOT API ====================
export const chatbotAPI = {
  sendMessage: (sessionId, message, userEmail, userName, userPhone) => 
    api.post('/chatbot/message', { sessionId, message, userEmail, userName, userPhone }),
  getHistory: (sessionId) => api.get(`/chatbot/history/${sessionId}`),
  clearHistory: (sessionId) => api.delete(`/chatbot/history/${sessionId}`),
  // Admin endpoints
  getAllChatUsers: () => api.get('/chatbot/admin/users'),
  getUserConversation: (userId) => api.get(`/chatbot/admin/users/${userId}/conversation`),
  updateUserStatus: (userId, status) => api.put(`/chatbot/admin/users/${userId}/status`, { status }),
};

export default api;