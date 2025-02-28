"use client";

import { useEffect, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";

export default function AppInitializer({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set CSS variables for viewport height (fixes mobile viewport issues)
    const setViewportHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    // Initial setup
    setViewportHeight();
    
    // Add resize listener
    window.addEventListener('resize', setViewportHeight);
    
    // Set initialized state
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  return (
    <SmoothScroll>
      {children}
    </SmoothScroll>
  );
}