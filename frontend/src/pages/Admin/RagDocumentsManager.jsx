// src/pages/Admin/RagDocumentsManager.jsx
import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2, FiRefreshCw, FiFile, FiCheckCircle, FiClock, FiAlertCircle, FiDatabase, FiSearch } from 'react-icons/fi';
import { ragAPI } from '../../services/api';
import toast from 'react-hot-toast';

const RagDocumentsManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await ragAPI.getDocuments();
      console.log('Documents:', response.data);
      
      if (response.data?.success) {
        setDocuments(response.data.data);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOCX, or TXT files');
      return;
    }
    
    setSelectedFile(file);
  };

  const uploadDocument = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', documentTitle || selectedFile.name);
      
      const response = await ragAPI.uploadDocument(formData);
      
      if (response.data?.success) {
        toast.success('Document uploaded successfully! Indexing in progress...');
        setSelectedFile(null);
        setDocumentTitle('');
        fetchDocuments();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await ragAPI.deleteDocument(id);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const reindexDocument = async (id) => {
    try {
      await ragAPI.reindexDocument(id);
      toast.success('Reindexing started');
      fetchDocuments();
    } catch (error) {
      console.error('Reindex error:', error);
      toast.error('Failed to reindex document');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'indexed':
        return <span className="flex items-center gap-1 text-green-600"><FiCheckCircle size={14} /> Indexed</span>;
      case 'processing':
        return <span className="flex items-center gap-1 text-yellow-600"><FiClock size={14} /> Processing</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-red-600"><FiAlertCircle size={14} /> Failed</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiDatabase className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">RAG Knowledge Base</h1>
          <p className="text-gray-500 text-sm mt-1">Upload documents to train the AI assistant</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiUpload /> Upload Document
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Title (Optional)</label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter document title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Select File (PDF, DOCX, TXT)</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
          </div>
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FiFile className="text-indigo-600" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(selectedFile.size)})</span>
              </div>
              <button
                onClick={uploadDocument}
                disabled={uploading}
                className="bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No documents uploaded. Upload a document to train the AI.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{doc.title}</td>
                    <td className="px-6 py-4 text-gray-600">{doc.filename}</td>
                    <td className="px-6 py-4 text-gray-600">{formatFileSize(doc.fileSize)}</td>
                    <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => reindexDocument(doc.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Reindex"
                        >
                          <FiRefreshCw size={18} />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                   </tr>
                ))
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiSearch className="text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">How RAG Works</h3>
            <p className="text-sm text-blue-800 mt-1">
              Documents are processed using semantic search. When users ask questions, the system finds relevant document chunks 
              and uses Google Gemini AI to generate accurate answers based on your knowledge base.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RagDocumentsManager;