// src/components/home/ServicesSection.jsx - With Dynamic Header
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { servicesAPI, pageSettingsAPI } from '../../services/api';
import ServiceCard from './ServiceCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageSettings, setPageSettings] = useState({
    title: 'Services We Offer',
    subtitle: 'Explore our full range of AI-augmented services designed to accelerate your digital transformation',
    badgeText: 'What We Do'
  });
  const swiperRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchPageSettings();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      
      if (response.data?.success) {
        setServices(response.data.data);
      } else if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageSettings = async () => {
    try {
      const response = await pageSettingsAPI.getSettings('home', 'services');
      if (response.data?.success && response.data.data) {
        setPageSettings({
          title: response.data.data.title || 'Services We Offer',
          subtitle: response.data.data.subtitle || 'Explore our full range of AI-augmented services designed to accelerate your digital transformation',
          badgeText: response.data.data.metadata?.badgeText || 'What We Do'
        });
      }
    } catch (error) {
      console.error('Error fetching page settings:', error);
    }
  };

  const displayServices = services.filter(s => s.isActive !== false);

  if (loading) {
     return null;
  }

  return (
    <div ref={ref} className="py-8 md:py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <div className="container-custom relative z-10">
        {/* HEADER SECTION - Matching CaseStudiesSection text sizes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-6 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full px-3 md:px-6 py-1.5 md:py-2 mb-4 md:mb-4">
            <Sparkles size={16} className="md:w-[18px] md:h-[18px] text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm md:text-base font-normal text-indigo-600 dark:text-indigo-400">{pageSettings.badgeText}</span>
          </div>
          
          <h2 className="text-[clamp(36px,6vw,52px)] md:text-[clamp(36px,6vw,52px)] lg:text-[52px] font-bold text-gray-900 dark:text-white mb-4 md:mb-5 leading-tight">
  <span className="text-[#F59E0B]/80 dark:text-[#F59E0B]">{pageSettings.title}</span>
</h2>
          
          <p className="text-[clamp(16px,4vw,18px)] md:text-[clamp(18px,4vw,22px)] lg:text-[22px] text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
            {pageSettings.subtitle}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative px-2 md:px-4 lg:px-16 py-4 md:py-12">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            navigation={false}
            autoplay={{ 
              delay: 4000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
              waitForTransition: true,
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
            {displayServices.map((service, idx) => (
              <SwiperSlide key={service.id || idx}>
                <div className={`flex justify-center transition-all duration-700 ease-out ${
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
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-110 transition-all duration-300 items-center justify-center cursor-pointer group"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 md:gap-3 mt-4 md:mt-8">
          {displayServices.map((_, idx) => (
            <button
              key={idx}
              onClick={() => swiperRef.current?.slideTo(idx)}
              className={`h-1 md:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx 
                  ? 'w-6 md:w-12 bg-gradient-to-r from-indigo-600 to-purple-600' 
                  : 'w-3 md:w-6 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .centered-slider {
          padding: 20px 0 20px 0;
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
          borderRadius: 8px !important;
        }
        @media (min-width: 768px) {
          .centered-slider { padding: 40px 0 60px 0; }
          .swiper-pagination-bullet-active { width: 28px !important; }
        }
        @media (min-width: 1024px) {
          .swiper-pagination-bullet-active { width: 32px !important; }
        }
        .scale-85 {
          transform: scale(0.85);
        }
        .scale-90 {
          transform: scale(0.9);
        }
        @media (max-width: 768px) {
          .scale-90 {
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesSection;