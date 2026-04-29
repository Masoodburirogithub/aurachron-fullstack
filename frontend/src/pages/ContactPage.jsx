// src/pages/ContactPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub } from 'react-icons/fi';

const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await contactAPI.submit(data);
      toast.success('Message sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Stop interviewing. Start launching.</h1>
          <p className="text-xl text-gray-600">
            Let's talk about your next project. No discovery fee for Karachi-based startups.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiMail className="text-accent text-xl" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">hr@aurachronsys.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-accent text-xl" />
                  <div>
                    <p className="font-semibold">Office</p>
                    <p className="text-gray-600">Second Floor Office 02, Mishal Manzil, Fl-3/12, Main Rashid Minhas Rd, Block 5 Karachi, 75300</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <a href="#" className="text-gray-600 hover:text-accent"><FiLinkedin size={24} /></a>
                  <a href="#" className="text-gray-600 hover:text-accent"><FiGithub size={24} /></a>
                </div>
              </div>

              <div className="mt-8 p-6 bg-accent/10 rounded-xl">
                <h3 className="text-xl font-bold mb-2">15-min systems call</h3>
                <p className="text-gray-600 mb-4">No pitch. Just a discovery conversation to see if we're a fit.</p>
                <button className="btn-primary">Book a Call →</button>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input {...register('fullName', { required: 'Name is required' })} className="w-full px-4 py-2 border rounded-lg" />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-4 py-2 border rounded-lg" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input {...register('company')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline *</label>
                  <select {...register('timeline', { required: 'Timeline is required' })} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Select timeline</option>
                    <option value="ASAP">ASAP</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="Planning stage">Planning stage</option>
                  </select>
                  {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Description *</label>
                  <textarea {...register('projectDesc', { required: 'Project description is required' })} rows="4" className="w-full px-4 py-2 border rounded-lg" />
                  {errors.projectDesc && <p className="text-red-500 text-sm mt-1">{errors.projectDesc.message}</p>}
                </div>
                <button type="submit" className="w-full btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;