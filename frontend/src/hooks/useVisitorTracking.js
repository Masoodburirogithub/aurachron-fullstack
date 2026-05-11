// src/hooks/useVisitorTracking.js
import { useEffect, useRef } from 'react';

const useVisitorTracking = () => {
  const pageViewIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Get or create session on component mount
    const initSession = async () => {
      try {
        const response = await fetch('/api/visitor/session', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        
        // Store session ID in localStorage as backup
        if (data.sessionId) {
          localStorage.setItem('visitorSessionId', data.sessionId);
        }
      } catch (error) {
        console.error('Session init error:', error);
      }
    };
    
    initSession();
    
    // Track page view duration on unload
    const handleBeforeUnload = () => {
      if (pageViewIdRef.current) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        // Send tracking data
        navigator.sendBeacon('/api/visitor/track-duration', JSON.stringify({
          pageViewId: pageViewIdRef.current,
          timeSpent
        }));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return { pageViewIdRef, startTimeRef };
};

export default useVisitorTracking;