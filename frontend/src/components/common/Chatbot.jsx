// src/components/common/Chatbot.jsx - Complete Working Version
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Maximize2, Sparkles, Phone, Mail, User, AtSign } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUserForm, setShowUserForm] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showContactOptions, setShowContactOptions] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Admin contact info - UPDATE THESE WITH YOUR REAL INFO
  const ADMIN_PHONE = "+92 311 2616192";
  const ADMIN_EMAIL = "admin@aurachronsys.com";
  const ADMIN_WHATSAPP = "https://wa.me/923112616192";

  // Load user info from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('chatUserInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setShowUserForm(false);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current && !showUserForm) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, showUserForm]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        const chatButton = document.querySelector('.chat-toggle-button');
        if (chatButton && !chatButton.contains(event.target)) {
          setIsOpen(false);
          setIsMinimized(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  const saveUserInfo = () => {
    if (userInfo.name) {
      localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));
      setShowUserForm(false);
      
      // Add welcome message
      const welcomeMessage = `Nice to meet you ${userInfo.name}! 👋\n\nI'm your AI assistant. How can I help you today?\n\nYou can ask me about:\n• Our services\n• Pricing\n• Careers\n\nOr type "Talk to admin" to speak with a real person.`;
      
      setMessages([{ role: 'assistant', message: welcomeMessage }]);
    }
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, message: content }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping || showUserForm) return;

    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      let botResponse = "";
      
      // Check if user wants to talk to admin
      if (userMessage.toLowerCase().includes('talk to admin') || 
          userMessage.toLowerCase().includes('human') || 
          userMessage.toLowerCase().includes('real person') ||
          userMessage.toLowerCase().includes('speak to agent')) {
        
        botResponse = `I understand you'd like to speak with a real person. Our team is ready to assist you!\n\n📞 **Call us:** ${ADMIN_PHONE}\n📧 **Email us:** ${ADMIN_EMAIL}\n💬 **WhatsApp:** ${ADMIN_WHATSAPP}\n\nPlease feel free to reach out directly. Would you like me to help with anything else while you wait?`;
        
        setShowContactOptions(true);
        
      } else if (userMessage.toLowerCase().includes('service')) {
        botResponse = "We offer a wide range of services including:\n\n• 🤖 **AI Development** - Custom AI agents & LLM integration\n• ☁️ **Enterprise SaaS** - Scalable multi-tenant platforms\n• 📱 **Web & Mobile Apps** - Cross-platform applications\n• 🔒 **Cybersecurity** - Enterprise-grade protection\n• 💡 **AI Consulting** - Strategy & rapid prototyping\n\nWould you like to know more about any specific service?";
        
      } else if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
        botResponse = "Our pricing is project-based and customized to your specific needs. For an accurate quote, please:\n\n1. Share your project requirements\n2. Schedule a free consultation call\n3. Get a detailed proposal\n\nWould you like to schedule a call with our team?";
        
      } else if (userMessage.toLowerCase().includes('career') || userMessage.toLowerCase().includes('job')) {
        botResponse = "We're always looking for talented individuals! Current openings include:\n\n• Senior Full Stack Engineer\n• AI/ML Engineer\n• Frontend Developer\n• DevOps Engineer\n\nCheck our Careers page for details or send your resume to careers@aurachronsys.com";
        
      } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        botResponse = `Hello ${userInfo.name || 'there'}! 👋\n\nHow can I assist you today? You can ask me about our services, pricing, careers, or type "Talk to admin" to speak with a real person.`;
        
      } else if (userMessage.toLowerCase().includes('contact') || userMessage.toLowerCase().includes('reach')) {
        botResponse = `You can reach us through:\n\n📞 Phone: ${ADMIN_PHONE}\n📧 Email: ${ADMIN_EMAIL}\n💬 WhatsApp: ${ADMIN_WHATSAPP}\n\nOur team is available Monday-Friday, 9am-6pm.`;
        
      } else {
        botResponse = `Thank you for your message! I've noted your query. Our team will review it and get back to you soon.\n\nIn the meantime, you can:\n• Schedule a free consultation\n• Call us directly at ${ADMIN_PHONE}\n• Email us at ${ADMIN_EMAIL}\n\nIs there anything specific I can help you with?`;
      }
      
      addMessage('assistant', botResponse);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showContactInfo = () => {
    addMessage('assistant', `Here's how you can reach us:\n\n📞 **Phone:** ${ADMIN_PHONE}\n📧 **Email:** ${ADMIN_EMAIL}\n💬 **WhatsApp:** Click to chat\n\nClick the buttons below to contact us directly.`);
    setShowContactOptions(true);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="chat-toggle-button fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all z-50 group cursor-pointer"
      >
        {isOpen ? (
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        )}
        {!isOpen && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed bottom-24 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
              isMinimized ? 'w-72 h-12' : 'w-[400px] h-[600px]'
            }`}
            style={{ maxHeight: 'calc(100vh - 40px)', top: 'auto' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <p className="text-xs text-indigo-200">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="hover:bg-white/20 p-2 rounded-lg transition-all cursor-pointer"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* User Info Form */}
                {showUserForm && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      👋 Welcome! Please introduce yourself
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                        <User size={16} className="text-gray-400" />
                        <input
                          type="text"
                          placeholder="Your name *"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                        <AtSign size={16} className="text-gray-400" />
                        <input
                          type="email"
                          placeholder="Your email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
                        <Phone size={16} className="text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Your phone (optional)"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                      <button
                        onClick={saveUserInfo}
                        disabled={!userInfo.name}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        Start Chatting
                      </button>
                    </div>
                  </div>
                )}

                {/* Contact Options Banner */}
                {showContactOptions && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-400 mb-2 font-medium">
                      📞 Contact our support team directly:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href={`tel:${ADMIN_PHONE.replace(/\s/g, '')}`} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition"
                      >
                        <Phone size={12} /> Call Now
                      </a>
                      <a 
                        href={`mailto:${ADMIN_EMAIL}`} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                      >
                        <Mail size={12} /> Send Email
                      </a>
                      <a 
                        href={ADMIN_WHATSAPP} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Messages Container */}
                <div 
                  ref={messagesContainerRef}
                  className="h-[380px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
                >
                  {messages.length === 0 && !showUserForm && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="text-indigo-600" size={28} />
                      </div>
                      <p className="font-medium text-sm">👋 Hi {userInfo.name}! How can I help you today?</p>
                      <p className="text-xs mt-2">Ask me about services, pricing, or careers</p>
                      <button 
                        onClick={showContactInfo}
                        className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        📞 Need to contact support?
                      </button>
                    </div>
                  )}
                  
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 p-3 rounded-2xl rounded-bl-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="px-4 pt-3 pb-4">
                    <div className="flex items-center gap-2">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={showUserForm ? "Please introduce yourself first" : "Type your message..."}
                        disabled={showUserForm}
                        rows={1}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                        style={{ minHeight: '44px', maxHeight: '100px' }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping || showUserForm}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
                      Type <span className="font-medium text-indigo-500">"Talk to admin"</span> to speak with a real person
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;