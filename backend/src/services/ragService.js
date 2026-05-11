// backend/src/services/ragService.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const prisma = new PrismaClient();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log('✅ Google Gemini AI initialized');

// Extract text from files
function extractTxtText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('TXT extraction error:', error);
    return null;
  }
}

// Index document
async function indexDocument(documentId) {
  try {
    console.log(`📄 Indexing document: ${documentId}`);
    
    const document = await prisma.ragDocument.findUnique({
      where: { id: documentId }
    });
    
    if (!document) throw new Error('Document not found');
    
    const filePath = path.join(__dirname, '../../uploads/rag', document.filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const content = extractTxtText(filePath);
    
    if (!content) {
      throw new Error('Could not extract text from file');
    }
    
    const chunks = [];
    const chunkSize = 1000;
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push({
        index: chunks.length,
        text: content.substring(i, i + chunkSize)
      });
    }
    
    await prisma.ragDocument.update({
      where: { id: documentId },
      data: {
        content: content,
        chunks: chunks,
        status: 'indexed'
      }
    });
    
    console.log(`✅ Indexed: ${document.title} (${chunks.length} chunks)`);
    return { success: true };
    
  } catch (error) {
    console.error('Indexing error:', error);
    await prisma.ragDocument.update({
      where: { id: documentId },
      data: { status: 'failed' }
    });
    throw error;
  }
}

// Search relevant chunks
async function searchRelevantChunks(query, topK = 3) {
  const documents = await prisma.ragDocument.findMany({
    where: { status: 'indexed', isActive: true }
  });
  
  const allChunks = [];
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  for (const doc of documents) {
    if (doc.chunks && Array.isArray(doc.chunks)) {
      for (const chunk of doc.chunks) {
        const chunkLower = chunk.text.toLowerCase();
        let score = 0;
        
        for (const word of queryWords) {
          if (word.length > 2 && chunkLower.includes(word)) {
            score++;
          }
        }
        
        if (score > 0) {
          allChunks.push({
            text: chunk.text,
            score: score,
            documentTitle: doc.title
          });
        }
      }
    }
  }
  
  allChunks.sort((a, b) => b.score - a.score);
  return allChunks.slice(0, topK);
}

// Get or create user
async function getOrCreateUser(sessionId, name, email, phone) {
  let user = await prisma.ragUser.findUnique({
    where: { sessionId }
  });
  
  if (!user && name) {
    user = await prisma.ragUser.create({
      data: {
        sessionId,
        name: name,
        email: email || null,
        phone: phone || null,
        lastActive: new Date()
      }
    });
    console.log('✅ New user created:', user.name);
  } else if (user && (name || email || phone)) {
    user = await prisma.ragUser.update({
      where: { sessionId },
      data: {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        lastActive: new Date()
      }
    });
    console.log('✅ User updated:', user.name);
  }
  
  return user;
}

// Generate friendly response for greetings
function getGreetingResponse(message, userName) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
    return `Hello ${userName || 'there'}! 👋\n\nI'm your AI assistant. How can I help you today?\n\nYou can ask me about:\n• Our services and solutions\n• Pricing and packages\n• Technology stack\n• Case studies\n• Or type "Talk to human" to speak with a real person!`;
  }
  
  if (lowerMsg.includes('how are you')) {
    return `I'm doing great, thanks for asking ${userName || 'friend'}! 🤖\n\nI'm ready to help you with any questions about Aurachron Systems. What would you like to know?`;
  }
  
  if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) {
    return `You're welcome ${userName || 'friend'}! 😊\n\nIs there anything else I can help you with today?`;
  }
  
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
    return `Goodbye ${userName || 'friend'}! 👋\n\nFeel free to come back if you have more questions. Have a great day!`;
  }
  
  return null;
}

// Generate RAG response
async function generateRagResponse(question, sessionId, userName, userEmail, userPhone) {
  try {
    console.log(`🤖 Processing: "${question}" from ${userName || 'Anonymous'}`);
    
    // Get or create user
    const user = await getOrCreateUser(sessionId, userName, userEmail, userPhone);
    
    // Check for greetings first
    const greetingResponse = getGreetingResponse(question, userName);
    if (greetingResponse) {
      // Save the conversation
      await prisma.ragConversation.create({
        data: {
          sessionId,
          userId: user?.id,
          question,
          answer: greetingResponse,
          sources: []
        }
      });
      
      return { answer: greetingResponse, sources: [], hasContext: false, user };
    }
    
    // Check if user wants to talk to a human
    if (question.toLowerCase().includes('talk to human') || 
        question.toLowerCase().includes('talk to admin') ||
        question.toLowerCase().includes('speak to person') ||
        question.toLowerCase().includes('real person')) {
      
      // Create chat request
      const chatRequest = await prisma.chatRequest.create({
        data: {
          sessionId,
          userId: user?.id,
          userName: userName || user?.name,
          userEmail: userEmail || user?.email,
          userPhone: userPhone || user?.phone,
          message: question,
          status: 'pending'
        }
      });
      
      // Update user wantsHuman flag
      if (user) {
        await prisma.ragUser.update({
          where: { id: user.id },
          data: { wantsHuman: true, status: 'waiting_for_admin' }
        });
      }
      
      const contactResponse = `I understand you'd like to speak with a real person. 👤\n\nOur team has been notified and will reach out to you shortly.\n\n📞 **You can also contact us directly:**\n• **Phone/WhatsApp:** +92 311 2616192\n• **Email:** admin@aurachronsys.com\n• **Office Hours:** Mon-Fri, 9am-6pm\n\nThank you for your patience! 🙏`;
      
      // Save the conversation
      await prisma.ragConversation.create({
        data: {
          sessionId,
          userId: user?.id,
          question,
          answer: contactResponse,
          sources: []
        }
      });
      
      return { 
        answer: contactResponse, 
        sources: [], 
        hasContext: false, 
        user,
        adminRequested: true,
        contactInfo: {
          phone: '(021) 37123252',
          email: 'admin@aurachronsys.com',
          whatsapp: 'https://wa.me/923112616192'
        }
      };
    }
    
    // Search for relevant content
    const relevantChunks = await searchRelevantChunks(question);
    
    let context = '';
    const sources = [];
    
    for (const chunk of relevantChunks) {
      context += `[${chunk.documentTitle}]\n${chunk.text}\n\n`;
      sources.push({ title: chunk.documentTitle });
    }
    
    let answer;
    
    if (context) {
      const prompt = `You are an AI assistant for Aurachron Systems. Answer based ONLY on this context. Be friendly and helpful.

CONTEXT:
${context}

USER QUESTION: ${question}

Answer concisely using only the context above. If the answer isn't there, say so politely.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      answer = response.text;
    } else {
      answer = "I couldn't find specific information about that in our knowledge base. 📚\n\nWould you like me to connect you with our support team? Just type 'Talk to human' and someone will assist you!";
    }
    
    // Save conversation
    await prisma.ragConversation.create({
      data: {
        sessionId,
        userId: user?.id,
        question,
        answer,
        sources
      }
    });
    
    // Update user last active
    if (user) {
      await prisma.ragUser.update({
        where: { id: user.id },
        data: { lastActive: new Date() }
      });
    }
    
    return { answer, sources, hasContext: context.length > 0, user };
    
  } catch (error) {
    console.error('RAG error:', error);
    return {
      answer: "I'm having trouble right now. Please contact us directly:\n📞 (021) 37123252\n📧 admin@aurachronsys.com",
      sources: [],
      hasContext: false,
      user: null
    };
  }
}

module.exports = {
  indexDocument,
  searchRelevantChunks,
  generateRagResponse
};