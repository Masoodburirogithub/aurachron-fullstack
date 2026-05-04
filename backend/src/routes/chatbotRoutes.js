// backend/src/routes/chatbotRoutes.js
const express = require('express');
const { 
  sendMessage, 
  getHistory, 
  clearHistory,
  getPendingRequests,
  acceptRequest,
  adminSendMessage,
  getAllConversations
} = require('../controllers/chatbotController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);
router.delete('/history/:sessionId', clearHistory);

// Admin routes
router.get('/admin/requests', authenticate, authorizeAdmin, getPendingRequests);
router.get('/admin/conversations', authenticate, authorizeAdmin, getAllConversations);
router.post('/admin/accept/:requestId', authenticate, authorizeAdmin, acceptRequest);
router.post('/admin/send-message', authenticate, authorizeAdmin, adminSendMessage);

module.exports = router;