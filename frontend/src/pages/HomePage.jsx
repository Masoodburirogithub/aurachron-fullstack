import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import TrustBar from '../components/common/TrustBar';
import ServicesSection from '../components/home/ServicesSection';
import CaseStudiesSection from '../components/home/CaseStudiesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Aurachron Systems - AI-Augmented Engineering | Pakistan's Leading Tech Firm";
  }, []);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesSection />
      <CaseStudiesSection />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;