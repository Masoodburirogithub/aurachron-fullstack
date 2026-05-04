// src/pages/CaseStudiesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
// import { caseStudiesAPI } from '../services/api';
import { caseStudiesAPI, getImageUrl } from '../services/api';

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await caseStudiesAPI.getAll();
      console.log('Case Studies Page Data:', response.data);
      
      let data = [];
      if (response.data?.success) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      
      // Filter only active case studies
      const activeStudies = data.filter(study => study.isActive !== false);
      setCaseStudies(activeStudies);
    } catch (err) {
      console.error('Error fetching case studies:', err);
      setError(err.message);
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6b7280' }}>Loading case studies...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Unable to Load Case Studies</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={fetchCaseStudies}
            style={{ padding: '10px 30px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Hero Section - Guaranteed Visible */}
      <div style={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}
          >
            Our Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            style={{ fontSize: '20px', color: '#c7d2fe' }}
          >
            Real results from real partnerships
          </motion.p>
        </div>
      </div>

      {/* Case Studies List */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px' }}>
        {caseStudies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles size={40} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '10px' }}>No Case Studies Yet</h3>
            <p style={{ color: '#6b7280' }}>Check back soon for our success stories.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'box-shadow 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 25px 35px -12px rgba(0,0,0,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {/* Image Column */}
                  <div style={{ height: '400px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
             {study.imageUrl ? (
  <img 
    src={getImageUrl(study.imageUrl)}
    alt={study.title}
    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
    onError={(e) => {
      console.error('Image failed to load:', getImageUrl(study.imageUrl));
      e.target.onerror = null;
      e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Image+Not+Found';
    }}
  />
) : (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)' }}>
    <ImageIcon size={80} style={{ color: '#818cf8' }} />
  </div>
)}
                  </div>
                  
                  {/* Content Column */}
                  <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{study.industry}</span>
                    </div>
                    
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', lineHeight: '1.3' }}>{study.title}</h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                        Challenge
                      </h3>
                      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{study.challenge}</p>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                        Solution
                      </h3>
                      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{study.solution}</p>
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#4f46e5', borderRadius: '50%' }}></span>
                        Result
                      </h3>
                      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{study.result}</p>
                    </div>
                    
                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>
                        {study.result?.match(/\d+%/)?.[0] || 'Success'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Technology: {study.technology}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
        <button 
          onClick={() => window.history.back()}
          style={{ padding: '12px 32px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '500', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default CaseStudiesPage;