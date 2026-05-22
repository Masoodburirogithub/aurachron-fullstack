// src/components/admin/AdminNotification.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Phone, Mail, MessageCircle, X, Check } from 'lucide-react';
import { ragAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { initSocket, disconnectSocket } from '../../services/socket';

const AdminNotification = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const soundRef = useRef(null);

  // Initialize audio once (lazy — avoids SSR / autoplay-block issues)
  useEffect(() => {
    soundRef.current = new Audio('/notification.mp3');
    soundRef.current.preload = 'auto';
  }, []);

  useEffect(() => {
    // ✅ Use the centralized socket helper (reads VITE_WS_URL from env)
    const socket = initSocket();

    // Re-auth as admin in case socket was opened before login
    const token = localStorage.getItem('token');
    if (token) {
      socket.emit('admin-auth', token);
    }

    const handleAdminNotification = (data) => {
      // Play sound safely — modern browsers reject .play() if no user interaction yet
      if (soundRef.current) {
        soundRef.current.play().catch((err) => {
          console.warn('Notification sound blocked by browser:', err.message);
        });
      }

      toast.custom(
        (t) => (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl max-w-md">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">New Chat Request!</p>
                <p className="text-sm opacity-90">
                  {data?.user?.name || 'A visitor'} wants to talk to a human
                </p>
                <p className="text-xs opacity-75 mt-1">Click the bell to view and respond</p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="hover:bg-white/10 rounded p-1 transition"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ),
        { duration: 10000 }
      );

      fetchPendingRequests();
    };

    socket.on('admin-notification', handleAdminNotification);

    fetchPendingRequests();

    return () => {
      socket.off('admin-notification', handleAdminNotification);
      // Note: we don't disconnect here because other components may share this socket.
      // If AdminNotification is the only consumer, uncomment the next line:
      // disconnectSocket();
    };
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await ragAPI.getPendingRequests();
      if (response.data?.success) {
        setPendingRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await ragAPI.acceptRequest(requestId);
      toast.success('Request accepted! The user has been notified.');
      fetchPendingRequests();
    } catch (error) {
      console.error('Accept request failed:', error);
      toast.error('Failed to accept request');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {pendingRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {pendingRequests.length}
          </span>
        )}
      </button>

      {showDropdown && pendingRequests.length > 0 && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h3 className="font-semibold">New Chat Requests</h3>
            <p className="text-xs opacity-90">
              {pendingRequests.length} user{pendingRequests.length !== 1 ? 's' : ''} waiting for response
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 border-b hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{request.userName || 'Anonymous'}</p>
                    {request.userEmail && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                        <Mail size={12} className="shrink-0" /> {request.userEmail}
                      </p>
                    )}
                    {request.userPhone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={12} className="shrink-0" /> {request.userPhone}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Requested:{' '}
                      {request.requestedAt
                        ? new Date(request.requestedAt).toLocaleString()
                        : 'Just now'}
                    </p>
                  </div>
                  <button
                    onClick={() => acceptRequest(request.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Check size={14} /> Accept
                  </button>
                </div>

                {request.message && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 italic">"{request.message}"</p>
                  </div>
                )}

                <div className="mt-2 flex gap-3 flex-wrap">
                  {request.userPhone && (
                    <a
                      href={`tel:${request.userPhone}`}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone size={12} /> Call
                    </a>
                  )}
                  {request.userEmail && (
                    <a
                      href={`mailto:${request.userEmail}`}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail size={12} /> Email
                    </a>
                  )}
                  {request.userPhone && (
                    <a
                      href={`https://wa.me/${request.userPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;