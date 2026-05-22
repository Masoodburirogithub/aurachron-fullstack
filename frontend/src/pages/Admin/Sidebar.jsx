// src/pages/Admin/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiBriefcase, FiUsers, FiMail, FiFileText, FiMenu, 
  FiLogOut, FiCpu, FiGrid, FiX, FiChevronLeft, FiChevronRight,
  FiSidebar
} from 'react-icons/fi';
import { FiSettings } from 'react-icons/fi';
import { FiDatabase } from 'react-icons/fi';
import { FiMessageCircle } from 'react-icons/fi';
import logoimg from '../../../src/assets/logoimg.jpeg';

const Sidebar = ({ onLogout, isMobile, closeMobileMenu }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/admin/case-studies', icon: FiFileText, label: 'Case Studies' },
    { path: '/admin/services', icon: FiGrid, label: 'Services' },
    { path: '/admin/careers', icon: FiBriefcase, label: 'Careers' },
    { path: '/admin/contacts', icon: FiMail, label: 'Contacts' },
    { path: '/admin/demo-requests', icon: FiMail, label: 'Demo Requests' },
    { path: '/admin/rag-users', icon: FiMessageCircle, label: 'RAG Conversations' },
    { path: '/admin/rag', icon: FiDatabase, label: 'RAG Knowledge Base' },
    { path: '/admin/visitors', icon: FiUsers, label: 'Website Visitors' },
    { path: '/admin/hero', icon: FiHome, label: 'Hero Section' },
  ];

  const handleNavClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside 
        className={`hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen sticky top-0 transition-all duration-300 ease-in-out shadow-xl relative overflow-x-hidden ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header - Logo completely hidden when collapsed */}
        <div className={`p-5 border-b border-gray-700/50 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {/* Logo - Only show when NOT collapsed */}
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img 
                  src={logoimg} 
                  alt="Logo" 
                  className="w-10 h-10 object-contain rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="fallback-logo w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-xl flex items-center justify-center shadow-lg hidden">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold leading-tight text-white">
                  Aurachron<span className="text-[#F59E0B]"></span>
                </span>
                <span className="text-[9px] text-gray-400 -mt-0.5 hidden sm:block">
                  SYSTEMS PVT LTD
                </span>
              </div>
            </div>
          )}
          
          {/* Collapse Toggle Button - Always visible */}
          <button
            onClick={toggleSidebar}
            className={`bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300 rounded-lg p-2 shadow-md border border-gray-700 group flex items-center justify-center ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FiSidebar 
              size={18} 
              className={`group-hover:scale-110 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        
        {/* Navigation - Only icons when collapsed */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact || false}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `relative flex items-center transition-all duration-300 group my-1 mx-2 rounded-lg ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#F59E0B]/20 to-[#FBBF24]/10 text-[#FBBF24] shadow-lg scale-105' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white hover:scale-102'
                } ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-2.5'}`
              }
              title={isCollapsed ? item.label : ''}
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 w-1 h-8 bg-gradient-to-b from-[#F59E0B] to-[#FBBF24] rounded-r-full"></span>
                  )}
                  
                  <item.icon 
                    size={20} 
                    className={`flex-shrink-0 transition-all duration-300 ${
                      isCollapsed ? 'group-hover:scale-110' : ''
                    }`} 
                  />
                  
                  {!isCollapsed && (
                    <span className="whitespace-nowrap text-sm font-medium transition-all duration-300">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip on hover when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - NO collapse button here */}
      <aside className={`
        fixed lg:hidden inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-2xl overflow-x-hidden
        ${isMobile ? 'translate-x-0' : '-translate-x-full'} w-72
      `}>
        {/* Mobile Header */}
        <div className="p-5 border-b border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img 
                src={logoimg} 
                alt="Logo" 
                className="w-10 h-10 object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
              <div className="fallback-logo w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-xl flex items-center justify-center shadow-lg hidden">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold leading-tight text-white">
                Aurachron<span className="text-[#F59E0B]"></span>
              </span>
              <span className="text-[9px] text-gray-400 -mt-0.5 hidden sm:block">
                SYSTEMS PVT LTD
              </span>
            </div>
          </div>
          <button
            onClick={handleNavClick}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <FiX size={22} />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact || false}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 my-1 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#F59E0B]/20 to-[#FBBF24]/10 text-[#FBBF24] shadow-md' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="w-1 h-6 bg-gradient-to-b from-[#F59E0B] to-[#FBBF24] rounded-full"></span>
                  )}
                  <item.icon size={20} className="flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className="fixed lg:hidden inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleNavClick}
        />
      )}
    </>
  );
};

export default Sidebar;