// src/pages/CaseStudiesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
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
      // console.log('Case Studies Page Data:', response.data);
      
      let data = [];
      if (response.data?.success) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      
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
      <div className="pt-20 min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm sm:text-base">Loading case studies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex justify-center items-center px-4">
        <div className="text-center bg-white p-6 sm:p-10 rounded-2xl shadow-lg max-w-md w-full">
          <p className="text-gray-500 text-sm sm:text-base mb-4">{error}</p>
          <button 
            onClick={fetchCaseStudies}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-0 md:pt-20">
      {/* Hero Section - Responsive */}
      <div className="bg-gradient-to-r from-[#F59E0B]/90 to-[#FBBF24]/70 py-12 sm:py-16 md:py-20 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4"
          >
            Our Success Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto"
          >
            Real results from real partnerships
          </motion.p>
        </div>
      </div>

      {/* Case Studies List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {caseStudies.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Case Studies Yet</h3>
            <p className="text-gray-500 text-sm sm:text-base">Check back soon for our success stories.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Responsive Grid - Stack on mobile, side by side on desktop */}
                <div className="flex flex-col lg:flex-row">
                  {/* Image Column - Full width on mobile, half on desktop */}
                  <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-auto overflow-hidden bg-gray-100">
                    {study.imageUrl ? (
                      <img 
                        src={getImageUrl(study.imageUrl)}
                        alt={study.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/800x600/e2e8f0/64748b?text=Image+Not+Found';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                        <ImageIcon size={48} className="text-indigo-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content Column - Full width on mobile, half on desktop */}
                  <div className="w-full lg:w-1/2 p-5 sm:p-6 md:p-8">
                    <div className="mb-3 sm:mb-4">
                      <span className="text-xs sm:text-sm font-semibold text-[#F59E0B] uppercase tracking-wide">
                        {study.industry}
                      </span>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                      {study.title}
                    </h2>
                    
                    {/* Challenge */}
                    <div className="mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Challenge
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{study.challenge}</p>
                    </div>
                    
                    {/* Solution */}
                    <div className="mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Solution
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{study.solution}</p>
                    </div>
                    
                    {/* Result */}
                    <div className="mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        Result
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{study.result}</p>
                    </div>
                    
                    {/* Footer Stats */}
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
                      <span className="text-xl sm:text-2xl font-bold text-[#F59E0B]">
                        {study.result?.match(/\d+%/)?.[0] || 'Success'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Tech: {study.technology}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button - Responsive */}
      <div className="text-center pb-8 sm:pb-12 md:pb-16 px-4">
        <button 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default CaseStudiesPage;