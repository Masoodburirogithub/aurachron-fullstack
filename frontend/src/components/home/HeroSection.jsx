// src/components/home/HeroSection.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Clock, Award, Sparkles } from 'lucide-react';
import background from '../../../src/assets/main-background.mp4';

const HeroSection = () => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      videoRef.current.playbackRate = 0.8;
      videoRef.current.play().catch(() => setVideoError(true));
    }
  }, [videoError]);

  const stats = [
    { icon: TrendingUp, value: '50+', label: 'Projects Delivered', delay: 0.1 },
    { icon: Clock, value: '<2 weeks', label: 'Avg. MVP to Live', delay: 0.2 },
    { icon: Award, value: '100%', label: 'Client Satisfaction', delay: 0.3 }
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ left: '10%', top: '20%' }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-reverse"
          style={{ right: '10%', bottom: '20%' }}
        />
        <div 
          className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* Video Background */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
          poster="https://images.unsplash.com/photo-1551434678-e076c2235d7d?w=1920"
          onError={() => setVideoError(true)}
        >
          <source src={background} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 z-0" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.03%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 z-0" />

      <div className="relative z-10 h-full flex items-center min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl ml-0"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20 hover:border-indigo-400 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-white/90 text-sm">Aurachron Systems Leading AI-Augmented Engineering Firm • 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-left"
            >
              Ship Production-Ready Systems at{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                AI Speed
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed text-left"
            >
              We combine deep systems engineering with AI-native delivery to build scalable, 
              secure applications in half the time. Zero technical debt. Full IP ownership.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-start"
            >
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2 group text-lg"
              >
                Launch Your Project 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 hover:border-indigo-400 transition-all duration-300 group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                Watch Demo
              </button>
            </motion.div>
            
            <div className="flex flex-wrap gap-5 justify-start">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:border-indigo-400 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse-glow">
                    <stat.icon className="text-indigo-400" size={18} />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/60 text-xs md:text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        whileHover={{ scale: 1.2 }}
      >
        {/* <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-blink" />
        </div> */}
      </motion.div>
    </section>
  );
};

export default HeroSection;