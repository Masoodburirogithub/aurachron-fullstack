// src/services/socket.js
import { io } from 'socket.io-client';

// ✅ Single source of truth for the websocket URL
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(WS_URL, {
      // Allow polling fallback — Render free tier sometimes blocks instant ws upgrade
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connect error:', err.message);
    });

    const token = localStorage.getItem('token');
    if (token) {
      socket.emit('admin-auth', token);
    }
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};