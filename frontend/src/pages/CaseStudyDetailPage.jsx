// src/pages/CaseStudyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ArrowRight, Calendar, User, Tag, ExternalLink, Sparkles, Loader } from 'lucide-react';
import { caseStudiesAPI, getImageUrl } from '../services/api';

const CaseStudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCaseStudyDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchCaseStudyDetail = async () => {
    try {
      setLoading(true);
      const response = await caseStudiesAPI.getById(id);
      // console.log('Case study detail:', response.data);
      
      if (response.data?.success) {
        setCaseStudy(response.data.data);
      } else if (response.data?.data) {
        setCaseStudy(response.data.data);
      } else {
        setError('Case study not found');
      }
    } catch (err) {
      console.error('Error fetching case study:', err);
      setError('Failed to load case study details');
    } finally {
      setLoading(false);
    }
  };

  // Extract metrics from result text
  const extractMetrics = (result) => {
    const metrics = [];
    const percentageMatch = result?.match(/\d+%/g);
    const timeMatch = result?.match(/\d+\s*(?:hours?|minutes?|days?|weeks?)/gi);
    const numberMatch = result?.match(/\d+\s*(?:sites?|platforms?|clients?|users?)/gi);
    
    if (percentageMatch) {
      metrics.push({ value: percentageMatch[0], label: 'Improvement', color: 'green' });
    }
    if (timeMatch) {
      metrics.push({ value: timeMatch[0], label: 'Time Saved', color: 'blue' });
    }
    if (numberMatch && metrics.length < 3) {
      metrics.push({ value: numberMatch[0], label: 'Impact', color: 'purple' });
    }
    return metrics;
  };

  // Extract tags from technology
  const tags = caseStudy?.technology?.split(',').map(t => t.trim()) || [];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading case study...</p>
        </div>
      </div>
    );
  }



  const metrics = extractMetrics(caseStudy.result);
  const imageUrl = getImageUrl(caseStudy.imageUrl);

  return (
    <div className="pt-0 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -right-48 animate-float" />
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -left-48 animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="container-custom relative z-10 py-16">
          <button 
            onClick={() => navigate('/case-studies')} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            Back to Case Studies
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                {caseStudy.industry}
              </span>
              {tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              {caseStudy.title}
            </h1>
            {caseStudy.subtitle && (
              <p className="text-lg md:text-xl text-white/90 max-w-3xl">
                {caseStudy.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {imageUrl && (
        <div className="container-custom -mt-16 relative z-20">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={imageUrl} 
              alt={caseStudy.title} 
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Challenge Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">The Challenge</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
                  {caseStudy.challenge}
                </p>
              </motion.div>

              {/* Solution Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Solution</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
                  {caseStudy.solution}
                </p>
              </motion.div>

              {/* Result Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">The Result</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg mb-6">
                  {caseStudy.result}
                </p>
                
                {/* Metrics Grid */}
                {metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    {metrics.map((metric, idx) => (
                      <div key={idx} className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl">
                        <div className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                          {metric.value}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 space-y-6"
              >
                {/* Quick Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500">Industry</span>
                      <span className="font-semibold">{caseStudy.industry}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500">Technologies</span>
                      <span className="font-semibold text-sm text-right">{caseStudy.technology}</span>
                    </div>
                    {caseStudy.result?.match(/\d+%/g) && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500">Improvement</span>
                        <span className="font-bold text-green-600">{caseStudy.result.match(/\d+%/g)[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technologies Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">Ready to Achieve Similar Results?</h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Let's discuss how we can help your business achieve similar success.
                  </p>
                  <Link 
                    to="/contact"
                    className="block w-full bg-white text-indigo-600 px-4 py-3 rounded-xl font-semibold text-center hover:shadow-lg transition-all hover:-translate-y-0.5 group"
                  >
                    Start Your Project 
                    <ArrowRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <Link 
                    to="/case-studies" 
                    className="flex items-center justify-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                  >
                    View All Case Studies <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetailPage;