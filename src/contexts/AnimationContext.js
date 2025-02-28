"use client";

import { createContext, useContext, useState } from 'react';
import gsap from 'gsap';

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [animations, setAnimations] = useState({});

  // Function to animate text with character scrambling effect
  const animateText = (element, state = 0) => {
    if (!element) return;
    
    const chars = element.querySelectorAll('.char');
    
    if (chars.length === 0) return;
    
    const timeline = gsap.timeline();
    
    chars.forEach((char, index) => {
      const normal = char.querySelector('.n');
      const fakes = char.querySelectorAll('.f');
      
      if (state === 0) {
        // Initial state - show normal character
        timeline.set(normal, { opacity: 1 }, 0);
        fakes.forEach(fake => {
          timeline.set(fake, { 
            display: 'none', 
            opacity: 0,
            transform: 'scale(0, 1)' 
          }, 0);
        });
      } else {
        // Animate character
        timeline.to(normal, { 
          opacity: 0,
          duration: 0.1,
          ease: 'power1.inOut'
        }, index * 0.05);
        
        // Show random fake characters in sequence
        if (fakes.length > 0) {
          const randomFakes = [...fakes].sort(() => Math.random() - 0.5);
          
          randomFakes.forEach((fake, i) => {
            const delay = index * 0.05 + i * 0.08;
            
            timeline.set(fake, { 
              display: 'inline-block',
              opacity: 0,
              transform: 'scale(0, 1)'
            }, delay);
            
            timeline.to(fake, {
              opacity: 1,
              transform: 'scale(1, 1)',
              duration: 0.1,
              ease: 'power1.out'
            }, delay + 0.01);
            
            timeline.to(fake, {
              opacity: 0,
              transform: 'scale(0, 1)',
              duration: 0.1,
              ease: 'power1.in'
            }, delay + 0.1);
          });
        }
        
        // Show normal character again
        timeline.to(normal, {
          opacity: 1,
          duration: 0.2,
          ease: 'power1.out'
        }, index * 0.05 + 0.3);
      }
    });
    
    return timeline;
  };

  // Function to animate fade in/out
  const animateFade = (element, show = true, duration = 0.5) => {
    if (!element) return;
    
    return gsap.to(element, {
      opacity: show ? 1 : 0,
      duration,
      ease: 'power2.inOut'
    });
  };

  // Function to animate blur elements
  const animateBlur = (element, active = false) => {
    if (!element) return;
    
    const blurDivs = element.querySelectorAll('div');
    
    if (blurDivs.length === 0) return;
    
    const timeline = gsap.timeline();
    
    blurDivs.forEach((div, index) => {
      timeline.to(div, {
        opacity: active ? 0.8 : 0,
        duration: 0.3,
        ease: 'power1.inOut'
      }, index * 0.05);
    });
    
    return timeline;
  };

  const value = {
    animateText,
    animateFade,
    animateBlur,
    animations,
    setAnimations
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
