// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    {
      name: 'Work',
      path: '/case-studies',
      dropdown: [
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'Success Stories', path: '/case-studies' },
        { name: 'Testimonials', path: '/#testimonials' },
      ],
    },
    {
      name: 'Services',
      path: '#',
      dropdown: [
        { name: 'AI Development & Agents', path: '/services/ai-development' },
        { name: 'Enterprise SaaS Platforms', path: '/services/saas' },
        { name: 'Web & Mobile Apps', path: '/services/web-mobile' },
        { name: 'Legacy Modernization', path: '/services/legacy' },
        { name: 'Cybersecurity & Compliance', path: '/services/security' },
        { name: 'AI Enablement Consulting', path: '/services/ai-consulting' },
      ],
    },
    {
      name: 'About',
      path: '/about',
      dropdown: [
        { name: 'Our Company', path: '/about' },
        { name: 'Leadership Team', path: '/about#team' },
        { name: 'Core Values & Culture', path: '/about#values' },
        { name: 'Careers', path: '/careers' },
      ],
    },
    {
      name: 'Insights',
      path: '#',
      dropdown: [
        { name: 'Blog', path: '/blog' },
        { name: 'Whitepapers', path: '/whitepapers' },
        { name: 'Webinars & Events', path: '/events' },
      ],
    },
    { name: 'Contact', path: '/contact', dropdown: null },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-primary">Aurachron</span>
            <span className="text-accent"> Systems</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-accent transition-colors">
                      <span>{item.name}</span>
                      <FiChevronDown className={`transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-4 py-2 text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`text-gray-700 hover:text-accent transition-colors ${
                      location.pathname === item.path ? 'text-accent font-semibold' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/contact"
              className="bg-accent text-primary px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Start a Project →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="py-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <>
                        <div className="px-4 py-2 font-semibold text-gray-800">{item.name}</div>
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="block px-8 py-2 text-gray-600 hover:bg-accent/10"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className="block px-4 py-2 text-gray-800 hover:bg-accent/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="px-4 pt-4">
                  <Link
                    to="/contact"
                    className="block text-center bg-accent text-primary px-6 py-2 rounded-full font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Start a Project →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;