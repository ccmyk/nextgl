// src/hooks/useScroll.js

import { useEffect } from 'react';
import { useLenis } from '@/context/LenisContext';

export function useScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    function handle(e) {
      const { scroll, velocity, direction } = e;

      // `stview` = scrolled from top
      if (scroll > 0) {
        document.documentElement.classList.add('stview');
      } else {
        document.documentElement.classList.remove('stview');
      }

      // up / down
      if (direction === 'down') {
        document.documentElement.classList.remove('scroll-up');
        document.documentElement.classList.add('scroll-down');
      } else if (direction === 'up') {
        document.documentElement.classList.remove('scroll-down');
        document.documentElement.classList.add('scroll-up');
      }

      // Fire your legacy event for page code
      const evt = new CustomEvent('scrollDetail', { detail: e });
      document.dispatchEvent(evt);
    }

    lenis.on('scroll', handle);
    return () => lenis.off('scroll', handle);
  }, [lenis]);
}