// src/pages/CareersPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, BookOpen, Monitor, Heart, Users, Send, Upload, FileText } from 'lucide-react';
import { careersAPI } from '../services/api';
import toast from 'react-hot-toast';

const CareersPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await careersAPI.getPositions();
      if (response.data.success) {
        setPositions(response.data.data);
      } else {
        setPositions(response.data);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      setPositions(defaultPositions);
    } finally {
      setLoading(false);
    }
  };

  const defaultPositions = [
    { title: 'Senior Full Stack Engineer', type: 'Full-time', location: 'Karachi (Hybrid)', experience: '5+ years', salary: 'Market + 30%' },
    { title: 'AI/ML Engineer', type: 'Full-time', location: 'Karachi (Hybrid)', experience: '3+ years', salary: 'Market + 30%' },
    { title: 'Frontend Developer (React/Next.js)', type: 'Full-time', location: 'Karachi (Hybrid)', experience: '3+ years', salary: 'Market + 25%' },
    { title: 'DevOps Engineer', type: 'Full-time', location: 'Karachi (Hybrid)', experience: '4+ years', salary: 'Market + 30%' },
  ];

  const benefits = [
    { icon: DollarSign, label: 'Salary', value: 'Market benchmark + 20%' },
    { icon: BookOpen, label: 'Learning budget', value: 'PKR 100,000 per year' },
    { icon: Monitor, label: 'Equipment', value: 'M-series MacBook' },
    { icon: Heart, label: 'Health coverage', value: 'Family (in-patient + OPD)' },
    { icon: Clock, label: 'Paid leaves', value: '25 days + 12 public holidays' },
    { icon: Users, label: 'Annual retreat', value: 'Domestic, fully paid' },
  ];

  const handleApply = (role) => {
    setSelectedRole(role);
    setSelectedFile(null);
    setFileName('');
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, and DOCX files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please upload your CV');
      return;
     }
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('fullName', e.target.fullName.value);
    formData.append('email', e.target.email.value);
    formData.append('position', selectedRole);
    formData.append('portfolioLink', e.target.portfolioLink.value);
    formData.append('systemIdea', e.target.systemIdea.value);
    formData.append('experience', e.target.experience.value);
    formData.append('coverLetter', e.target.coverLetter?.value || '');
    formData.append('cv', selectedFile);
    
    try {
      const response = await careersAPI.apply(formData);
      toast.success('Application submitted successfully!');
      setShowForm(false);
      setSelectedFile(null);
      setFileName('');
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setUploading(false);
    }
  };

  const displayPositions = positions.length > 0 ? positions : defaultPositions;

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading positions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-0 md:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#F59E0B]/90 to-[#FBBF24]/70 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Build the future with us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto px-4">
            We're hiring engineers who want to ship real code, learn in public, and shape Karachi's tech future.
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Why Join Aurachron?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <benefit.icon className="w-10 h-10 text-[#F59E0B] mb-3" />
                <h3 className="font-semibold text-lg mb-1">{benefit.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-4">
            {displayPositions.map((pos, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6 flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold">{pos.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {pos.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {pos.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {pos.experience}</span>
                  </div>
                  <div className="mt-2 text-[#F59E0B] font-semibold text-sm">{pos.salary}</div>
                </div>
                <button 
                  onClick={() => handleApply(pos.title)} 
                  className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  Apply Now →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal with CV Upload */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl sm:text-2xl font-bold">Apply for {selectedRole}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmitApplication} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input name="fullName" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input name="email" type="email" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              
              {/* CV Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Upload CV * (PDF, DOC, DOCX - Max 5MB)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#F59E0B] transition">
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    {fileName ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <FileText size={24} />
                        <span className="text-sm">{fileName}</span>
                        <button type="button" onClick={() => { setSelectedFile(null); setFileName(''); }} className="text-red-500 text-xs">Remove</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Upload size={24} />
                        <span>Click to upload CV</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Portfolio/GitHub Link</label>
                <input name="portfolioLink" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What system would you automate first? *</label>
                <textarea name="systemIdea" rows="3" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <input name="experience" type="number" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter (Optional)</label>
                <textarea name="coverLetter" rows="3" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" placeholder="Why do you want to join us?"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={uploading || !selectedFile} 
                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? 'Submitting...' : <><Send size={16} /> Submit Application</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;