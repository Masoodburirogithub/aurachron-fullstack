// src/components/admin/AdminNotification.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Phone, Mail, MessageCircle, X, Check } from 'lucide-react';
import { ragAPI } from '../../services/api';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const AdminNotification = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sound] = useState(new Audio('/notification.mp3'));

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    newSocket.on('admin-notification', (data) => {
      sound.play();
      toast.custom((t) => (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl max-w-md">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-semibold">New Chat Request!</p>
              <p className="text-sm opacity-90">{data.user?.name} wants to talk to a human</p>
              <p className="text-xs opacity-75 mt-1">Click to view and respond</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)}>
              <X size={16} />
            </button>
          </div>
        </div>
      ), { duration: 10000 });
      
      fetchPendingRequests();
    });
    
    fetchPendingRequests();
    
    return () => newSocket.disconnect();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await ragAPI.getPendingRequests();
      if (response.data?.success) {
        setPendingRequests(response.data.data);
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
      toast.error('Failed to accept request');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
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
            <p className="text-xs opacity-90">{pendingRequests.length} users waiting for response</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 border-b hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{request.userName || 'Anonymous'}</p>
                    {request.userEmail && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {request.userEmail}
                      </p>
                    )}
                    {request.userPhone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={12} /> {request.userPhone}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Requested: {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => acceptRequest(request.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1"
                  >
                    <Check size={14} /> Accept
                  </button>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">"{request.message}"</p>
                </div>
                <div className="mt-2 flex gap-2">
                  {request.userPhone && (
                    <a href={`tel:${request.userPhone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Phone size={12} /> Call
                    </a>
                  )}
                  {request.userEmail && (
                    <a href={`mailto:${request.userEmail}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      <Mail size={12} /> Email
                    </a>
                  )}
                  {request.userPhone && (
                    <a href={`https://wa.me/${request.userPhone.replace(/\D/g, '')}`} className="text-xs text-green-600 hover:underline flex items-center gap-1">
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