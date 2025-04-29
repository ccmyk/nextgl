// src/hooks/useScroll.js

import { useEffect } from 'react';
import { useLenis } from '@/context/LenisContext';

export function useScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    function onScroll(e) {
      const { scroll, velocity, direction } = e;
      // stview
      if (scroll > 0) document.documentElement.classList.add('stview');
      else document.documentElement.classList.remove('stview');
      // up/down
      if (direction === 'down') {
        document.documentElement.classList.remove('scroll-up');
        document.documentElement.classList.add('scroll-down');
      } else if (direction === 'up') {
        document.documentElement.classList.remove('scroll-down');
        document.documentElement.classList.add('scroll-up');
      }
    }
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis]);
}