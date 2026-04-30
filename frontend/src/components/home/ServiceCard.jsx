// src/components/home/ServiceCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const ServiceCard = ({ service, index, isActive = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer transition-all duration-500 ${
        isActive 
          ? 'z-20 w-[500px] md:w-[550px] lg:w-[600px]' 
          : 'z-0 w-[350px] md:w-[380px] lg:w-[420px]'
      } mx-auto`}
    >
      {/* Active Card - Flash Light Shining Effect */}
      {isActive && (
        <>
          {/* Pulsing Glow Layers */}
          <div className="absolute -inset-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70 animate-pulse-slow" style={{ filter: 'blur(40px)' }} />
          <div className="absolute -inset-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-50 animate-pulse-medium" style={{ filter: 'blur(30px)' }} />
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-30 animate-pulse-fast" style={{ filter: 'blur(20px)' }} />
          
          {/* Flash Light Effect 1 - Left to Right */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-flash-left-right" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* Flash Light Effect 2 - Right to Left */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-flash-right-left" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* Flash Light Effect 3 - Top to Bottom */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-flash-top-bottom" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* Flash Light Effect 4 - Bottom to Top */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-flash-bottom-top" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* Diagonal Flash Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent animate-flash-diagonal-tl-br" style={{ width: '100%', height: '100%' }} />
          </div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-transparent via-white to-transparent animate-flash-diagonal-tr-bl" style={{ width: '100%', height: '100%' }} />
          </div>
          
          {/* Strobe Light Effect */}
          <div className="absolute inset-0 bg-white animate-strobe" style={{ mixBlendMode: 'overlay' }} />
          
          {/* Corner Flash Sparks */}
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full animate-corner-flash" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-corner-flash" style={{ animationDelay: '0.3s' }} />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rounded-full animate-corner-flash" style={{ animationDelay: '0.6s' }} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full animate-corner-flash" style={{ animationDelay: '0.9s' }} />
        </>
      )}
      
      {/* Card Body - No Border Radius */}
      <div 
        className={`relative overflow-hidden transition-all duration-500 ${
          isActive 
            ? 'bg-white dark:bg-gray-800 shadow-2xl border-0' 
            : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700'
        }`}
        style={{ borderRadius: 0 }}
      >
        {/* Top Gradient Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.gradient} transform origin-left transition-transform duration-500 ${
          (isHovered || isActive) ? 'scale-x-100' : 'scale-x-0'
        }`} />
        
        {/* Content */}
        <div className={`relative z-10 transition-all duration-500 ${
          isActive ? 'p-8 md:p-10' : 'p-6'
        }`}>
          {/* Icon */}
          <div className={`mb-5 transition-all duration-300 ${(isHovered || isActive) ? 'scale-110' : ''}`}>
            <div className={`bg-gradient-to-r ${service.gradient} p-0.5 ${
              isActive 
                ? 'w-20 h-20 md:w-24 md:h-24 shadow-lg shadow-indigo-500/30' 
                : 'w-14 h-14'
            }`} style={{ borderRadius: 0 }}>
              <div className="w-full h-full bg-white dark:bg-gray-800 flex items-center justify-center" style={{ borderRadius: 0 }}>
                <service.icon className={`${isActive ? 'w-10 h-10 md:w-12 md:h-12' : 'w-7 h-7'} text-indigo-600`} />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h3 className={`font-bold mb-3 transition-all duration-300 ${
            isActive 
              ? 'text-2xl md:text-3xl text-gray-900 dark:text-white' 
              : 'text-xl text-gray-800 dark:text-gray-200'
          }`}>
            {service.title}
          </h3>
          
          {/* Description */}
          <p className={`mb-5 leading-relaxed transition-all duration-300 ${
            isActive 
              ? 'text-base md:text-lg text-gray-600 dark:text-gray-300' 
              : 'text-sm text-gray-500 dark:text-gray-400'
          }`}>
            {service.description}
          </p>
          
          {/* Features */}
          <div className={`space-y-2 mb-6 transition-all duration-300 ${isActive ? 'mb-8' : ''}`}>
            {service.features.slice(0, 3).map((feature, i) => (
              <div key={i} className={`flex items-center gap-2 ${
                isActive 
                  ? 'text-sm md:text-base text-gray-600 dark:text-gray-300' 
                  : 'text-xs text-gray-500 dark:text-gray-400'
              }`}>
                <CheckCircle className={`${isActive ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-indigo-500 flex-shrink-0`} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Learn More Button */}
          <motion.div
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            <Link to={`/services/${service.id}`} className={`inline-flex items-center gap-2 ${isActive ? 'text-base' : 'text-sm'}`}>
              Learn More <ArrowRight className={`${isActive ? 'w-4 h-4' : 'w-3.5 h-3.5'} transition-transform group-hover:translate-x-1`} />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Sparkle on Active Card */}
      {isActive && (
        <div className="absolute -top-4 -right-4 animate-pulse">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-xl" style={{ borderRadius: 0 }}>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.2; }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
        
        /* Flash Light Animations */
        @keyframes flash-left-right {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes flash-right-left {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes flash-top-bottom {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        @keyframes flash-bottom-top {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        
        @keyframes flash-diagonal-tl-br {
          0% {
            transform: translate(-100%, -100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translate(100%, 100%);
            opacity: 0;
          }
        }
        
        @keyframes flash-diagonal-tr-bl {
          0% {
            transform: translate(100%, -100%);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          20% {
            opacity: 0;
          }
          100% {
            transform: translate(-100%, 100%);
            opacity: 0;
          }
        }
        
        @keyframes strobe {
          0%, 100% { opacity: 0; }
          5%, 15% { opacity: 0.15; }
          10% { opacity: 0.3; }
        }
        
        @keyframes corner-flash {
          0%, 100% { 
            opacity: 0;
            transform: scale(0);
            box-shadow: 0 0 0px rgba(255,255,255,0);
          }
          50% { 
            opacity: 1;
            transform: scale(1.5);
            box-shadow: 0 0 20px rgba(255,255,255,0.8);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 2s ease-in-out infinite;
        }
        .animate-pulse-fast {
          animation: pulse-fast 1.5s ease-in-out infinite;
        }
        
        .animate-flash-left-right {
          animation: flash-left-right 2s ease-in-out infinite;
        }
        .animate-flash-right-left {
          animation: flash-right-left 2.5s ease-in-out infinite;
        }
        .animate-flash-top-bottom {
          animation: flash-top-bottom 3s ease-in-out infinite;
        }
        .animate-flash-bottom-top {
          animation: flash-bottom-top 3.5s ease-in-out infinite;
        }
        .animate-flash-diagonal-tl-br {
          animation: flash-diagonal-tl-br 4s ease-in-out infinite;
        }
        .animate-flash-diagonal-tr-bl {
          animation: flash-diagonal-tr-bl 4.5s ease-in-out infinite;
        }
        
        .animate-strobe {
          animation: strobe 0.5s ease-in-out infinite;
        }
        
        .animate-corner-flash {
          animation: corner-flash 1.5s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default ServiceCard;