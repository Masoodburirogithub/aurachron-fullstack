// src/components/common/RagChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Minimize2, Maximize2, Sparkles, 
  Database, Loader, Bot, User, Phone, Mail, Copy, Check,
  Headphones, MessageCircle, Zap, Bell, Users
} from 'lucide-react';
import { ragAPI } from '../../services/api';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const RagChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [isUserInfoSubmitted, setIsUserInfoSubmitted] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notificationSound] = useState(new Audio('/notification.mp3'));
  
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    newSocket.on('admin-accepted', (data) => {
      toast.success(data.message, { duration: 5000 });
      addBotMessage(data.message);
    });
    
    return () => newSocket.disconnect();
  }, []);

  // Initialize session and user info
  useEffect(() => {
    let storedSessionId = localStorage.getItem('ragSessionId');
    const storedUserInfo = localStorage.getItem('ragUserInfo');
    
    if (!storedSessionId) {
      storedSessionId = 'rag_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ragSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
    
    if (storedUserInfo) {
      const parsedUser = JSON.parse(storedUserInfo);
      setUserInfo(parsedUser);
      setIsUserInfoSubmitted(true);
      setShowUserForm(false);
    } else {
      setShowUserForm(true);
    }
  }, []);

  // Load conversation history
  useEffect(() => {
    if (sessionId && isOpen && !hasLoaded && !isLoadingHistory && isUserInfoSubmitted) {
      loadConversationHistory();
    }
  }, [sessionId, isOpen, isUserInfoSubmitted]);

  const loadConversationHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await ragAPI.getConversations(sessionId);
      if (response.data?.success && response.data.data.length > 0) {
        const history = [];
        response.data.data.forEach(conv => {
          history.push({ role: 'user', content: conv.question });
          history.push({ role: 'assistant', content: conv.answer, sources: conv.sources });
        });
        setMessages(history);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current && isUserInfoSubmitted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized, isUserInfoSubmitted]);

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  const addBotMessage = (content) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
  };

  const saveUserInfo = async () => {
    if (!userInfo.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    localStorage.setItem('ragUserInfo', JSON.stringify(userInfo));
    setIsUserInfoSubmitted(true);
    setShowUserForm(false);
    
    const welcomeMessage = `Nice to meet you ${userInfo.name}! 👋\n\nI'm your AI assistant for Aurachron Systems. I can help you with:\n\n• 📋 Information about our services\n• 💰 Pricing and packages\n• 🔧 Technical support\n• 📞 Contact information\n\n**Type "Talk to human" anytime to speak with a real person!**\n\nWhat would you like to know today?`;
    
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
    
    try {
      await ragAPI.saveUserInfo(sessionId, userInfo.name, userInfo.email, userInfo.phone);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping || !sessionId || !isUserInfoSubmitted) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);
    setShowContactOptions(false);

    try {
      const response = await ragAPI.askQuestion(
        sessionId, 
        userMessage,
        userInfo.name,
        userInfo.email,
        userInfo.phone
      );
      
      if (response.data?.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.data.answer,
          sources: response.data.sources
        }]);
        
        if (response.data.adminRequested) {
          setShowContactOptions(true);
          setContactInfo(response.data.contactInfo);
          toast.success('Admin has been notified! They will contact you shortly.', {
            duration: 5000,
            icon: '👥'
          });
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting. Please try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyContact = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && isUserInfoSubmitted) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What services do you offer?",
    "Tell me about your AI solutions",
    "Talk to human",
    "What technologies do you use?"
  ];

  return (
    <>
      {/* Chat Toggle Button - Responsive */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="rag-chat-toggle fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-xl transition-all z-50 group cursor-pointer"
      >
        {isOpen ? (
          <X size={20} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform" />
        ) : (
          <div className="relative">
            <Bot size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed bottom-20 sm:bottom-24 right-4 sm:right-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden ${
              isMinimized ? 'w-72 sm:w-80 h-14' : 'w-[calc(100vw-2rem)] sm:w-[400px] md:w-[420px] lg:w-[450px] h-[500px] sm:h-[550px] md:h-[580px]'
            }`}
            style={{ maxHeight: 'calc(100vh - 40px)', top: 'auto' }}
          >
            {/* Header - Responsive */}
            <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white px-4 sm:px-5 py-3 sm:py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Zap size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base md:text-lg">Aurachron AI</h3>
                    <p className="text-[10px] sm:text-xs text-indigo-200">Powered by Aurachron • 24/7</p>
                  </div>
                </div>
                <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition-all">
                  {isMinimized ? <Maximize2 size={14} className="sm:w-4 sm:h-4" /> : <Minimize2 size={14} className="sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* User Info Form - Responsive */}
                {showUserForm && !isUserInfoSubmitted && (
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b">
                    <div className="text-center mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold">Welcome! 👋</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Please introduce yourself</p>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        placeholder="Your name *"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="email"
                        placeholder="Your email (optional)"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg"
                      />
                      <input
                        type="tel"
                        placeholder="Your phone (optional)"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg"
                      />
                      <button
                        onClick={saveUserInfo}
                        disabled={!userInfo.name}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-1.5 sm:py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        Start Chatting
                      </button>
                    </div>
                  </div>
                )}

                {/* Contact Options Banner - Responsive */}
                {showContactOptions && contactInfo && (
                  <div className="p-3 sm:p-4 bg-green-50 border-b border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      <span className="text-xs sm:text-sm font-semibold text-green-700">Connect with a real person:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => copyContact(contactInfo.phone, 'Phone number')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm hover:bg-green-700 transition"
                      >
                        <Phone size={12} className="sm:w-3.5 sm:h-3.5" /> Call
                      </button>
                      <button
                        onClick={() => copyContact(contactInfo.email, 'Email')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition"
                      >
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5" /> Copy Email
                      </button>
                      <a
                        href={contactInfo.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-green-500 text-white rounded-lg text-xs sm:text-sm hover:bg-green-600 transition"
                      >
                        <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Messages Area - Responsive */}
                {isUserInfoSubmitted && (
                  <>
                    <div 
                      ref={messagesContainerRef}
                      className="h-[350px] sm:h-[350px] md:h-[390px] overflow-y-auto p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white"
                    >
                      {messages.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <Bot size={24} className="sm:w-8 sm:h-8 text-indigo-600" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                            Hey {userInfo.name}! 👋
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Ask me about Aurachron</p>
                          <div className="flex flex-wrap gap-2 justify-center px-2">
                            {suggestedQuestions.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => setInput(q)}
                                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                            }`}>
                              {msg.sources && msg.sources.length > 0 && (
                                <div className="mb-1 pb-1 border-b border-gray-200">
                                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-indigo-600">
                                    <Database size={10} className="sm:w-3 sm:h-3" />
                                    <span className="truncate">Sources: {msg.sources.map(s => s.title).join(', ')}</span>
                                  </div>
                                </div>
                              )}
                              <div className="text-xs sm:text-sm leading-relaxed break-words">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 rounded-lg rounded-bl-md">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area - Responsive */}
                    <div className="border-t p-3 sm:p-4 bg-white">
                      <div className="flex gap-2">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything..."
                          rows={1}
                          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          style={{ minHeight: '40px', maxHeight: '100px' }}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!input.trim() || isTyping}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 sm:p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          <Send size={16} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Database size={10} className="sm:w-3 sm:h-3" />
                          <span>RAG Knowledge Base</span>
                        </div>
                        <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] sm:text-xs">↵</kbd> to send</div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RagChatbot;