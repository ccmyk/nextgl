// src/hooks/useSplitTypeAnimation.js

import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to animate text with SplitType and GSAP when it enters viewport
 * @param {string} selector - CSS selector to target the element
 * @param {object} options - GSAP animation options
 */
export function useSplitTypeAnimation(selector, options = {}) {
  const splitRef = useRef(null);

  useEffect(() => {
    if (!selector) return;

    const target = document.querySelector(selector);
    if (!target) return;

    const splitInstance = new SplitType(target, { types: 'lines, words' });
    splitRef.current = splitInstance;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.from(splitInstance.words, {
      y: 40,
      opacity: 0,
      stagger: 0.03,
      ease: 'power3.out',
      ...options,
    });

    return () => {
      tl.kill();
      splitInstance.revert();
    };
  }, [selector, options]);
}
