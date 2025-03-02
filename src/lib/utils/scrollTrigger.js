// src/lib/utils/scrollTrigger.js
'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useLenis } from '@/components/LenisProvider';

// Import ScrollTrigger with dynamic import to avoid SSR issues
let ScrollTrigger;

if (typeof window !== 'undefined') {
  // Only import on client side
  import('gsap/ScrollTrigger').then(module => {
    ScrollTrigger = module.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }).catch(error => {
    console.warn('Error loading ScrollTrigger:', error);
  });
}

/**
 * Initialize ScrollTrigger with Lenis if available
 * @returns {Object|null} ScrollTrigger instance or null if not available
 */
export function useScrollTrigger() {
  const lenis = useLenis();
  
  useEffect(() => {
    if (!lenis) return;
    
    // Wait for ScrollTrigger to be available
    let interval;
    let cleanup = () => {};
    
    const setupScrollTrigger = () => {
      if (!ScrollTrigger) return false;
      
      // Connect Lenis to ScrollTrigger
      const scrollHandler = () => {
        if (ScrollTrigger && ScrollTrigger.update) {
          ScrollTrigger.update();
        }
      };
      
      lenis.on('scroll', scrollHandler);
      
      // Set up ScrollTrigger to use Lenis for scrolling
      const ticker = (time) => {
        lenis.raf(time * 1000);
      };
      
      gsap.ticker.add(ticker);
      
      // Remove default gsap ticker if needed
      if (gsap.updateRoot) {
        gsap.ticker.remove(gsap.updateRoot);
      }
      
      // Setup cleanup function
      cleanup = () => {
        lenis.off('scroll', scrollHandler);
        gsap.ticker.remove(ticker);
      };
      
      return true;
    };
    
    // Try to set up immediately
    if (!setupScrollTrigger() && typeof window !== 'undefined') {
      // If not available yet, check periodically
      interval = setInterval(() => {
        if (setupScrollTrigger()) {
          clearInterval(interval);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      cleanup();
    };
  }, [lenis]);
  
  return ScrollTrigger;
}