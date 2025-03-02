'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';

// Create context for Lenis
const LenisContext = createContext(null);

/**
 * Hook to use Lenis context
 * @returns {Lenis} Lenis instance
 */
export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
};

/**
 * LenisProvider component
 * Provides smooth scrolling functionality using Lenis
 */
export default function LenisProvider({ 
  children,
  options = {
    lerp: 0.04,
    duration: 0.8,
    smoothWheel: true,
    smoothTouch: false,
    normalizeWheel: true,
  },
  isTouch = false,
}) {
  const [lenis, setLenis] = useState(null);
  const requestRef = useRef(null);
  
  // Initialize Lenis
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Add lenis class to html element
      document.documentElement.classList.add('lenis');
      
      // Create Lenis instance
      const lenisInstance = new Lenis({
        wheelEventsTarget: document.documentElement,
        ...options,
        smoothWheel: !isTouch && options.smoothWheel,
      });
      
      // Set Lenis instance to state
      setLenis(lenisInstance);
      
      // Expose Lenis instance to window for backward compatibility with legacy code
      window.lenisInstance = lenisInstance;
      
      // Start Lenis by default (can be controlled via the API)
      lenisInstance.start();
      
      // Update function for animation frame
      const update = (time) => {
        lenisInstance.raf(time);
        if (window.gsap) {
          gsap.updateRoot(time / 1000);
        }
        requestRef.current = requestAnimationFrame(update);
      };
      
      // Start animation frame
      requestRef.current = requestAnimationFrame(update);
      
      // Cleanup function
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        
        // Remove global reference
        if (window.lenisInstance === lenisInstance) {
          window.lenisInstance = null;
        }
        
        lenisInstance.destroy();
        document.documentElement.classList.remove('lenis');
      };
    } catch (error) {
      console.error('Error initializing Lenis:', error);
    }
  }, [options, isTouch]);
  
  // Handle resize
  useEffect(() => {
    if (!lenis) return;
    
    const handleResize = () => {
      // Trigger lenis resize
      if (lenis) {
        lenis.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [lenis]);
  
  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}

/**
 * ScrollToButton component
 * Button that scrolls to a target element when clicked
 */
export function ScrollToButton({ 
  targetId, 
  children, 
  offset = -100, 
  duration = 1, 
  className = '' 
}) {
  const lenis = useLenis();
  
  const handleClick = () => {
    if (!lenis) return;
    
    lenis.scrollTo(`#${targetId}`, { offset, duration });
  };
  
  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
