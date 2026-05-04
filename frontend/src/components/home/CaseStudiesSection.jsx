// src/components/home/CaseStudiesSection.jsx
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react';
import { caseStudiesAPI, getImageUrl } from '../../services/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CaseStudyCard = ({ study, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const tags = study.technology ? study.technology.split(',').map(t => t.trim()) : [];

  // Debug log to check image URL
  // console.log('Study image URL:', study.imageUrl);
  // console.log('Full image URL:', getImageUrl(study.imageUrl));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '480px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
      }}
    >
      {/* Image Section - Fixed with getImageUrl */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
        {study.imageUrl ? (
          <img 
            src={getImageUrl(study.imageUrl)}
            alt={study.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onError={(e) => {
              console.error('Image failed to load:', getImageUrl(study.imageUrl));
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found';
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)' }}>
            <ImageIcon size={64} style={{ color: '#818cf8' }} />
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {tags.slice(0, 2).map((tag, i) => (
            <span key={i} style={{ fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: 'white', padding: '5px 12px', borderRadius: '9999px' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Content Section */}
      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{study.industry}</div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '14px', lineHeight: '1.4' }}>{study.title}</h3>
        <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6', flex: 1 }}>{study.challenge?.substring(0, 150)}...</p>
        
        <Link 
          to={`/case-studies/${study.id}`} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: '600', fontSize: '15px', textDecoration: 'none', marginTop: '8px' }}
        >
          Read Full Story <ExternalLink size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

const CaseStudiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await caseStudiesAPI.getAll();
      console.log('Case Studies Section Data:', response.data);
      
      let data = [];
      if (response.data?.success) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      
      // Debug: Check image URLs from API
      console.log('Case studies with images:', data.map(s => ({ title: s.title, imageUrl: s.imageUrl })));
      
      const activeStudies = data.filter(study => study.isActive !== false);
      setCaseStudies(activeStudies);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-block', height: '30px', width: '150px', backgroundColor: '#e5e7eb', borderRadius: '9999px', marginBottom: '16px' }}></div>
            <div style={{ height: '48px', width: '300px', backgroundColor: '#e5e7eb', borderRadius: '8px', margin: '0 auto 16px' }}></div>
            <div style={{ height: '24px', width: '350px', backgroundColor: '#e5e7eb', borderRadius: '8px', margin: '0 auto' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '520px', backgroundColor: '#e5e7eb', borderRadius: '16px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  const displayStudies = caseStudies.filter(study => study.isActive !== false);

  return (
    <div ref={ref} style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: '#e0e7ff', 
            padding: '8px 24px', 
            borderRadius: '9999px', 
            marginBottom: '20px' 
          }}>
            <Sparkles size={18} style={{ color: '#4f46e5' }} />
            <span style={{ color: '#4f46e5', fontSize: '15px', fontWeight: '500' }}>Success Stories</span>
          </div>
          
          <h2 style={{ 
            fontSize: 'clamp(36px, 6vw, 52px)', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '20px',
            padding: '0 20px',
            lineHeight: '1.2'
          }}>
            Our Prime <span style={{ color: '#4f46e5' }}>Projects & Case Studies</span>
          </h2>
          
          <p style={{ 
            fontSize: 'clamp(18px, 4vw, 22px)', 
            color: '#6b7280', 
            maxWidth: '800px', 
            margin: '0 auto', 
            lineHeight: '1.5',
            padding: '0 20px'
          }}>
            We are building bigger ideas together with leaders across varied domains
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        {displayStudies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ width: '100px', height: '100px', backgroundColor: '#f3f4f6', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Sparkles size={50} style={{ color: '#9ca3af' }} />
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>No Case Studies Yet</h3>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>Check back soon for our success stories.</p>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
              gap: '35px',
              marginBottom: '60px'
            }}>
              {displayStudies.slice(0, 3).map((study, idx) => (
                <CaseStudyCard key={study.id} study={study} index={idx} />
              ))}
            </div>

            {displayStudies.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link 
                  to="/case-studies" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    backgroundColor: '#4f46e5', 
                    color: 'white', 
                    padding: '16px 48px', 
                    borderRadius: '12px', 
                    fontWeight: '600', 
                    fontSize: '16px',
                    textDecoration: 'none', 
                    transition: 'all 0.3s ease' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338ca';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4f46e5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View All Case Studies 
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CaseStudiesSection;