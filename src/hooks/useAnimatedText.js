"use client"

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import { useSplitText } from '@/hooks/useSplitText';

/**
 * Hook that combines SplitText with GSAP animation for text elements
 * Exactly matches legacy animation behavior
 */
export function useAnimatedText({
  ref,
  type = 'char', // 'char', 'word', 'line'
  delay = 0,
  duration = 0.6,
  stagger = 0.03,
  once = true,
  threshold = 0.2,
  autoStart = true
}) {
  const tlRef = useRef(null);
  const { inView, ref: inViewRef } = useInView({
    triggerOnce: once,
    threshold
  });
  
  // Combine refs
  const setRefs = (element) => {
    // Handle both ref cases
    if (ref) {
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    }
    inViewRef(element);
  };
  
  // Use the existing split text hook
  const splitInstance = useSplitText(ref || inViewRef, {
    types: type === 'line' ? 'lines' : 'chars,words',
    processChars: type === 'char',
    fakeCount: 3 
  });
  
  // Animation controller
  const animate = (state) => {
    if (!ref?.current) return;
    
    if (state === 1) {
      // Enter animation
      const elements = ref.current.querySelectorAll(
        type === 'line' ? '.line' : 
        type === 'word' ? '.word' : 
        '.char'
      );
      
      if (!elements.length) return;
      
      tlRef.current = gsap.timeline();
      tlRef.current.fromTo(
        elements,
        { 
          opacity: 0, 
          y: type === 'line' ? 20 : 0,
          scaleX: type === 'word' ? 1.2 : 1
        },
        { 
          opacity: 1, 
          y: 0, 
          scaleX: 1,
          duration, 
          stagger,
          ease: 'cubic-bezier(0.55, 0, 0.1, 1)',
          delay
        }
      );
    } else if (state === 0) {
      // Exit animation
      if (tlRef.current) {
        tlRef.current.reverse();
      }
    }
  };
  
  // Trigger animation on inView change
  useEffect(() => {
    if (autoStart && inView) {
      animate(1);
    }
  }, [inView, autoStart]);
  
  return {
    setRef: setRefs,
    isInView: inView,
    animate,
    splitInstance
  };
}