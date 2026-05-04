// backend/src/controllers/chatbotController.js
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const prisma = new PrismaClient();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Get or create conversation
const getOrCreateConversation = async (sessionId, userEmail = null, userName = null) => {
  let conversation = await prisma.conversation.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        sessionId,
        userEmail,
        userName,
        status: 'active'
      }
    });
  }

  return conversation;
};

// Send message and get AI response
const sendMessage = async (req, res) => {
  try {
    const { sessionId, message, userEmail, userName } = req.body;
    const io = req.app.get('io');

    // Get or create conversation
    const conversation = await getOrCreateConversation(sessionId, userEmail, userName);

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        message,
        role: 'user',
        senderName: userName || 'User'
      }
    });

    // Emit to admin if conversation is waiting for admin
    if (conversation.status === 'waiting_for_admin') {
      io.to('admin-room').emit('new-user-message', {
        conversationId: conversation.id,
        message: userMessage,
        sessionId
      });
    }

    // Get AI response from Google Gemini
    const chatHistory = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 10 // Last 10 messages for context
    });

    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.message }]
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();

    // Save AI response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        message: aiResponse,
        role: 'assistant'
      }
    });

    // Check if user wants to talk to admin
    const wantsAdmin = /(talk to admin|human|real person|speak to agent|contact support|call me|representative)/i.test(message);
    
    if (wantsAdmin && conversation.status === 'active') {
      // Create admin request
      const adminRequest = await prisma.adminRequest.create({
        data: {
          conversationId: conversation.id,
          sessionId,
          userEmail: userEmail || null,
          userName: userName || null,
          status: 'pending'
        }
      });

      // Update conversation status
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: 'waiting_for_admin' }
      });

      // Notify admin
      io.to('admin-room').emit('admin-request', {
        requestId: adminRequest.id,
        conversationId: conversation.id,
        sessionId,
        userName: userName || 'Anonymous User',
        userEmail: userEmail || 'Not provided',
        message: `User wants to talk to a real person. Last message: "${message}"`
      });

      // Send acknowledgment to user
      const ackMessage = await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          message: "Thank you for your request. An admin has been notified and will join the conversation shortly. Please wait...",
          role: 'assistant'
        }
      });

      return res.json({
        success: true,
        message: aiResponse,
        adminRequested: true,
        adminMessage: ackMessage.message
      });
    }

    res.json({ 
      success: true, 
      message: aiResponse,
      conversationId: conversation.id
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get chat history
const getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    res.json({ 
      success: true, 
      data: conversation?.messages || [],
      conversationId: conversation?.id,
      status: conversation?.status || 'active'
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Clear history
const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await prisma.chatMessage.deleteMany({
      where: { conversation: { sessionId } }
    });
    await prisma.conversation.deleteMany({ where: { sessionId } });
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all pending admin requests
const getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.adminRequest.findMany({
      where: { status: 'pending' },
      include: { conversation: { include: { messages: { orderBy: { createdAt: 'asc' }, take: 5 } } } },
      orderBy: { requestedAt: 'desc' }
    });
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Accept admin request and start chat
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.user.id;
    const adminName = req.user.email;

    const adminRequest = await prisma.adminRequest.update({
      where: { id: requestId },
      data: { status: 'accepted', respondedAt: new Date(), adminId }
    });

    await prisma.conversation.update({
      where: { id: adminRequest.conversationId },
      data: { status: 'active' }
    });

    const io = req.app.get('io');
    io.to(adminRequest.sessionId).emit('admin-joined', {
      message: "An admin has joined the conversation. You can now chat directly.",
      adminName
    });

    res.json({ success: true, message: 'Request accepted', conversationId: adminRequest.conversationId });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Send message to user
const adminSendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const adminName = req.user.email;

    const adminMessage = await prisma.chatMessage.create({
      data: {
        conversationId,
        message,
        role: 'admin',
        senderName: adminName,
        isRead: false
      }
    });

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    const io = req.app.get('io');
    io.to(conversation.sessionId).emit('admin-message', {
      message: adminMessage,
      adminName
    });

    res.json({ success: true, data: adminMessage });
  } catch (error) {
    console.error('Admin send message error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all conversations for admin
const getAllConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        adminRequests: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getHistory,
  clearHistory,
  getPendingRequests,
  acceptRequest,
  adminSendMessage,
  getAllConversations
};