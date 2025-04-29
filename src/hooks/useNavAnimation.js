// src/hooks/useNavAnimation.js

import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Mirror legacy Nav open/close anims exactly.
 * • Burger transforms are handled via CSS transitions below.
 * • Logo and links fade/slide with the same timing & easing.
 *
 * @param {boolean} isOpen
 */
export function useNavAnimation(isOpen) {
  useEffect(() => {
    // GSAP timeline defaults to exactly .6s duration & cubic-bezier(.55,0,.1,1)
    const ts = 0.6;
    const ez = 'cubic-bezier(.55,0,.1,1)';
    const tl = gsap.timeline();

    // 1) Toggle the CSS class that drives the burger spans' CSS transitions
    document.documentElement.classList.toggle('act-menu', isOpen);

    // 2) Animate the logo slide (legacy moved it 20px over 0.6s after 0.4s)
    tl.to(
      '.nav_logo',
      {
        x: isOpen ? 20 : 0,
        duration: ts,
        ease: ez,
        delay: isOpen ? 0.4 : 0,
      },
      0
    );

    // 3) Fade and slide each link in/out with a 0.1s stagger
    const links = Array.from(document.querySelectorAll('.nav_right a'));
    links.forEach((el, i) => {
      tl.to(
        el,
        {
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -20,
          duration: ts,
          ease: ez,
        },
        isOpen ? 0.6 + i * 0.1 : i * 0.1
      );
    });

    return () => tl.kill();
  }, [isOpen]);
}