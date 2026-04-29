// src/components/home/PricingSection.jsx
import React from 'react';

const PricingSection = () => {
  const modules = [
    { name: 'User auth + roles', price: '$1,200 - 1,800' },
    { name: 'Admin dashboard', price: '$2,000 - 3,500' },
    { name: 'Payment integration', price: '$1,500 - 2,500' },
    { name: 'AI document extractor (RAG)', price: '$3,000 - 6,000' },
    { name: 'Mobile app (iOS + Android)', price: '$6,000 - 12,000' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-4">Transparent, Module-Based Pricing</h2>
        <p className="text-center text-gray-600 mb-12">No hourly billing. Pay for what you need.</p>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {modules.map((module, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{module.name}</td>
                    <td className="px-6 py-4 text-right text-accent font-bold">{module.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">🎉 10% off for Karachi startups | Annual retainer: 15% off</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;