import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles, ArrowRight, Brain, Cloud, Smartphone, Shield, TrendingUp, RefreshCw } from 'lucide-react';
import logoimg from '../../../src/assets/logoimg.jpeg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);
  const scrollTimeout = useRef(null);

  // Optimized scroll handler with debounce
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        cancelAnimationFrame(scrollTimeout.current);
      }
      scrollTimeout.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        cancelAnimationFrame(scrollTimeout.current);
      }
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle logo click - simple navigation to home
  const handleLogoClick = useCallback(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    closeMobileMenu();
  }, [location.pathname, navigate, closeMobileMenu]);

  const services = [
    { icon: Brain, name: 'AI Development', path: '/services/ai-development', desc: 'Custom AI agents & LLM integration', popular: true, color: 'from-blue-500 to-indigo-500' },
    { icon: Cloud, name: 'Enterprise SaaS', path: '/services/saas', desc: 'Multi-tenant scalable platforms', popular: false, color: 'from-cyan-500 to-blue-500' },
    { icon: Smartphone, name: 'Web & Mobile Apps', path: '/services/web-mobile', desc: 'Cross-platform applications', popular: false, color: 'from-green-500 to-teal-500' },
    { icon: RefreshCw, name: 'Legacy Modernization', path: '/services/legacy', desc: 'Zero-downtime migration', popular: false, color: 'from-orange-500 to-red-500' },
    { icon: Shield, name: 'Cybersecurity', path: '/services/security', desc: 'Enterprise-grade protection', popular: true, color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, name: 'AI Consulting', path: '/services/ai-consulting', desc: 'Strategy & rapid prototyping', popular: false, color: 'from-yellow-500 to-orange-500' },
  ];

  const navItems = [
    { name: 'Work', path: '/case-studies', icon: '📁' },
    { name: 'About', path: '/about', icon: '👥' },
    { name: 'Careers', path: '/careers', icon: '💼' },
    { name: 'Contact', path: '/contact', icon: '📞' },
  ];

  // Get header background based on state
  const getHeaderBg = useCallback(() => {
    if (isMobileMenuOpen) return 'bg-white dark:bg-dark shadow-xl';
    if (isScrolled) return 'bg-white/95 dark:bg-dark/95 backdrop-blur-xl shadow-2xl';
    if (!isHomePage) return 'bg-white dark:bg-dark shadow-md';
    return 'bg-transparent';
  }, [isMobileMenuOpen, isScrolled, isHomePage]);

  const getTextColor = useCallback(() => {
    if (isMobileMenuOpen) return 'text-gray-800 dark:text-white';
    if (isScrolled) return 'text-gray-800 dark:text-white';
    if (!isHomePage) return 'text-gray-800 dark:text-white';
    return 'text-white';
  }, [isMobileMenuOpen, isScrolled, isHomePage]);

  const headerBg = getHeaderBg();
  const textColor = getTextColor();

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 z-30 cursor-pointer transition-all duration-200 hover:opacity-80"
            aria-label="Go to homepage"
          >
            <div className=" relative flex-shrink-0">
              <img 
                src={logoimg} 
                alt="Aurachron Systems Logo" 
                className="w-6 rounded-full h-6 md:w-12 md:h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.parentElement) {
                    const fallback = e.target.parentElement.querySelector('.fallback-logo');
                    if (fallback) fallback.style.display = 'flex';
                  }
                }}
              />
              <div className="fallback-logo w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hidden">
                <span className="text-white font-bold text-xl md:text-2xl">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg md:text-2xl font-bold leading-tight ${textColor}`}>
                AURACHRON<span className="text-indigo-600 dark:text-indigo-400"></span>
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5 hidden sm:block">
               SYSTEMS PVT LTD
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* <Link to="/case-studies" className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}>
              Work
            </Link> */}
            
            {/* Services Dropdown - FULL WIDTH AT DESKTOP */}
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
                    style={{ width: '100vw' }}
                  >
                    <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, idx) => (
                          <Link
                            key={idx}
                            to={service.path}
                            className="group relative p-5 rounded-2xl bg-white dark:bg-dark/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                            onClick={() => setActiveDropdown(null)}
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
            
            {/* Other Nav Items */}
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
            
            <Link 
              to="/contact" 
              className="ml-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
              onClick={closeMobileMenu}
            >
              Start a Project
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 z-[100] active:scale-95"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            style={{ 
              backgroundColor: isScrolled || isMobileMenuOpen || !isHomePage ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
              border: isScrolled || isMobileMenuOpen || !isHomePage ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {isMobileMenuOpen ? (
              <X className={`${textColor} w-5 h-5`} />
            ) : (
              <Menu className={`${textColor} w-5 h-5`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 top-16 md:top-20 bg-white dark:bg-dark shadow-2xl overflow-y-auto"
              style={{ zIndex: 9998 }}
            >
              <div className="container-custom py-4 pb-24">
                {/* Services Section */}
                <div className="mb-4">
                  <div className="px-4 py-3 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2 rounded-xl">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Services</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {services.map((service, idx) => (
                      <Link
                        key={idx}
                        to={service.path}
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 rounded-xl"
                        onClick={closeMobileMenu}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${service.color} p-0.5 flex-shrink-0`}>
                          <div className="w-full h-full bg-white dark:bg-dark rounded-lg flex items-center justify-center">
                            <service.icon className="w-4 h-4 text-indigo-600" />
                          </div>
                        </div>
                        <span className="flex-1 text-sm">{service.name}</span>
                        {service.popular && (
                          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Other Nav Items */}
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className="flex items-center gap-3 px-4 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                {/* CTA Button */}
                <div className="p-4 mt-6">
                  <Link
                    to="/contact"
                    className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    Start a Project →
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