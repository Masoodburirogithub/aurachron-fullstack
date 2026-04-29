// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/common/Hero';
import TrustBar from '../components/common/TrustBar';
import ServicesSection from '../components/home/ServicesSection';
import CaseStudiesSection from '../components/home/CaseStudiesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ProcessSteps from '../components/common/ProcessSteps';
import PricingSection from '../components/home/PricingSection';
import { caseStudiesAPI } from '../services/api';

const HomePage = () => {
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await caseStudiesAPI.getAll();
        setCaseStudies(response.data.data);
      } catch (error) {
        console.error('Error fetching case studies:', error);
      }
    };
    fetchCaseStudies();
  }, []);

  return (
    <div>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <CaseStudiesSection caseStudies={caseStudies} />
      <TestimonialsSection />
      <ProcessSteps />
      <PricingSection />
    </div>
  );
};

export default HomePage;