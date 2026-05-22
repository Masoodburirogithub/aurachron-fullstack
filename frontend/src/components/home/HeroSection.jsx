// src/components/home/HeroSection.jsx - Clean Simple Version
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Clock, Award, Sparkles } from 'lucide-react';
import { heroAPI } from '../../services/api';

// ✅ Use env var with localhost fallback for dev
const MEDIA_BASE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000';

const HeroSection = () => {
  const videoRef = useRef(null);
  const [heroSettings, setHeroSettings] = useState({
    title: "Ship Production-Ready Systems at AI Speed",
    subtitle: "We combine deep systems engineering with AI-native delivery to build scalable, secure applications in half the time. Zero technical debt. Full IP ownership.",
    badgeText: "Aurachron Systems Leading AI-Augmented Engineering Firm • 2026",
    buttonText: "Launch Your Project",
    buttonLink: "/contact",
    demoButtonText: "Watch Demo",
    videoUrl: "",
    stats: [
      { value: "50+", label: "Projects Delivered", icon: "TrendingUp" },
      { value: "<2 weeks", label: "Avg. MVP to Live", icon: "Clock" },
      { value: "100%", label: "Client Satisfaction", icon: "Award" }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      setLoading(true);
      const response = await heroAPI.getSettings();
      if (response.data?.success && response.data.data) {
        setHeroSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper to build a fully-qualified media URL from any input
  const buildMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${MEDIA_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    if (!heroSettings.videoUrl || videoError) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const videoUrl = buildMediaUrl(heroSettings.videoUrl);

    videoElement.src = videoUrl;
    videoElement.load();

    videoElement.play().catch((err) => {
      console.error('Video play failed:', err);
      setVideoError(true);
    });
  }, [heroSettings.videoUrl, videoError]);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'Clock': return Clock;
      case 'Award': return Award;
      default: return TrendingUp;
    }
  };

  if (loading) {
    return null;
  }

  const hasVideo = heroSettings.videoUrl && !videoError;
  const videoSource = buildMediaUrl(heroSettings.videoUrl);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      {hasVideo && videoSource ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1551434678-e076c2235d7d?w=1920"
          onError={() => setVideoError(true)}
        >
          <source src={videoSource} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-0" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ left: '10%', top: '20%' }} />
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-reverse" style={{ right: '10%', bottom: '20%' }} />
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Content */}
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
              <span className="text-white/90 text-sm">{heroSettings.badgeText}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-left"
            >
              {heroSettings.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed text-left"
            >
              {heroSettings.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-start"
            >
              <Link
                to={heroSettings.buttonLink || "/contact"}
                className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center gap-2 group text-lg"
              >
                {heroSettings.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 hover:border-indigo-400 transition-all duration-300 group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {heroSettings.demoButtonText}
              </button>
            </motion.div>

            <div className="flex flex-wrap gap-5 justify-start">
              {heroSettings.stats?.map((stat, idx) => {
                const IconComponent = getIconComponent(stat.icon);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:border-indigo-400 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse-glow">
                      <IconComponent className="text-indigo-400" size={18} />
                    </div>
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-white/60 text-xs md:text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;