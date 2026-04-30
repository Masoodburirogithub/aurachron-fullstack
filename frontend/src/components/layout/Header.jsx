import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles, ArrowRight, Brain, Cloud, Smartphone, Shield, TrendingUp, RefreshCw } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { icon: Brain, name: 'AI Development', path: '/services/ai-development', desc: 'Custom AI agents & LLM integration', popular: true, color: 'from-blue-500 to-indigo-500' },
    { icon: Cloud, name: 'Enterprise SaaS', path: '/services/saas', desc: 'Multi-tenant scalable platforms', popular: false, color: 'from-cyan-500 to-blue-500' },
    { icon: Smartphone, name: 'Web & Mobile Apps', path: '/services/web-mobile', desc: 'Cross-platform applications', popular: false, color: 'from-green-500 to-teal-500' },
    { icon: RefreshCw, name: 'Legacy Modernization', path: '/services/legacy', desc: 'Zero-downtime migration', popular: false, color: 'from-orange-500 to-red-500' },
    { icon: Shield, name: 'Cybersecurity', path: '/services/security', desc: 'Enterprise-grade protection', popular: true, color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, name: 'AI Consulting', path: '/services/ai-consulting', desc: 'Strategy & rapid prototyping', popular: false, color: 'from-yellow-500 to-orange-500' },
  ];

  const headerBg = isScrolled 
    ? 'bg-white/95 dark:bg-dark/95 backdrop-blur-xl shadow-2xl' 
    : isHomePage ? 'bg-transparent' : 'bg-white dark:bg-dark shadow-md';
  const textColor = isScrolled || !isHomePage ? 'text-gray-800 dark:text-white' : 'text-white';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${headerBg}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group relative">
            <span className={`text-2xl md:text-3xl font-bold transition-all duration-300 ${textColor}`}>
              Aurachron<span className="text-indigo-600 dark:text-indigo-400"> Systems</span>
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/case-studies" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}>
              Work
            </Link>
            
            {/* Services Dropdown - Full Width */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}>
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-0 right-0 top-16 md:top-20 bg-white dark:bg-dark shadow-2xl border-t border-gray-100 dark:border-gray-800 z-50"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, idx) => (
                          <Link
                            key={idx}
                            to={service.path}
                            className="group relative p-5 rounded-2xl bg-white dark:bg-dark/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} p-0.5 flex-shrink-0`}>
                                <div className="w-full h-full bg-white dark:bg-dark rounded-xl flex items-center justify-center">
                                  <service.icon className="w-5 h-5 text-indigo-600" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                    {service.name}
                                  </h3>
                                  {service.popular && (
                                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.desc}</p>
                                <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Learn More <ArrowRight className="w-3 h-3" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">Need a Custom Solution?</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Get a tailored package for your business needs</p>
                            </div>
                          </div>
                          <Link to="/contact" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/about" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}>
              About
            </Link>
            <Link to="/careers" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}>
              Careers
            </Link>
            <Link to="/contact" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}>
              Contact
            </Link>
            <Link to="/contact" className="ml-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300">
              Start a Project
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden z-20" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className={textColor} size={24} /> : <Menu className={textColor} size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 bg-white dark:bg-dark z-40 overflow-y-auto"
            >
              <div className="container-custom py-6">
                <Link to="/case-studies" className="block px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                  Work
                </Link>
                <div className="border-b border-gray-100 dark:border-gray-800">
                  <div className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Services</div>
                  {services.map((service, idx) => (
                    <Link
                      key={idx}
                      to={service.path}
                      className="block px-8 py-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
                <Link to="/about" className="block px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </Link>
                <Link to="/careers" className="block px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                  Careers
                </Link>
                <Link to="/contact" className="block px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact
                </Link>
                <div className="p-4 mt-4">
                  <Link
                    to="/contact"
                    className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start a Project
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;