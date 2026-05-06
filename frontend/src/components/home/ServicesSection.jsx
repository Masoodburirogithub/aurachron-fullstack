// src/components/home/ServicesSection.jsx - Fixed auto slider
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Brain, Cloud, Smartphone, RefreshCw, Shield, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const services = [
  { id: 'ai-development', icon: Brain, title: 'AI Development & Agents', description: 'Custom AI agents, LLM integrations, RAG pipelines', features: ['Agentic AI Solutions', 'LLM Integration & RAG', 'AI Enablement Consulting', 'Intelligent Document Processing'], gradient: 'from-blue-500 to-indigo-500' },
  { id: 'saas', icon: Cloud, title: 'Enterprise SaaS', description: 'Multi-tenant architecture, subscription management', features: ['Multi-tenant Architecture', 'Subscription Management', 'SOC2 Ready', 'Scalable Infrastructure'], gradient: 'from-cyan-500 to-blue-500' },
  { id: 'web-mobile', icon: Smartphone, title: 'Web & Mobile Apps', description: 'Modern applications with Next.js 15, Flutter', features: ['Cross-Platform', 'Offline-First', 'Biometric Auth', 'Real-time Sync'], gradient: 'from-green-500 to-teal-500' },
  { id: 'legacy', icon: RefreshCw, title: 'Legacy Modernization', description: 'Zero downtime, side-by-side migration', features: ['Zero Downtime', 'Modern Stack', 'Cloud Native', 'API First'], gradient: 'from-orange-500 to-red-500' },
  { id: 'security', icon: Shield, title: 'Cybersecurity', description: 'PDPA/GDPR readiness, monthly pentests', features: ['GDPR Compliant', 'Monthly Pentests', '24/7 Monitoring', 'Incident Response'], gradient: 'from-purple-500 to-pink-500' },
  { id: 'ai-consulting', icon: TrendingUp, title: 'AI Consulting', description: 'Strategy + rapid prototyping', features: ['AI Strategy', 'Rapid Prototyping', 'Workflow Automation', 'ROI Analysis'], gradient: 'from-yellow-500 to-orange-500' },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section ref={ref} className="min-h-screen py-12 md:py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full px-3 md:px-4 py-1 mb-4">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="text-xs md:text-sm text-indigo-600 dark:text-indigo-400 font-medium">What We Do</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Services <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">We Offer</span>
            </h2>
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Explore our full range of AI-augmented services designed to accelerate your digital transformation
            </p>
          </motion.div>
        </div>

        {/* Centered Carousel - Auto Slider Working */}
        <div className="relative px-2 md:px-4 lg:px-16 py-8 md:py-12">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            navigation={false}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
              waitForTransition: false,
            }}
            loop={true}
            speed={800}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="centered-slider"
            breakpoints={{
              480: { slidesPerView: 1, spaceBetween: 15, centeredSlides: true },
              640: { slidesPerView: 1.2, spaceBetween: 20, centeredSlides: true },
              768: { slidesPerView: 1.5, spaceBetween: 25, centeredSlides: true },
              1024: { slidesPerView: 2, spaceBetween: 30, centeredSlides: true },
              1280: { slidesPerView: 2.3, spaceBetween: 35, centeredSlides: true },
              1536: { slidesPerView: 2.5, spaceBetween: 40, centeredSlides: true },
            }}
          >
            {services.map((service, idx) => (
              <SwiperSlide key={idx}>
                <div className={`flex justify-center transition-all duration-500 ${
                  activeIndex === idx 
                    ? 'scale-100 opacity-100' 
                    : 'scale-90 md:scale-85 opacity-50'
                }`}>
                  <ServiceCard 
                    service={service} 
                    index={idx} 
                    isActive={activeIndex === idx}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-110 transition-all duration-300 items-center justify-center cursor-pointer group"
          >
            <ChevronLeft size={20} className="md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-110 transition-all duration-300 items-center justify-center cursor-pointer group"
          >
            <ChevronRight size={20} className="md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => swiperRef.current?.slideTo(idx)}
              className={`h-1 md:h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                activeIndex === idx 
                  ? 'w-6 md:w-12 bg-gradient-to-r from-indigo-600 to-purple-600' 
                  : 'w-3 md:w-6 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      <style >{`
        .centered-slider {
          padding: 20px 0 40px 0;
          overflow: visible !important;
        }
        .centered-slider .swiper-slide {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow: visible !important;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .centered-slider .swiper-slide-active {
          z-index: 20;
        }
        .swiper-pagination {
          position: relative !important;
          margin-top: 10px;
        }
        .swiper-pagination-bullet {
          background: #cbd5e1 !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
        }
        .dark .swiper-pagination-bullet {
          background: #475569 !important;
        }
        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #6366f1, #a855f7) !important;
          opacity: 1 !important;
          width: 20px !important;
          border-radius: 8px !important;
        }
        @media (min-width: 768px) {
          .centered-slider { padding: 40px 0 60px 0; }
          .swiper-pagination-bullet-active { width: 28px !important; }
        }
        @media (min-width: 1024px) {
          .swiper-pagination-bullet-active { width: 32px !important; }
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;