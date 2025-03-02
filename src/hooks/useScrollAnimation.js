// src/hooks/useScrollAnimation.js
'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { gsap } from 'gsap';

/**
 * Hook for scroll-based animations
 * @param {Object} options - Animation options
 * @returns {Object} Animation controls and ref
 */
export function useScrollAnimation(options = {}) {
  const {
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    markers = false,
    animation = {},
    pin = false,
  } = options;
  
  const elementRef = useRef(null);
  const { scrollY } = useScroll();
  const [timeline, setTimeline] = useState(null);
  
  // Load ScrollTrigger dynamically to avoid SSR issues
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let ScrollTrigger;
    import('gsap/ScrollTrigger')
      .then(module => {
        ScrollTrigger = module.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        
        // Create animation once ScrollTrigger is loaded
        if (elementRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: elementRef.current,
              start,
              end,
              scrub,
              markers,
              pin,
            },
          });
          
          tl.to(elementRef.current, animation);
          setTimeline(tl);
        }
      })
      .catch(error => {
        console.warn('Error loading ScrollTrigger, using basic animation:', error);
        
        // Fallback to basic animation
        if (elementRef.current) {
          const tl = gsap.timeline();
          tl.to(elementRef.current, animation);
          setTimeline(tl);
        }
      });
      
    return () => {
      if (timeline) {
        timeline.kill();
        if (timeline.scrollTrigger) {
          timeline.scrollTrigger.kill();
        }
      }
    };
  }, [start, end, scrub, markers, pin, animation]);
  
  // Update animation on scroll if no ScrollTrigger
  useEffect(() => {
    if (!timeline || timeline.scrollTrigger) return;
    
    // If we're using the fallback animation (no ScrollTrigger),
    // manually update progress based on scroll position
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 
        1 - (rect.top / windowHeight)
      ));
      
      timeline.progress(progress);
    }
  }, [scrollY, timeline]);
  
  return { ref: elementRef };
}