"use client";

import { createContext, useContext, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [animations, setAnimations] = useState({});

  const animateText = (element, options = {}) => {
    if (!element) return null;

    const defaults = {
      duration: 0.8,
      stagger: 0.05,
      delay: 0,
      ease: "power4.inOut",
      fromVars: { opacity: 0, y: 20 },
      toVars: { opacity: 1, y: 0 },
      splitOptions: { types: ["chars", "words"], tagName: "span" }
    };

    const config = { ...defaults, ...options };
    
    // Split the text if it hasn't been split already
    const splitText = element.classList.contains("split-text") 
      ? element 
      : new SplitType(element, config.splitOptions);
    
    // Create the animation
    const tl = gsap.timeline({ delay: config.delay });
    
    tl.fromTo(
      splitText.chars || element,
      config.fromVars,
      {
        ...config.toVars,
        stagger: config.stagger,
        duration: config.duration,
        ease: config.ease
      }
    );

    return tl;
  };

  const animateWebGL = (element, uniforms, options = {}) => {
    if (!element || !uniforms) return null;

    const defaults = {
      duration: 0.8,
      delay: 0,
      ease: "power2.inOut",
      startValue: 1,
      endValue: 0
    };

    const config = { ...defaults, ...options };
    
    // Create the animation
    const tl = gsap.timeline({ delay: config.delay });
    
    tl.fromTo(
      uniforms.uStart,
      { value: config.startValue },
      {
        value: config.endValue,
        duration: config.duration,
        ease: config.ease
      }
    );

    return tl;
  };

  return (
    <AnimationContext.Provider value={{ animations, animateText, animateWebGL }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}
