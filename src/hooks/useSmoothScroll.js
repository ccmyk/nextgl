// src/hooks/useSmoothScroll.js
'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '@/components/LenisProvider';

/**
 * Hook to control smooth scrolling
 * @returns {Object} Scroll control methods
 */
export function useSmoothScroll() {
  const lenis = useLenis();
  const [isScrolling, setIsScrolling] = useState(true);
  
  // Enable/disable scrolling
  const enableScroll = () => {
    if (!lenis) return;
    lenis.start();
    setIsScrolling(true);
    document.documentElement.classList.remove('lenis-stopped');
  };
  
  const disableScroll = () => {
    if (!lenis) return;
    lenis.stop();
    setIsScrolling(false);
    document.documentElement.classList.add('lenis-stopped');
  };
  
  // Scroll to element
  const scrollTo = (target, options = {}) => {
    if (!lenis) return;
    
    const defaultOptions = {
      offset: -100,
      duration: 1,
      immediate: false,
      lock: false,
      force: false,
    };
    
    lenis.scrollTo(target, { ...defaultOptions, ...options });
  };
  
  // Scroll to top
  const scrollToTop = (options = {}) => {
    scrollTo(0, options);
  };
  
  // Get current scroll position
  const getScrollPosition = () => {
    if (!lenis) return 0;
    return lenis.scroll;
  };
  
  return {
    lenis,
    isScrolling,
    enableScroll,
    disableScroll,
    scrollTo,
    scrollToTop,
    getScrollPosition,
  };
}
