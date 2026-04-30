import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, BookOpen, Monitor, Heart, Users, Send } from 'lucide-react';

const CareersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const positions = [
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
    setShowForm(true);
  };

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Build the future with us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-indigo-100 max-w-3xl mx-auto">
            We're hiring engineers who want to ship real code, learn in public, and shape Karachi's tech future.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Aurachron?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <benefit.icon className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-lg mb-1">{benefit.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((pos, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-wrap justify-between items-center gap-4"
              >
                <div>
                  <h3 className="text-xl font-bold">{pos.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {pos.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {pos.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {pos.experience}</span>
                  </div>
                  <div className="mt-2 text-indigo-600 font-semibold text-sm">{pos.salary}</div>
                </div>
                <button onClick={() => handleApply(pos.title)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all">
                  Apply Now →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Apply for {selectedRole}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Application submitted! We'll review and get back to you."); setShowForm(false); }}>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Portfolio/GitHub Link</label>
                <input className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">What system would you automate first? *</label>
                <textarea rows="3" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                Submit Application <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;