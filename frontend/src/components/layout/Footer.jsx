// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Aurachron<span className="text-accent"> Systems</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Systems thinking. Radical transparency. Zero downtime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <FiLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <FiGithub size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <FiTwitter size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/case-studies" className="text-gray-400 hover:text-accent">Work</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-accent">Services</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-accent">About</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-accent">Insights</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-accent">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-accent">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-accent">Cookie Preferences</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 mb-2">Second Floor Office 02, Mishal Manzil</p>
            <p className="text-gray-400 mb-2">Main Rashid Minhas Rd, Block 5</p>
            <p className="text-gray-400 mb-2">Karachi, 75300, Pakistan</p>
            <p className="text-gray-400">hr@aurachronsys.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 — Built in Karachi for the planet.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;