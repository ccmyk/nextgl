// src/components/ScrollManager.jsx
'use client';

import { useEffect } from 'react';
import { useLenis } from '@/components/LenisProvider';

export default function ScrollManager({ children }) {
  const lenis = useLenis();
  
  useEffect(() => {
    // Create a global event bus for scroll events
    const scrollEvents = {
      start: new CustomEvent('lenis:start'),
      stop: new CustomEvent('lenis:stop'),
      scroll: new CustomEvent('lenis:scroll', { detail: { scroll: 0 } }),
    };
    
    // Update scroll event details
    const updateScrollEvent = () => {
      if (!lenis) return;
      scrollEvents.scroll.detail.scroll = lenis.scroll;
      document.dispatchEvent(scrollEvents.scroll);
    };
    
    // Add Lenis scroll callback
    if (lenis) {
      lenis.on('scroll', updateScrollEvent);
    }
    
    return () => {
      if (lenis) {
        lenis.off('scroll', updateScrollEvent);
      }
    };
  }, [lenis]);
  
  return children;
}