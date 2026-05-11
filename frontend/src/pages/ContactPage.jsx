// src/pages/ContactPage.jsx - UPDATED with API Integration
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

// ==================== SVG ICONS ====================
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
// ==================================================

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    timeline: '',
    projectDesc: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.timeline) newErrors.timeline = 'Please select timeline';
    if (!formData.projectDesc.trim()) newErrors.projectDesc = 'Project description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // UPDATED: Submit to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await contactAPI.submit(formData);
      console.log('Form submitted successfully:', response.data);
      
      toast.success('Message sent successfully! We will get back to you within 24 hours.');
      
      // Reset form
      setFormData({ 
        fullName: '', 
        email: '', 
        company: '', 
        timeline: '', 
        projectDesc: '' 
      });
      
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // --- CORRECTED COORDINATES FROM GOOGLE MAPS LINK ---
  // Latitude: 24.9236822, Longitude: 67.0937078
  const officialMapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.789012345678!2d67.0917078!3d24.9216822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ff22c1f5d49%3A0xc08a5c249812e6e0!2sAurachron%20Systems%20Pvt.%20Ltd.!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s";

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <div style={{ background:  'linear-gradient(135deg, #1E3A8A, #1E40AF, #2563EB)' , padding: '60px 0', textAlign: 'center', color: 'white' }}>
        <div className="container-custom">
          <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '16px' }}>
            Stop interviewing. Start launching.
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Let's talk about your next project. No discovery fee for Karachi-based startups.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div style={{ padding: '60px 0' }}>
        <div className="container-custom">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            
            {/* LEFT SIDE - Contact Info & Map */}
            <div>
              {/* Contact Info Card */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Get in Touch</h2>
                
                <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                    <MailIcon />
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Email</p>
                    <p style={{ color: '#4b5563', marginBottom: '2px' }}>admin@aurachronsys.com</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>We respond within 24 hours</p>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                    <MapPinIcon />
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Office Address</p>
                    <p style={{ color: '#4b5563', lineHeight: '1.5' }}>
                      Second Floor Office 02, Mishal Manzil, Fl-3/12,<br />
                      Main Rashid Minhas Rd, Block 5 Gulshan-e-Iqbal,<br />
                      Karachi, 75300 Pakistan
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/MwihF6X3meLmE1Vo6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontSize: '12px', marginTop: '8px', textDecoration: 'none' }}
                    >
                      Get Directions <ExternalLinkIcon />
                    </a>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                    <PhoneIcon />
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Phone</p>
                    <p style={{ color: '#4b5563' }}>+92 3112616192</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Mon-Fri, 9am-6pm</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <a href="#" style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', transition: 'all 0.3s' }}>
                    <LinkedinIcon />
                  </a>
                  <a href="#" style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', transition: 'all 0.3s' }}>
                    <GithubIcon />
                  </a>
                </div>
              </div>

              {/* --- GOOGLE MAP WITH CORRECT COORDINATES (RED PIN) --- */}
              <div style={{ marginTop: '24px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    src={officialMapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0, border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Aurachron Systems Pvt. Ltd. - Office Location"
                  />
                </div>
                <div style={{ padding: '12px', background: 'white', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>📍 Aurachron Systems Pvt. Ltd. – Head Office</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Second Floor Office 02, Mishal Manzil, Fl-3/12, Main Rashid Minhas Rd, Block 5 Gulshan-e-Iqbal, Karachi
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginBottom: '8px' }}>
                    📍 Coordinates: 24.9236822° N, 67.0937078° E
                  </div>
                  <a 
                    href="https://maps.app.goo.gl/MwihF6X3meLmE1Vo6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '13px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    Open in Google Maps for Navigation <ExternalLinkIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Contact Form */}
            <div>
              <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Send us a Message</h2>
                
                {/* Full Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Full Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', border: `1px solid ${errors.fullName ? '#ef4444' : '#d1d5db'}`, borderRadius: '12px', outline: 'none', fontSize: '14px' }}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`, borderRadius: '12px', outline: 'none', fontSize: '14px' }}
                    placeholder="john@company.com"
                  />
                  {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                </div>

                {/* Company */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none', fontSize: '14px' }}
                    placeholder="Your Company"
                  />
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Timeline <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', border: `1px solid ${errors.timeline ? '#ef4444' : '#d1d5db'}`, borderRadius: '12px', outline: 'none', background: 'white', fontSize: '14px' }}
                  >
                    <option value="">Select timeline</option>
                    <option value="ASAP">ASAP</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="Planning stage">Planning stage</option>
                  </select>
                  {errors.timeline && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.timeline}</p>}
                </div>

                {/* Project Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Project Description <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    name="projectDesc"
                    value={formData.projectDesc}
                    onChange={handleChange}
                    rows="4"
                    style={{ width: '100%', padding: '12px', border: `1px solid ${errors.projectDesc ? '#ef4444' : '#d1d5db'}`, borderRadius: '12px', outline: 'none', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit' }}
                    placeholder="Tell us about your project..."
                  />
                  {errors.projectDesc && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.projectDesc}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', color: '#1E3A8A', padding: '14px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <SendIcon />
                </button>

                {/* Success Message */}
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span style={{ color: '#10b981' }}><CheckCircleIcon /></span>
                  We'll respond within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .container-custom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
        }
        @media (max-width: 768px) {
          .container-custom {
            padding: 0 16px;
          }
          h1 { font-size: 32px !important; }
          h2 { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;