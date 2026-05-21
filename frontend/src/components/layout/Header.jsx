// src/components/layout/Header.jsx - Reduced Width Dropdown with Icons
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { servicesAPI } from '../../services/api';
import logoimg from '../../../src/assets/metalogoimg.jpeg';
import * as Icons from 'lucide-react';

const Header = ({ isTransparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const dropdownTimeoutRef = useRef(null);
  const headerRef = useRef(null);
  const scrollTimeout = useRef(null);

  // Fetch services from your existing Services table
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      
      if (response.data?.success) {
        setServices(response.data.data.filter(s => s.isActive !== false));
      } else if (Array.isArray(response.data)) {
        setServices(response.data.filter(s => s.isActive !== false));
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Optimized scroll handler
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
    setMobileServicesOpen(false);
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
    setMobileServicesOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    closeMobileMenu();
  }, [location.pathname, navigate, closeMobileMenu]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown('services');
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const getHeaderBg = useCallback(() => {
    // If transparent prop is true, make header transparent
    if (isTransparent) return 'bg-transparent shadow-none';
    
    if (isMobileMenuOpen) return 'bg-white dark:bg-gray-900 shadow-xl';
    if (isScrolled) return 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl';
    if (!isHomePage) return 'bg-white dark:bg-gray-900 shadow-md';
    return 'bg-transparent';
  }, [isMobileMenuOpen, isScrolled, isHomePage, isTransparent]);

  const getTextColor = useCallback(() => {
    // If transparent prop is true, make text white
    if (isTransparent) return 'text-white';
    
    if (isMobileMenuOpen) return 'text-gray-800 dark:text-white';
    if (isScrolled) return 'text-gray-800 dark:text-white';
    if (!isHomePage) return 'text-gray-800 dark:text-white';
    return 'text-white';
  }, [isMobileMenuOpen, isScrolled, isHomePage, isTransparent]);

  const headerBg = getHeaderBg();
  const textColor = getTextColor();

  // Static navigation items - Updated order: About, Work
  const staticNavItems = [
    { id: 'about', name: 'About', path: '/about' },
    { id: 'work', name: 'Work', path: '/case-studies' }
  ];

  // Remaining nav items after Services dropdown
  const remainingNavItems = [
    { id: 'careers', name: 'Careers', path: '/careers' },
    { id: 'contact', name: 'Contact', path: '/contact' }
  ];

  // Dynamically get icon component
  const getIconComponent = (iconName) => {
    if (!iconName) return Icons.Brain;
    return Icons[iconName] || Icons.Brain;
  };

  // Sort services by display order
  const sortedServices = [...services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <header 
      ref={headerRef} 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBg}`}
      style={isTransparent ? {
        backgroundColor: 'transparent',
        boxShadow: 'none'
      } : {}}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 z-30 cursor-pointer transition-all duration-200 hover:opacity-80"
            aria-label="Go to homepage"
          >
            <div className="relative flex-shrink-0">
              <img 
                src={logoimg} 
                alt="Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="fallback-logo w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hidden">
                <span className="text-white font-bold text-xl md:text-2xl">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-base sm:text-lg md:text-3xl font-bold leading-tight ${textColor}`}>
                Aurachron<span className="text-indigo-600 dark:text-indigo-400"></span>
              </span>
              <span className=" text-[8px] sm:text-[10px] md:text-[11px] text-gold-400 dark:text-gold-400 -mt-0.5 hidden sm:block">
                - SYSTEMS PVT LTD -
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* About and Work - First */}
            {staticNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}
              >
                {item.name}
              </Link>
            ))}

            {/* Services Dropdown - Third */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
                    className="fixed left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-100 dark:border-gray-700 z-50 rounded-md overflow-hidden"
                    style={{ 
                      width: 'min(90vw, 800px, 40%)',
                      top: '64px'
                    }}
                  >
                    <div className="max-h-[80vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {sortedServices.map((service) => {
                            const IconComponent = getIconComponent(service.icon);
                            return (
                              <Link
                                key={service.id}
                                to={`/services/${service.id}`}
                                className="group relative p-4 rounded-xl bg-white dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${service.gradient || 'from-blue-500 to-indigo-500'} p-0.5 flex-shrink-0`}>
                                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                      <IconComponent className="w-4 h-4 text-indigo-600" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#F59E0B] transition-colors text-sm">
                                        {service.title}
                                      </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                      {service.description}
                                    </p>
                                    <div className="flex items-center gap-1 text-[#F59E0B] text-xs font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      Learn More <ArrowRight className="w-3 h-3" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        
                        {/* Custom Solution Banner */}
                        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">Need a Custom Solution?</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Get a tailored package for your business</p>
                              </div>
                            </div>
                            <Link to="/contact" className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition whitespace-nowrap">
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Careers and Contact - After Services */}
            {remainingNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${textColor} hover:bg-white/10 hover:scale-105`}
              >
                {item.name}
              </Link>
            ))}

            {/* Book Demo Button - Last */}
            <Link 
              to="/demo-request"
              className="ml-4 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-6 py-2 rounded-md font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Demo
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 z-[100] active:scale-95"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            style={{ 
              backgroundColor: isTransparent 
                ? 'rgba(255,255,255,0.1)'
                : (isScrolled || isMobileMenuOpen || !isHomePage ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'),
              border: isTransparent
                ? '1px solid rgba(255,255,255,0.2)'
                : (isScrolled || isMobileMenuOpen || !isHomePage ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.2)')
            }}
          >
            {isMobileMenuOpen ? (
              <X className={`${textColor} w-5 h-5`} />
            ) : (
              <Menu className={`${textColor} w-5 h-5`} />
            )}
          </button>
        </div>

        {/* Mobile Menu - With Dropdown for Services */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 top-16 md:top-20 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto z-40"
            >
              <div className="container-custom py-4 pb-24">
                {/* Mobile Menu Items - Increased text size */}
                <Link
                  to="/about"
                  className="block px-4 py-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 font-medium"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                
                <Link
                  to="/case-studies"
                  className="block px-4 py-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 font-medium"
                  onClick={closeMobileMenu}
                >
                  Work
                </Link>
                
                {/* Services Dropdown in Mobile */}
                <div className="border-b border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-4 py-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <span>Services</span>
                    {mobileServicesOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 pb-2 space-y-1">
                          {sortedServices.map((service) => (
                            <Link
                              key={service.id}
                              to={`/services/${service.id}`}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-[#F59E0B] transition-colors"
                              onClick={closeMobileMenu}
                            >
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${service.gradient || 'from-blue-500 to-indigo-500'} p-0.5 flex-shrink-0`}>
                                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                  {service.icon === 'Brain' ? '🧠' : service.icon === 'Cloud' ? '☁️' : service.icon === 'Smartphone' ? '📱' : '⚙️'}
                                </div>
                              </div>
                              <span className="text-sm sm:text-base">{service.title}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Link
                  to="/careers"
                  className="block px-4 py-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 font-medium"
                  onClick={closeMobileMenu}
                >
                  Careers
                </Link>
                
                <Link
                  to="/contact"
                  className="block px-4 py-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 font-medium"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
                
                {/* Mobile Book Demo Button */}
                <div className="p-4 mt-4">
                  <Link
                    to="/demo-request"
                    onClick={closeMobileMenu}
                    className="block w-full text-center bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-6 py-4 rounded-xl font-semibold text-base sm:text-lg"
                  >
                    Book Demo
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