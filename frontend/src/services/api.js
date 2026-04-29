// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact/submit', data),
  getAll: () => api.get('/contact/submissions'),
};

// Careers API
export const careersAPI = {
  getPositions: () => api.get('/careers/positions'),
  apply: (data) => api.post('/careers/apply', data),
  createPosition: (data) => api.post('/careers/positions', data),
};

// Case Studies API
export const caseStudiesAPI = {
  getAll: () => api.get('/case-studies'),
  getById: (id) => api.get(`/case-studies/${id}`),
  create: (data) => api.post('/case-studies', data),
  update: (id, data) => api.put(`/admin/case-studies/${id}`, data),
  delete: (id) => api.delete(`/admin/case-studies/${id}`),
};

// Admin API
export const adminAPI = {
  // Case Studies
  createCaseStudy: (data) => api.post('/admin/case-studies', data),
  updateCaseStudy: (id, data) => api.put(`/admin/case-studies/${id}`, data),
  deleteCaseStudy: (id) => api.delete(`/admin/case-studies/${id}`),
  
  // Positions
  createPosition: (data) => api.post('/admin/positions', data),
  updatePosition: (id, data) => api.put(`/admin/positions/${id}`, data),
  deletePosition: (id) => api.delete(`/admin/positions/${id}`),
  
  // Contacts
  getContacts: () => api.get('/admin/contacts'),
  updateContactStatus: (id, status) => api.put(`/admin/contacts/${id}/status`, { status }),
  
  // Applications
  getApplications: () => api.get('/admin/applications'),
  updateApplicationStatus: (id, status) => api.put(`/admin/applications/${id}/status`, { status }),
  
  // Dashboard Stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (sessionId, message) => api.post('/chatbot/message', { sessionId, message }),
  getHistory: (sessionId) => api.get(`/chatbot/history/${sessionId}`),
  clearHistory: (sessionId) => api.delete(`/chatbot/history/${sessionId}`),
};

export default api;