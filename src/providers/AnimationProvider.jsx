'use client';

import { useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { initScrollAnimations } from '@/lib/animations/scrollAnimations';
import { observeAnimatedElements } from '@/lib/animations/textAnimations';

/**
 * Provider component that initializes all animations
 * This should be included near the root of your application
 */
export default function AnimationProvider({ children }) {
  // Initialize smooth scrolling
  const { lenis } = useSmoothScroll();
  
  // Initialize animations when component mounts and lenis is ready
  useEffect(() => {
    if (!lenis) return;
    
    // Initialize scroll animations
    initScrollAnimations(document, lenis);
    
    // Observe text animation elements
    const observer = observeAnimatedElements(document);
    
    // Clean up on unmount
    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, [lenis]);
  
  return <>{children}</>;
}
