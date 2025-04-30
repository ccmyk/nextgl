// src/hooks/useAnimationSequence.js

"use client"

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useInView } from './useIntersectionObserver';

/**
 * Hook to create animation sequences with GSAP
 * Preserves your existing animation style
 */
export function useAnimationSequence(options = {}) {
  const {
    root = null,
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    defaultEase = 'cubic-bezier(.55, 0, .1, 1)',
    defaultDuration = 0.6,
  } = options;
  
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const inView = useInView(containerRef, { 
    threshold, 
    triggerOnce 
  });
  
  // Animation registration
  const animations = useRef([]);
  
  // Add animation to the sequence
  const add = (elements, fromVars, toVars, position) => {
    animations.current.push({
      elements,
      fromVars,
      toVars: { 
        ...toVars, 
        ease: toVars.ease || defaultEase, 
        duration: toVars.duration || defaultDuration 
      },
      position
    });
  };
  
  // Execute animations when in view
  useEffect(() => {
    if (!inView || !containerRef.current || animations.current.length === 0) return;
    
    // Create main timeline
    timelineRef.current = gsap.timeline({
      delay,
      paused: false,
    });
    
    // Add all animations to timeline
    animations.current.forEach(({ elements, fromVars, toVars, position }) => {
      timelineRef.current.fromTo(
        typeof elements === 'string' ? 
          containerRef.current.querySelectorAll(elements) : 
          elements,
        fromVars,
        toVars,
        position
      );
    });
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [inView, delay]);
  
  return {
    ref: containerRef,
    inView,
    add,
    timeline: timelineRef
  };
}