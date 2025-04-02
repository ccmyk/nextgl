// src/hooks/useScroll.js
'use client';

import { useState, useEffect } from 'react';
import { useLenis } from '@/components/LenisProvider';

export function useScroll() {
  const lenis = useLenis();
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState(0); // 1: down, -1: up, 0: none
  const [lastY, setLastY] = useState(0);
  
  useEffect(() => {
    if (!lenis) return;
    
    const onScroll = ({ detail }) => {
      setScrollY(detail.scroll);
      
      // Determine scroll direction
      if (detail.scroll > lastY) {
        setDirection(1);
      } else if (detail.scroll < lastY) {
        setDirection(-1);
      }
      
      setLastY(detail.scroll);
    };
    
    // Subscribe to scroll events
    document.addEventListener('lenis:scroll', onScroll);
    
    return () => {
      document.removeEventListener('lenis:scroll', onScroll);
    };
  }, [lenis, lastY]);
  
  return { scrollY, direction };
}