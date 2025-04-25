"use client";
import { useState, useEffect } from "react";
import Lenis from "lenis";

/**
 * Replace scroll.js:
 *  - drives smooth scroll via Lenis
 *  - returns scrollY state, plus stop/start controls
 */
export function usePageScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - 2 ** -10 * t) });
    function raf(time) {
      lenis.raf(time);
      setScrollY(window.scrollY);
      if (isActive) requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [isActive]);

  const stopScroll = () => setIsActive(false);
  const startScroll = () => setIsActive(true);

  return { scrollY, stopScroll, startScroll };
}