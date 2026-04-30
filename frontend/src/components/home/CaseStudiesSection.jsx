// src/components/home/CaseStudiesSection.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, TrendingUp, Award, Users, Sparkles } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

const caseStudies = [
  {
    id: 1,
    title: "Gulf Oil — Eliminated 85% of Safety Incident Reporting Time",
    industry: "Oil & Gas",
    metric: "85% Reduction",
    result: "4 hours → 30 minutes",
    description: "AI-powered safety reporting system across 500+ sites",
    tags: ["AI Agents", "RAG Pipeline"],
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
    stats: [
      { value: "500+", label: "Sites Connected" },
      { value: "85%", label: "Time Reduction" },
      { value: "100%", label: "Compliance" }
    ]
  },
  {
    id: 2,
    title: "Real Estate AI — From Minutes to Seconds",
    industry: "PropTech",
    metric: "70% Faster",
    result: "45 minutes → 15 seconds",
    description: "LLM-powered proposal generation system",
    tags: ["LLM Integration", "RAG"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    stats: [
      { value: "70%", label: "Faster Proposals" },
      { value: "90%", label: "Satisfaction" },
      { value: "50+", label: "Proposals/Week" }
    ]
  },
  {
    id: 3,
    title: "Agentic Automation — 150+ Platform Integration",
    industry: "Automation",
    metric: "150+ Platforms",
    result: "95% Bug Reduction",
    description: "Unified agentic automation SDK",
    tags: ["Automation SDK", "Agentic AI"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    stats: [
      { value: "150+", label: "Platforms Connected" },
      { value: "95%", label: "Bug Reduction" },
      { value: "50+", label: "Enterprise Clients" }
    ]
  }
];

const CaseStudyCard = ({ study, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 mx-2"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={study.image} alt={study.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          {study.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full animate-pulse-glow">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-2">{study.industry}</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {study.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{study.description}</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          {study.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <Link 
          to={`/case-studies/${study.id}`} 
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:gap-3 transition-all"
        >
          Read Full Story <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

const CaseStudiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950 rounded-full px-4 py-1 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-600 text-sm font-medium">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Our Prime <span className="gradient-text">Projects & Case Studies</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We are building bigger ideas together with leaders across varied domains
            </p>
          </motion.div>
        </div>

        {/* Desktop Grid View (no slider issues) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <CaseStudyCard key={idx} study={study} index={idx} />
          ))}
        </div>

        {/* Mobile/Tablet Swiper View with proper spacing */}
        <div className="lg:hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
            }}
            className="pb-12 px-1"
          >
            {caseStudies.map((study, idx) => (
              <SwiperSlide key={idx}>
                <CaseStudyCard study={study} index={idx} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;