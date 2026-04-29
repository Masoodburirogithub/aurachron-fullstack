// src/pages/CareersPage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { careersAPI } from '../services/api';
import toast from 'react-hot-toast';

const CareersPage = () => {
  const [positions, setPositions] = useState([]);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await careersAPI.getPositions();
      setPositions(response.data.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await careersAPI.apply(data);
      toast.success('Application submitted successfully!');
      reset();
      setShowApplication(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    }
  };

  const benefits = [
    { label: 'Salary', value: 'Market benchmark + 20%' },
    { label: 'Learning budget', value: 'PKR 100,000 per year' },
    { label: 'Equipment', value: 'M-series MacBook' },
    { label: 'Health coverage', value: 'Family (in-patient + OPD)' },
    { label: 'Paid leaves', value: '25 days + 12 public holidays' },
    { label: 'Annual retreat', value: 'Domestic, fully paid' },
    { label: 'Work model', value: 'Hybrid (3 days in-office, 2 days remote)' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Build the future with us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're hiring engineers who want to ship real code, learn in public, and shape Karachi's tech future.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Aurachron?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-2">{benefit.label}</h3>
                <p className="text-gray-600">{benefit.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((position) => (
              <div key={position.id} className="bg-white rounded-xl shadow p-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{position.title}</h3>
                  <p className="text-gray-600">{position.location} • {position.type}</p>
                  <p className="text-sm text-gray-500 mt-1">{position.experience}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPosition(position.title);
                    setShowApplication(true);
                  }}
                  className="btn-primary"
                >
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Apply for {selectedPosition}</h2>
              <button onClick={() => setShowApplication(false)} className="text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <input type="hidden" {...register('position')} value={selectedPosition} />
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input {...register('fullName', { required: 'Full name is required' })} className="w-full px-3 py-2 border rounded-lg" />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-3 py-2 border rounded-lg" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Portfolio/GitHub Link</label>
                <input {...register('portfolioLink')} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">What system would you automate first? *</label>
                <textarea {...register('systemIdea', { required: 'This field is required' })} rows="3" className="w-full px-3 py-2 border rounded-lg" />
                {errors.systemIdea && <p className="text-red-500 text-sm mt-1">{errors.systemIdea.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience</label>
                <input type="number" {...register('experience')} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowApplication(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;