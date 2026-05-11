// src/pages/Admin/RagUsersManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiMessageSquare, FiEye, FiSearch, FiLoader, 
  FiMail, FiPhone, FiClock, FiUser, FiCalendar, FiDatabase,
  FiChevronLeft, FiChevronRight, FiDownload, FiRefreshCw,   FiCheckCircle  
} from 'react-icons/fi';
import { ragAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const RagUsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [showConversation, setShowConversation] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await ragAPI.getAllUsers();
      console.log('Fetched users:', response.data);
      
      if (response.data?.success) {
        setUsers(response.data.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserConversation = async (userId) => {
    try {
      setLoadingConversation(true);
      // console.log('Fetching conversation for user ID:', userId);
      
      const response = await ragAPI.getUserConversation(userId);
      // console.log('Conversation API response:', response.data);
      
      if (response.data?.success) {
        const conversations = response.data.data || [];
        // console.log('Conversations found:', conversations.length);
        setConversation(conversations);
      } else if (response.data?.data?.conversations) {
        setConversation(response.data.data.conversations);
      } else if (Array.isArray(response.data?.data)) {
        setConversation(response.data.data);
      } else {
        setConversation([]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast.error('Failed to load conversation');
      setConversation([]);
    } finally {
      setLoadingConversation(false);
    }
  };

  const viewConversation = async (user) => {
    console.log('Viewing conversation for user:', user);
    setSelectedUser(user);
    await fetchUserConversation(user.id);
    setShowConversation(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    } catch {
      return 'Unknown';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case 'waiting_for_admin':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs animate-pulse">Waiting</span>;
      case 'chatting':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Chatting</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Resolved</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status || 'Unknown'}</span>;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.sessionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const stats = {
    total: users.length,
    waiting: users.filter(u => u.status === 'waiting_for_admin').length,
    chatting: users.filter(u => u.status === 'chatting').length,
    resolved: users.filter(u => u.status === 'resolved').length,
    active: users.filter(u => u.status === 'active').length,
  };

  const exportConversation = () => {
    if (!selectedUser || conversation.length === 0) return;
    
    const exportData = {
      user: {
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        sessionId: selectedUser.sessionId,
        startedAt: selectedUser.createdAt,
        lastActive: selectedUser.lastActive
      },
      conversation: conversation.map(msg => ({
        role: msg.question ? 'User' : 'AI',
        message: msg.question || msg.answer,
        timestamp: msg.createdAt
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation_${selectedUser.name}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Conversation exported successfully');
  };

  if (loading) {
    return (
      null
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RAG Chat Users</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all users who interacted with the AI assistant</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] w-64 md:w-80"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-[#1E3A8A]">{stats.total}</p>
            </div>
            <FiUsers className="w-8 h-8 text-[#1E3A8A] opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 shadow-sm border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Waiting</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Chatting</p>
              <p className="text-2xl font-bold text-blue-600">{stats.chatting}</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-gray-600">{stats.resolved}</p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-gray-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FiUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No users found</p>
                    <p className="text-sm mt-1">Users will appear here when they start chatting</p>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-[#F59E0B]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name || 'Anonymous'}</div>
                          <div className="text-xs text-gray-400 font-mono">ID: {user.sessionId?.slice(0, 12)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <FiMail size={12} className="text-gray-400" /> {user.email}
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FiPhone size={12} className="text-gray-400" /> {user.phone}
                        </div>
                      )}
                      {!user.email && !user.phone && (
                        <span className="text-sm text-gray-400">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <FiMessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{user.conversations?.length || 0} messages</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{formatDate(user.lastActive)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(user.lastActive)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewConversation(user)}
                        className="flex items-center gap-1 text-[#F59E0B] hover:text-[#B45309] transition-colors font-medium"
                      >
                        <FiEye size={16} /> View Chat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-white transition"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg">{currentPage}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-white transition"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Modal */}
      
      {/* Conversation Modal */}
      {showConversation && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate">{selectedUser.name || 'Anonymous'}</h3>
                <p className="text-xs text-blue-200 truncate">
                  {selectedUser.email && `${selectedUser.email}`}
                  {selectedUser.phone && ` • ${selectedUser.phone}`}
                  {selectedUser.createdAt && ` • Started: ${formatDate(selectedUser.createdAt).split(',')[0]}`}
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={exportConversation} className="p-1.5 hover:bg-white/20 rounded transition" title="Export">
                  <FiDownload size={14} />
                </button>
                <button onClick={() => setShowConversation(false)} className="p-1.5 hover:bg-white/20 rounded transition text-xl leading-none">
                  &times;
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="p-3 overflow-y-auto max-h-[60vh] space-y-2 bg-gray-50">
              {loadingConversation ? (
                <div className="text-center py-6">
                  <FiLoader className="w-6 h-6 animate-spin text-[#F59E0B] mx-auto" />
                  <p className="text-gray-500 text-xs mt-2">Loading...</p>
                </div>
              ) : conversation.length === 0 ? (
                <div className="text-center py-6">
                  <FiMessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500 text-sm">No messages yet</p>
                </div>
              ) : (
                conversation.map((msg, idx) => (
                  <div key={idx} className={`flex ${idx % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      idx % 2 === 0
                        ? 'bg-[#F59E0B] text-[#1E3A8A] rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">
                          {idx % 2 === 0 ? 'You' : 'AI'}
                        </span>
                        <span className="text-xs opacity-60">
                          {formatDate(msg.createdAt).split(',')[1]?.trim() || formatDate(msg.createdAt).split(' ')[4] || ''}
                        </span>
                      </div>
                      <p className="text-xs whitespace-pre-wrap leading-relaxed break-words">
                        {idx % 2 === 0 ? msg.question : msg.answer}
                      </p>
                      {msg.sources && msg.sources.length > 0 && idx % 2 !== 0 && (
                        <div className="mt-1 pt-1 border-t border-gray-200">
                          <div className="flex items-center gap-1 text-xs text-[#F59E0B]">
                            <FiDatabase size={9} />
                            <span className="text-xs">Sources: {msg.sources.map(s => s.title).join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t px-4 py-3 bg-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiCalendar size={12} />
                  <span>{conversation.length} messages</span>
                  <span className="text-gray-300">•</span>
                  <span>Status: {getStatusBadge(selectedUser.status)}</span>
                </div>
                <div className="flex gap-2">
                  {selectedUser.email && (
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="bg-[#F59E0B] text-[#1E3A8A] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#FBBF24] transition flex items-center gap-1.5"
                    >
                      <FiMail size={12} /> Email
                    </a>
                  )}
                  {selectedUser.phone && (
                    <a
                      href={`tel:${selectedUser.phone}`}
                      className="border border-[#F59E0B] text-[#F59E0B] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F59E0B] hover:text-[#1E3A8A] transition flex items-center gap-1.5"
                    >
                      <FiPhone size={12} /> Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RagUsersManager;