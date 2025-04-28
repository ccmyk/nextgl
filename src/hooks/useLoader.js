// src/hooks/useLoader.js

import { useState, useEffect } from 'react';
import { useLoadingEvents } from './useLoadingEvents';

export function useLoader({ minDisplayTime = 1000 } = {}) {
  const [domReady, setDomReady] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Subscribe to domReady and glReady
  useLoadingEvents({
    onDomReady: () => setDomReady(true),
    onGlReady:  () => setGlReady(true),
  });

  // Progress loop (imitate legacy loads.js)
  useEffect(() => {
    let raf, start;
    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(100, Math.floor((elapsed / minDisplayTime) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(step);
      }
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [minDisplayTime]);

  // When both ready AND min time passed, trigger fade-out
  useEffect(() => {
    if (domReady && glReady && progress >= 100) {
      setIsFadingOut(true);
      const t = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(t);
    }
  }, [domReady, glReady, progress]);

  return { isLoading, isFadingOut, progress };
}