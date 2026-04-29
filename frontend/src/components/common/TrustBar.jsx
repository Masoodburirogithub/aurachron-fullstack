// src/components/common/TrustBar.jsx
import React from 'react';

const TrustBar = () => {
  const logos = ['Logo 1', 'Logo 2', 'Logo 3', 'Logo 4'];
  
  return (
    <div className="py-8 bg-gray-50">
      <div className="container-custom">
        <p className="text-center text-gray-500 text-sm mb-4">
          Trusted by emerging enterprises in Pakistan, UAE & KSA
        </p>
        <div className="flex justify-center items-center gap-8 flex-wrap opacity-50">
          {logos.map((logo, i) => (
            <div key={i} className="text-gray-400 font-bold">{logo}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;