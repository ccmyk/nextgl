// src/hooks/useScrollAnimation.js
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

/**
 * Refactored from: /main🐙🐙🐙/anims.js and /views👁️👁️👁️/**/*projects.js
* Controls scroll-triggered GSAP animations for text and section elements.
*/
export default function useScrollAnimation(ref, options = {}) {
  useEffect(() => {
    const el = ref?.current;
    if (!el || typeof window === 'undefined') return;

    // === TEXT PREP ===
    if (el.classList.contains('Atext')) {
      new SplitType(el.querySelectorAll('.Atext_el, p'), { types: 'lines' });
      el.querySelectorAll('.line').forEach((line, i) => {
        line.dataset.params = i * 0.15;
        splitAndFakeChars(line);
      });
    } else {
      new SplitType(el, { types: 'chars,words' });
      splitAndFakeChars(el);
    }

    // === TEXT ANIM ===
    const chars = el.querySelectorAll('.char');
    if (!chars.length) return;

    const anim = gsap.timeline({
      paused: true,
      onComplete: () => el.classList.add('ivi'),
    });

    const params = parseParams(el.dataset.params || '0,3');
    const baseDelay = params[0];
    const times = [0.3, 0.05, 0.16, 0.05, 0.016];

    anim.set(el, { opacity: 1 }, 0);

    chars.forEach((char, i) => {
      const n = char.querySelector('.n');
      const fEls = char.querySelectorAll('.f');

      anim.set(char, { opacity: 1 }, 0);
      if (n) {
        anim.to(n, {
          opacity: 1,
          duration: times[0],
          ease: 'power4.inOut',
          immediateRender: false,
        }, i * times[1] + baseDelay);
      }

      fEls.forEach((f, u) => {
        anim
          .set(f, { opacity: 0, display: 'block' }, 0)
          .fromTo(
            f,
            { scaleX: 1, opacity: 1 },
            {
              scaleX: 0,
              opacity: 0,
              duration: times[2],
              ease: 'power4.inOut',
              immediateRender: false,
            },
            baseDelay + i * times[3] + (u + 1) * times[4]
          )
          .set(f, { display: 'none' }, '>');
      });
    });

    anim.play();
  }, [ref]);
}

function splitAndFakeChars(el, l = 2) {
  const fakes = '##·$%&/=€|()@+09*+]}{[';
  const fakesLength = fakes.length - 1;

  el.querySelectorAll('.char').forEach((char) => {
    char.innerHTML = `<span class="n">${char.innerHTML}</span>`;
    for (let u = 0; u < l; u++) {
      const rnd = Math.floor(Math.random() * fakesLength);
      char.insertAdjacentHTML(
        'afterbegin',
        `<span class="f" aria-hidden="true">${fakes[rnd]}</span>`
      );
    }
  });

  el.style.opacity = 0;
}

function parseParams(str) {
  return str.split(',').map((v) => parseFloat(v) || 0);
}
