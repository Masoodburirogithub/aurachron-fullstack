// src/components/home/ServicesSection.jsx
import React, { useRef, useState } from 'react';
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

  return (
    <section ref={ref} className="min-h-screen py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full px-4 py-1 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">What We Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Services <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">We Offer</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore our full range of AI-augmented services designed to accelerate your digital transformation
            </p>
          </motion.div>
        </div>

        {/* Centered Carousel - Active Card Larger */}
        <div className="relative px-4 md:px-8 lg:px-16 py-12">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: true }}
            navigation={false}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false
            }}
            loop={true}
            speed={600}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="centered-slider"
            breakpoints={{
              640: {
                slidesPerView: 1.2,
                spaceBetween: 20,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 1.5,
                spaceBetween: 25,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: true,
              },
              1280: {
                slidesPerView: 2.3,
                spaceBetween: 35,
                centeredSlides: true,
              },
              1536: {
                slidesPerView: 2.5,
                spaceBetween: 40,
                centeredSlides: true,
              },
            }}
          >
            {services.map((service, idx) => (
              <SwiperSlide key={idx}>
                <div className={`flex justify-center transition-all duration-500 ${
                  activeIndex === idx 
                    ? 'scale-100 opacity-100' 
                    : 'scale-85 opacity-40'
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

          {/* Custom Navigation Buttons */}
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
          >
            <ChevronLeft size={24} className="md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
          >
            <ChevronRight size={24} className="md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => swiperRef.current?.slideTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                activeIndex === idx 
                  ? 'w-12 bg-gradient-to-r from-indigo-600 to-purple-600' 
                  : 'w-6 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .centered-slider {
          padding: 40px 0 80px 0;
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
        .centered-slider .swiper-slide-prev,
        .centered-slider .swiper-slide-next {
          z-index: 10;
        }
        .swiper-pagination {
          position: relative !important;
          margin-top: 20px;
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
          width: 32px !important;
          border-radius: 8px !important;
        }
        .scale-85 {
          transform: scale(0.85);
        }
        @media (max-width: 768px) {
          .scale-85 {
            transform: scale(0.9);
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;