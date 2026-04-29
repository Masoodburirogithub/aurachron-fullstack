// src/components/home/TestimonialsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Aurachron replaced our legacy ERP in 6 weeks with zero downtime. Their AI agents cut inventory reconciliation from 4 hours to 10 minutes.",
      author: "S. Ahmed",
      title: "COO, Gulf Express PK",
    },
    {
      text: "The transparency is unmatched -- live Jira, direct Slack with engineers, and they actually delivered under budget.",
      author: "L. Rizvi",
      title: "Founder, DawaaiConnect",
    },
    {
      text: "Finally a Karachi-based firm that thinks like a Silicon Valley partner. We're scaling globally with their platform.",
      author: "T. Noman",
      title: "CEO, RetailStack",
    },
  ];

  return (
    <section className="py-20">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-gradient-to-br from-white to-gray-50"
            >
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t pt-4">
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;