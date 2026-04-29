// src/components/common/ProcessSteps.jsx
import React from 'react';

const ProcessSteps = () => {
  const steps = [
    { step: 1, name: 'System Audit', duration: '3 days' },
    { step: 2, name: 'Modular Roadmap', duration: 'Pay per feature, fixed estimates' },
    { step: 3, name: 'Bi-weekly Delivery', duration: 'Working software every 14 days' },
    { step: 4, name: 'Deploy + 3mo Support', duration: 'Full IP + free hypercare' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-4">Predictable Delivery. No Surprises.</h2>
        <p className="text-center text-gray-600 mb-12">Our proven process delivers results, every time</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-16 h-16 bg-accent text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.name}</h3>
              <p className="text-gray-600">{step.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;