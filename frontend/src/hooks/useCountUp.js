// src/components/hooks/useCountUp.js
import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end, start = 0, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(start);
  const [isCounting, setIsCounting] = useState(false);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);
  const delayTimeoutRef = useRef(null);

  useEffect(() => {
    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(() => {
        setIsCounting(true);
      }, delay);
    } else {
      setIsCounting(true);
    }

    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [delay]);

  useEffect(() => {
    if (!isCounting) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);
      setCount(currentCount);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isCounting, end, start, duration]);

  return count;
};