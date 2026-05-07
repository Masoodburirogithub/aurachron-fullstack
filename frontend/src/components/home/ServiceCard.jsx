// src/components/home/ServiceCard.jsx - Dynamic with Original Effects
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';

const ServiceCard = ({ service, index, isActive = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Dynamically get the icon component based on the icon name from database
  const IconComponent = Icons[service.icon] || Icons.Brain;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotateY: isActive ? 0 : (isHovered ? 5 : 0),
        rotateX: isActive ? 0 : (isHovered ? 5 : 0),
        scale: isActive ? 1 : (isHovered ? 1.02 : 1),
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative cursor-pointer transition-all duration-500 mx-auto ${
        isActive 
          ? 'z-20 w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px] xl:w-[600px]' 
          : 'z-0 w-[220px] sm:w-[280px] md:w-[350px] lg:w-[420px]'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* ==================== ACTIVE CARD - X SHAPE CORNER TO CORNER FLASH ==================== */}
      {isActive && (
        <>
          {/* 3D Shadow Effect - Bottom shadow for depth */}
          <div className="absolute -bottom-8 left-4 right-4 h-12 bg-black/40 blur-2xl rounded-full z-0" />
          
          {/* Outer Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 blur-xl rounded-none animate-pulse-slow z-0" />
          
          {/* Inner Glow Border */}
          <div className="absolute inset-0 shadow-2xl pointer-events-none z-10" style={{ 
            boxShadow: 'inset 0 0 30px rgba(6,182,212,0.3), 0 0 0 2px rgba(6,182,212,0.2)' 
          }} />
          
          {/* X MOVEMENT 1: Top-Left to Bottom-Right (Cyan Flash) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500 via-cyan-400/80 to-transparent animate-flash-tl-br" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* X MOVEMENT 2: Top-Right to Bottom-Left (Purple Flash) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-purple-500 via-purple-400/80 to-transparent animate-flash-tr-bl" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* X MOVEMENT 3: Bottom-Left to Top-Right (Pink Flash) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-pink-500 via-pink-400/80 to-transparent animate-flash-bl-tr" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* X MOVEMENT 4: Bottom-Right to Top-Left (Indigo Flash) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-indigo-500 via-indigo-400/80 to-transparent animate-flash-br-tl" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* X Shape Center Burst - Flash at crossing point */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div className="absolute top-1/2 left-1/2 w-0 h-0 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 via-white to-purple-400 rounded-full animate-center-burst" />
          </div>
          
          {/* Glowing X Shape Lines Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-0 h-full bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 animate-x-line-1" style={{ transform: 'translateX(-50%) rotate(45deg)', transformOrigin: 'center' }} />
              <div className="absolute top-0 left-0 w-0 h-full bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 animate-x-line-2" style={{ transform: 'translateX(-50%) rotate(-45deg)', transformOrigin: 'center' }} />
            </div>
          </div>
          
          {/* Continuous Pulse Glow on Active Card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 animate-pulse-glow pointer-events-none z-10" />
          
          {/* Rotating Rainbow Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-indigo-500/10 via-purple-500/10 to-pink-500/5 animate-rotate-gradient pointer-events-none z-10" style={{ backgroundSize: '200% 200%' }} />
        </>
      )}
      
      {/* Card Body */}
      <motion.div 
        className={`relative overflow-hidden transition-all duration-500 ${
          isActive 
            ? 'bg-white dark:bg-gray-800 shadow-2xl' 
            : 'bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700'
        }`}
        style={{ 
          borderRadius: 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          boxShadow: isActive 
            ? '0 30px 60px -15px rgba(0,0,0,0.3), 0 0 0 2px rgba(6,182,212,0.3)'
            : '0 10px 15px -3px rgba(0,0,0,0.1)',
        }}
      >
        {/* Top Gradient Bar - Glowing with service gradient */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.gradient} transform origin-left transition-transform duration-500 ${
          (isHovered || isActive) ? 'scale-x-100' : 'scale-x-0'
        }`} 
        style={{
          transformOrigin: 'left',
          boxShadow: isActive ? '0 0 15px rgba(6,182,212,0.8)' : 'none',
        }} />
        
        {/* Content */}
        <div className={`relative z-30 transition-all duration-500 ${
          isActive ? 'p-4 sm:p-6 md:p-8 lg:p-10' : 'p-4 sm:p-5 md:p-6'
        }`}>
          {/* Icon with Glow - Dynamically loaded */}
          <motion.div 
            className={`mb-3 md:mb-5 transition-all duration-300 ${(isHovered || isActive) ? 'scale-110' : ''}`}
            animate={{
              rotateY: isActive ? 0 : (isHovered ? 10 : 0),
            }}
            transition={{ duration: 0.3 }}
          >
            <div className={`bg-gradient-to-r ${service.gradient} p-0.5 ${
              isActive 
                ? 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24' 
                : 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14'
            }`} style={{ borderRadius: 0 }}>
              <div className="w-full h-full bg-white dark:bg-gray-800 flex items-center justify-center" style={{ borderRadius: 0 }}>
                <IconComponent className={`${
                  isActive 
                    ? 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12' 
                    : 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7'
                } text-${service.color || 'indigo'}-600`} />
              </div>
            </div>
          </motion.div>
          
          {/* Title */}
          <h3 className={`font-bold mb-2 md:mb-3 transition-all duration-300 ${
            isActive 
              ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-white' 
              : 'text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200'
          }`}
          style={{
            textShadow: isActive ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
          }}>
            {service.title}
          </h3>
          
          {/* Description */}
          <p className={`mb-3 md:mb-5 leading-relaxed transition-all duration-300 ${
            isActive 
              ? 'text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300' 
              : 'text-xs sm:text-sm text-gray-500 dark:text-gray-400'
          }`}>
            {service.description}
          </p>
          
          {/* Features */}
          <div className={`space-y-1.5 md:space-y-2 mb-4 md:mb-6 transition-all duration-300 ${isActive ? 'mb-6 md:mb-8' : ''}`}>
            {service.features?.slice(0, 3).map((feature, i) => (
              <motion.div 
                key={i} 
                className={`flex items-center gap-1.5 md:gap-2 ${
                  isActive 
                    ? 'text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300' 
                    : 'text-[10px] sm:text-xs text-gray-500 dark:text-gray-400'
                }`}
                animate={{
                  x: isActive ? 0 : (isHovered ? 3 : 0),
                }}
                transition={{ delay: i * 0.05 }}
              >
                <CheckCircle className={`${isActive ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'} text-indigo-500 flex-shrink-0`} />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Learn More Button */}
          <motion.div
            whileHover={{ x: 8, scale: 1.02 }}
            className="inline-flex items-center gap-1.5 md:gap-2 text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            <Link to={`/services/${service.id}`} className={`inline-flex items-center gap-1.5 md:gap-2 ${isActive ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
              Learn More <ArrowRight className={`${isActive ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'} transition-transform`} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Attractive Floating Sparkle */}
      {isActive && (
        <motion.div 
          className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-40"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-lg rounded-full opacity-70 animate-pulse" />
            <div className="absolute inset-0 bg-purple-400 blur-md rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400 relative z-10" />
          </div>
        </motion.div>
      )}

      <style>{`
        /* X SHAPE - CORNER TO OPPOSITE CORNER FLASH ANIMATIONS */
        
        /* Line 1: Top-Left to Bottom-Right (Diagonal \\ direction) */
        @keyframes flash-tl-br {
          0% { 
            transform: translate(-100%, -100%);
            opacity: 0;
          }
          12% { 
            opacity: 1;
          }
          20% { 
            opacity: 0.9;
          }
          30% { 
            opacity: 0;
          }
          100% { 
            transform: translate(100%, 100%);
            opacity: 0;
          }
        }
        
        /* Line 2: Top-Right to Bottom-Left (Diagonal / direction) */
        @keyframes flash-tr-bl {
          0% { 
            transform: translate(100%, -100%);
            opacity: 0;
          }
          12% { 
            opacity: 0.95;
          }
          20% { 
            opacity: 0.85;
          }
          30% { 
            opacity: 0;
          }
          100% { 
            transform: translate(-100%, 100%);
            opacity: 0;
          }
        }
        
        /* Line 3: Bottom-Left to Top-Right (Diagonal / direction reverse) */
        @keyframes flash-bl-tr {
          0% { 
            transform: translate(-100%, 100%);
            opacity: 0;
          }
          15% { 
            opacity: 0.9;
          }
          25% { 
            opacity: 0.8;
          }
          35% { 
            opacity: 0;
          }
          100% { 
            transform: translate(100%, -100%);
            opacity: 0;
          }
        }
        
        /* Line 4: Bottom-Right to Top-Left (Diagonal \\ direction reverse) */
        @keyframes flash-br-tl {
          0% { 
            transform: translate(100%, 100%);
            opacity: 0;
          }
          15% { 
            opacity: 0.85;
          }
          25% { 
            opacity: 0.75;
          }
          35% { 
            opacity: 0;
          }
          100% { 
            transform: translate(-100%, -100%);
            opacity: 0;
          }
        }
        
        /* Center Burst - Flash at X crossing point */
        @keyframes center-burst {
          0% { 
            width: 0; 
            height: 0; 
            opacity: 0;
          }
          10% { 
            width: 120px; 
            height: 120px; 
            opacity: 0.9;
          }
          20% { 
            width: 250px; 
            height: 250px; 
            opacity: 0.5;
          }
          35% { 
            width: 400px; 
            height: 400px; 
            opacity: 0;
          }
          100% { 
            width: 400px; 
            height: 400px; 
            opacity: 0;
          }
        }
        
        /* Glowing X Shape Lines */
        @keyframes x-line-1 {
          0% { 
            width: 0%;
            opacity: 0;
          }
          25% { 
            width: 150%;
            opacity: 0.6;
          }
          50% { 
            width: 150%;
            opacity: 0.3;
          }
          75% { 
            width: 0%;
            opacity: 0;
          }
          100% { 
            width: 0%;
            opacity: 0;
          }
        }
        
        @keyframes x-line-2 {
          0% { 
            width: 0%;
            opacity: 0;
          }
          25% { 
            width: 0%;
            opacity: 0;
          }
          50% { 
            width: 150%;
            opacity: 0.6;
          }
          75% { 
            width: 150%;
            opacity: 0.3;
          }
          100% { 
            width: 0%;
            opacity: 0;
          }
        }
        
        /* Pulse Glow */
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        
        /* Rotating Gradient */
        @keyframes rotate-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Slow Pulse for Outer Glow */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        /* Animation Classes */
        .animate-flash-tl-br { animation: flash-tl-br 2.8s ease-in-out infinite; }
        .animate-flash-tr-bl { animation: flash-tr-bl 3.2s ease-in-out infinite; }
        .animate-flash-bl-tr { animation: flash-bl-tr 3.6s ease-in-out infinite; }
        .animate-flash-br-tl { animation: flash-br-tl 4s ease-in-out infinite; }
        .animate-center-burst { animation: center-burst 3.5s ease-in-out infinite; }
        .animate-x-line-1 { animation: x-line-1 4s ease-in-out infinite; }
        .animate-x-line-2 { animation: x-line-2 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-rotate-gradient { animation: rotate-gradient 5s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; }
        
        /* Mobile Optimizations */
        @media (max-width: 640px) {
          .animate-flash-tl-br { animation-duration: 2.2s; }
          .animate-flash-tr-bl { animation-duration: 2.5s; }
          .animate-flash-bl-tr { animation-duration: 2.8s; }
          .animate-flash-br-tl { animation-duration: 3s; }
          .animate-center-burst { animation-duration: 2.8s; }
          @keyframes center-burst {
            0% { width: 0; height: 0; opacity: 0; }
            10% { width: 80px; height: 80px; opacity: 0.9; }
            20% { width: 150px; height: 150px; opacity: 0.5; }
            35% { width: 250px; height: 250px; opacity: 0; }
            100% { width: 250px; height: 250px; opacity: 0; }
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ServiceCard;