// src/hooks/useLoader.js

import { useState, useEffect } from 'react';
import { useLoadingEvents } from './useLoadingEvents';

export function useLoader() {
  const [domReady, setDomReady] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Listen for load events
  useLoadingEvents({
    onDomReady: () => setDomReady(true),
    onGlReady: () => setGlReady(true),
  });

  // When both ready, trigger fade-out
  useEffect(() => {
    if (domReady && glReady) {
      setIsFadingOut(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500); // match fade duration
      return () => clearTimeout(timeout);
    }
  }, [domReady, glReady]);

  return { isLoading, isFadingOut };
}