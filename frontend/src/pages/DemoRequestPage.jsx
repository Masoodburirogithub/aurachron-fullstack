// src/pages/DemoRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';

const DemoRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessEmail: '',
    company: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!privacyChecked) {
      toast.error('Please agree to the Privacy Policy');
      return;
    }
    
    setLoading(true);
    
    try {
      await demoAPI.submitDemoRequest(formData);
      toast.success('Demo Request Sent Successfully!');
      setFormData({
        businessEmail: '',
        company: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        phoneNumber: ''
      });
      setPrivacyChecked(false);
    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  // Prevent body scroll when page mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <Header isTransparent={true} />
      <div className="min-h-screen bg-[#1e1f24] w-full overflow-hidden pt-16 md:pt-20">
        <div className="h-full w-full overflow-y-auto">
          <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-8 md:py-4">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

              {/* LEFT CONTENT */}
              <div className="flex-1 flex flex-col justify-center">

                {/* HEADING */}
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-normal leading-[1.2] mb-4 sm:mb-5 md:mb-6">
                  Cut costs, not quality with Aurachron AI Agent
                </h1>

                {/* DESCRIPTION */}
                <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                  Stop overpaying to waste your customers' time — Aurachron AI Agent
                  delivers human-like conversations that boost your bottom line.
                </p>
              </div>

              {/* RIGHT FORM CARD */}
              <div className="flex-1 bg-[#eef2f6] rounded-xl sm:rounded-2xl text-[#333] shadow-xl p-5 sm:p-6 md:p-8">

                {/* FORM TITLE */}
                <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-7 text-[#1a1a1a]">
                  Request demo
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit}>

                  {/* INPUT GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">

                    {/* BUSINESS EMAIL */}
                    <input
                      type="email"
                      name="businessEmail"
                      placeholder="Business Email*"
                      required
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 h-auto border border-[#d1d5db] rounded-lg bg-white text-sm sm:text-base px-3 sm:px-4 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#007aff]"
                    />

                    {/* COMPANY */}
                    <input
                      type="text"
                      name="company"
                      placeholder="Company*"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 h-auto border border-[#d1d5db] rounded-lg bg-white text-sm sm:text-base px-3 sm:px-4 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#007aff]"
                    />

                    {/* FIRST NAME */}
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name*"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 h-auto border border-[#d1d5db] rounded-lg bg-white text-sm sm:text-base px-3 sm:px-4 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#007aff]"
                    />

                    {/* LAST NAME */}
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name*"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 h-auto border border-[#d1d5db] rounded-lg bg-white text-sm sm:text-base px-3 sm:px-4 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#007aff]"
                    />

                    {/* JOB TITLE */}
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Job Title*"
                      required
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 h-auto border border-[#d1d5db] rounded-lg bg-white text-sm sm:text-base px-3 sm:px-4 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#007aff]"
                    />

                    {/* PHONE NUMBER */}
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number*"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full py-2.5 sm:py-3 md:py-3.5 h-auto border border-[#d1d5db] rounded-lg bg-white text-sm sm:text-base px-3 sm:px-4 placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#007aff]"
                    />
                  </div>

                  {/* PRIVACY POLICY CHECKBOX */}
                  <div className="flex items-start gap-2 sm:gap-3 mt-5 sm:mt-6 md:mt-7 mb-4 sm:mb-5 md:mb-6 px-1 py-2 sm:py-2.5 md:py-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="privacyCheck"
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                      required
                      className="mt-0.5 w-4 h-4 accent-[#007aff] cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="privacyCheck" className="text-xs sm:text-sm text-[#6b7280] leading-relaxed cursor-pointer">
                      By submitting this form, I confirm that I have read and agree to the
                      <a href="#" className="underline hover:text-[#007aff] transition-colors ml-1"> Privacy Policy</a>.
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#007aff] text-white py-2.5 sm:py-3 md:py-3.5 rounded-full text-sm sm:text-base font-semibold uppercase tracking-[0.5px] cursor-pointer transition-all duration-300 hover:bg-[#0062cc] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Book a Demo'}
                  </button>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoRequestPage;