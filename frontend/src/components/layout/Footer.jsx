import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  // Simple email handler function
  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = 'admin@aurachronsys.com';
    const subject = 'Inquiry from Aurachron Website';
    const body = 'Hello Aurachron Team,%0D%0A%0D%0AI would like to inquire about...%0D%0A%0D%0AThank you.';
    
    // Create mailto link
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Aurachron<span className="text-[#F59E0B] dark:text-[#F59E0B]"> Systems</span>
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Systems thinking. Radical transparency. Zero downtime. Building the future from Karachi for the planet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#F59E0B] dark:text-[#F59E0B] transition-all hover:scale-110 transform">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-[#F59E0B] dark:text-[#F59E0B] transition-all hover:scale-110 transform">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-[#F59E0B] dark:text-[#F59E0B] transition-all hover:scale-110 transform">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/case-studies" className="text-gray-400 hover:text-indigo-400 transition-colors">Case Studies</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-indigo-400 transition-colors">Services</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-indigo-400 transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MdLocationOn size={18} />
                <span>Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MdEmail size={18} />
                <button 
                  onClick={handleEmailClick}
                  className="hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit"
                >
                  admin@aurachronsys.com
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Aurachron Systems.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;