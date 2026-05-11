// src/pages/Admin/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiBriefcase, FiUsers, FiMail, FiFileText, FiMenu, 
  FiLogOut, FiCpu, FiGrid, FiX
} from 'react-icons/fi';
import { FiSettings } from 'react-icons/fi';
import { FiDatabase } from 'react-icons/fi';
import { FiMessageCircle } from 'react-icons/fi';

const Sidebar = ({ onLogout, isMobile, closeMobileMenu }) => {
  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/case-studies', icon: FiFileText, label: 'Case Studies' },
    { path: '/admin/careers', icon: FiBriefcase, label: 'Careers' },
    { path: '/admin/contacts', icon: FiMail, label: 'Contacts' },
    { path: '/admin/applications', icon: FiUsers, label: 'Applications' },
    { path: '/admin/services', icon: FiGrid, label: 'Services' },
    { path: '/admin/hero', icon: FiHome, label: 'Hero Section' },
    { path: '/admin/rag', icon: FiDatabase, label: 'RAG Knowledge Base' },
    { path: '/admin/rag-users', icon: FiMessageCircle, label: 'RAG Conversations' },
  ];

  const handleNavClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen overflow-y-auto sticky top-0">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold">
          Aurachron<span className="text-accent"> Admin</span>
        </h1>
        {isMobile && (
          <button
            onClick={handleNavClick}
            className="text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <FiX size={24} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-6 py-3 transition-colors ${
                isActive ? 'bg-accent/20 text-accent' : 'hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* <div className="p-6 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={() => {
            if (onLogout) onLogout();
            handleNavClick();
          }}
          className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg hover:bg-red-600/20 text-gray-300 hover:text-red-400 transition-colors"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;