'use client';

import { useEffect, useRef } from 'react';
import { writeFn } from '@/lib/animations/textAnimations';

/**
 * TextAnimation component for animating text with GSAP and SplitType
 * 
 * Usage examples:
 * <TextAnimation type="text">This text will be split into lines and animated</TextAnimation>
 * <TextAnimation type="line">This text will be animated line by line</TextAnimation>
 * <TextAnimation type="write">This text will have character animations</TextAnimation>
 * <TextAnimation type="write" params="0.5,3">With custom timing parameters</TextAnimation>
 * <TextAnimation type="write" bucle>This animation will loop when scrolling in/out of view</TextAnimation>
 */
export default function TextAnimation({ 
  children, 
  type = 'write', 
  className = '', 
  params,
  bucle,
  autoPlay = false,
  ...props 
}) {
  const elementRef = useRef(null);
  const animationClass = type === 'text' ? 'Atext' : 
                         type === 'line' ? 'Aline' : 'Awrite';
  
  // Initialize animation on mount
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Initialize animation
    writeFn(element, 0);
    
    // Play animation if autoPlay is true
    if (autoPlay) {
      setTimeout(() => {
        writeFn(element, 1);
      }, 100);
    }
    
    // Set up intersection observer for animations
    if (!autoPlay && typeof window !== 'undefined' && window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add inview class
            element.classList.add('inview');
            
            // Play animation if not already played
            if (!element.classList.contains('ivi')) {
              writeFn(element, 1);
            }
            
            // Unobserve if not looping
            if (!bucle) {
              observer.unobserve(element);
            }
          } else if (bucle) {
            // Remove inview class for looping animations
            element.classList.remove('inview');
            
            // Play out animation
            writeFn(element, -1);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      });
      
      observer.observe(element);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [autoPlay, bucle, type]);
  
  // Combine classes
  const combinedClassName = `${animationClass} ${className}`.trim();
  
  // Prepare data attributes
  const dataAttributes = {};
  if (params) dataAttributes['data-params'] = params;
  if (bucle) dataAttributes['data-bucle'] = true;
  
  // For Atext and Aline, we need to wrap the content
  if (type === 'text' || type === 'line') {
    const innerClassName = `${type === 'text' ? 'Atext_el' : 'Aline_el'}`;
    
    return (
      <div 
        ref={elementRef}
        className={combinedClassName}
        {...dataAttributes}
        {...props}
      >
        <div className={innerClassName}>
          {children}
        </div>
      </div>
    );
  }
  
  // For Awrite, we can use the content directly
  return (
    <div 
      ref={elementRef}
      className={combinedClassName}
      {...dataAttributes}
      {...props}
    >
      {children}
    </div>
  );
}
