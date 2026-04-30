import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen && chatWindowRef.current) {
      const rect = chatWindowRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        chatWindowRef.current.style.top = '20px';
      }
    }
  }, [isOpen, isMinimized]);

  // Handle click outside to close
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

  // Toggle chat function
  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Thanks for your message! Our team will get back to you within 24 hours.",
        "Great question! We specialize in AI-augmented development with zero technical debt.",
        "Would you like to schedule a free consultation call? We'd love to discuss your project!",
        "Check out our case studies to see how we've helped businesses scale 10x faster."
      ];
      setMessages(prev => [...prev, { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] }]);
      setIsTyping(false);
    }, 1500);
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

      {/* Chat Window - Reduced size */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed bottom-24 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
              isMinimized ? 'w-72 h-12' : 'w-[360px] h-[520px]'
            }`}
            style={{ maxHeight: 'calc(100vh - 40px)', top: 'auto' }}
          >
            {/* Header - Compact */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <p className="text-[10px] text-indigo-200">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="hover:bg-white/20 p-1.5 rounded-lg transition-all cursor-pointer"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Container - Adjusted height */}
                <div 
                  ref={messagesContainerRef}
                  className="h-[380px] overflow-y-auto overflow-x-hidden px-3 py-3 space-y-2.5 bg-gray-50 dark:bg-gray-900"
                  style={{
                    scrollBehavior: 'smooth',
                  }}
                >
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                      <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="text-indigo-600" size={24} />
                      </div>
                      <p className="font-medium text-sm">👋 Hi! How can I help you today?</p>
                      <p className="text-xs mt-1.5">Ask about services, pricing, or careers!</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                        <button 
                          onClick={() => setInput("What services do you offer?")}
                          className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          What services?
                        </button>
                        <button 
                          onClick={() => setInput("Tell me about pricing")}
                          className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          Pricing
                        </button>
                        <button 
                          onClick={() => setInput("How to apply for job?")}
                          className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          Careers
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-2.5 rounded-xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-sm'
                      }`}>
                        <p className="text-xs whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2.5 rounded-xl rounded-bl-sm">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Spacer */}
                  <div className="h-2" />
                </div>

                {/* Input Area - Compact with visible helper text */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="px-3 pt-2 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type your message..."
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all"
                        />
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Send size={16} />
                      </motion.button>
                    </div>
                    {/* Helper Text - Now fully visible */}
                    <div className="mt-1.5 text-center">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px] font-mono">↵</kbd> to send • Click outside to close
                      </p>
                    </div>
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