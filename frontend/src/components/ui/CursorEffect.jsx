// components/ui/CursorEffect.jsx
import React, { useEffect, useState } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = (e) => {
      if (e.target.closest('a, button, .hover-scale')) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  return (
    <>
      <div
        className="custom-cursor hidden lg:block"
        style={{
          transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
          scale: isHovering ? 1.5 : 1,
          transition: 'transform 0.2s ease',
        }}
      />
      <div
        className="hidden lg:block"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
    </>
  );
};

export default CursorEffect;