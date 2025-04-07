// src/lib/animations/views.js
// Controls writing and appearance of text blocks on view entry

'use client';

// VIEWS

import Home from '@/app/home/page.js'
import Projects from '@/app/projects/page.js'
import ProjectDetail from '@/app/projects/[slug]/page.js'
import Project from '@/app/project/page.js'
import About from '@/app/about/page.js'
import Error from '@/app/error/page.js'
import Playground from '@/app/playground/page.js'

import { useEffect } from 'react';
import { writeFn } from './anims';

/**
 * Attaches an IntersectionObserver to trigger GSAP writing animations
 * on elements with the `Awrite` class when they enter view.
 *
 * @param {React.RefObject} ref - Ref to container element with animatable children
 */
export function useViewAnimations(ref) {
  useEffect(() => {
    if (!ref?.current) return;

    const targets = ref.current.querySelectorAll('.Awrite');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.classList.contains('Awrite')
          ) {
            entry.target.classList.add('inview');
            writeFn(entry.target, 1);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      targets.forEach((el) => observer.unobserve(el));
    };
  }, [ref]);

  return null;
}
