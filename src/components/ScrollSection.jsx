'use client';

import { useRef, useEffect, memo } from 'react';
import { useScroll } from '@/hooks/useScroll';

function ScrollSection({ 
  children, 
  className = '', 
  threshold = 0.2,
  onEnter = () => {},
  onExit = () => {},
}) {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const isVisibleRef = useRef(false);
  
  useEffect(() => {
    const checkVisibility = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate visibility
      const isVisible = 
        rect.top < windowHeight * (1 - threshold) && 
        rect.bottom > windowHeight * threshold;
      
      // Call callbacks on state change
      if (isVisible && !isVisibleRef.current) {
        onEnter(sectionRef.current);
      } else if (!isVisible && isVisibleRef.current) {
        onExit(sectionRef.current);
      }
      
      isVisibleRef.current = isVisible;
    };
    
    // Initial check
    checkVisibility();
    
    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class for CSS animations
            sectionRef.current.classList.add('is-visible');
          } else {
            sectionRef.current.classList.remove('is-visible');
          }
        });
      },
      { threshold: [threshold] }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold, onEnter, onExit]);
  
  // Re-check visibility on scroll
  useEffect(() => {
    const checkVisibility = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        1 - (rect.top / windowHeight)
      ));
      
      // Apply progress as CSS variable
      sectionRef.current.style.setProperty('--scroll-progress', progress);
    };
    
    checkVisibility();
  }, [scrollY]);
  
  return (
    <section ref={sectionRef} className={`scroll-section ${className}`}>
      {children}
    </section>
  );
}

export default memo(ScrollSection);
