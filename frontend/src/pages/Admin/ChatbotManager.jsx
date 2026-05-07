// src/pages/Admin/ChatbotManager.jsx
import React, { useState, useEffect } from 'react';
import { FiUsers, FiMessageSquare, FiClock, FiCheckCircle, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import { chatbotAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ChatbotManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await chatbotAPI.getAllChatUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load chat users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserConversation = async (userId) => {
    try {
      const response = await chatbotAPI.getUserConversation(userId);
      setConversation(response.data.data || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    await fetchUserConversation(user.id);
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await chatbotAPI.updateUserStatus(userId, status);
      toast.success(`User status updated to ${status}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.sessionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case 'waiting_for_admin': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Waiting</span>;
      case 'resolved': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Resolved</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Chatbot Users</h1>
          <p className="text-gray-500 text-sm mt-1">View all users who interacted with the chatbot</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
            <FiUsers className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Active</p><p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p></div>
            <FiMessageSquare className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Waiting for Admin</p><p className="text-2xl font-bold">{users.filter(u => u.status === 'waiting_for_admin').length}</p></div>
            <FiClock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between">
            <div><p className="text-gray-500 text-sm">Resolved</p><p className="text-2xl font-bold">{users.filter(u => u.status === 'resolved').length}</p></div>
            <FiCheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium text-gray-900">{user.name}</div></td>
                    <td className="px-6 py-4"><div>{user.email && <div className="text-sm">{user.email}</div>}{user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}</div></td>
                    <td className="px-6 py-4"><div className="text-xs font-mono text-gray-500">{user.sessionId?.slice(0, 20)}...</div></td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4"><div className="text-sm text-gray-500">{formatDate(user.lastActive)}</div></td>
                    <td className="px-6 py-4"><button onClick={() => handleSelectUser(user)} className="text-indigo-600 hover:text-indigo-800 transition-colors"><FiEye size={18} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <div><h2 className="text-2xl font-bold">Conversation with {selectedUser.name}</h2><p className="text-sm text-gray-500">{selectedUser.email || 'No email'} • {selectedUser.phone || 'No phone'}</p></div>
              <div className="flex gap-2"><select value={selectedUser.status} onChange={(e) => updateUserStatus(selectedUser.id, e.target.value)} className="px-3 py-1 border rounded-lg text-sm"><option value="active">Active</option><option value="waiting_for_admin">Waiting for Admin</option><option value="resolved">Resolved</option></select><button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700">✕</button></div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
              {conversation.length === 0 ? <div className="text-center text-gray-500 py-8">No messages yet</div> : conversation.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}><p className="text-sm">{msg.message}</p><p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleString()}</p></div></div>))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotManager;