// src/hooks/useWriteFn.js
import { useEffect } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

export function useWriteFn(ref, state = 0) {
  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;
    let tl;

    async function writeCt(el) {
      const fakes = '##·$%&/=€|()@+09*+]}{[';
      if (el.classList.contains('Atext')) {
        // Split lines, then recurse into each .line
        const spty = new SplitType(el, { types: 'lines' });
        const lines = el.querySelectorAll('.line');
        for (let [i, line] of Array.from(lines).entries()) {
          line.dataset.params = `${i * 0.15},3`;
          await writeCt(line);
        }
      } else if (el.classList.contains('Aline')) {
        // Just split lines once
        new SplitType(el, { types: 'lines' });
      } else {
        const spty = new SplitType(el, { types: 'chars, words' });
        const chars = el.querySelectorAll('.char');
        chars.forEach((charEl) => {
          const spanF = document.createElement('span');
          spanF.className = 'f';
          const rnd = Math.floor(Math.random() * fakes.length);
          spanF.textContent = fakes[rnd];
          charEl.appendChild(spanF);
        });
      }
      el.style.opacity = 0;
    }

    async function runWriteFn() {
      // STATE 0: just split text & hide
      if (state === 0) {
        await writeCt(parent);
      }
      // STATE 1: entry animation
      else if (state === 1) {
        // Ensure split already done
        if (!parent.querySelector('.char')) {
          await writeCt(parent);
        }

        // Parse params (delay, duration)
        let [delay = 0, dur = 3] = parent.dataset.params
          ? parent.dataset.params.split(',').map(Number)
          : [0, 3];

        const chars = Array.from(parent.querySelectorAll('.char'));
        tl = gsap.timeline({ paused: true });
        tl.set(parent, { opacity: 1 }, 0);

        chars.forEach((charEl, i) => {
          tl.fromTo(
            charEl.querySelector('.char, .char > *') || charEl,
            { opacity: 0, yPercent: 50 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.6,
              ease: 'power4.inOut'
            },
            delay + i * 0.1
          );
        });

        tl.call(() => parent.classList.add('ivi'), null, '>-0.1');
        tl.play();
      }
      // STATE -1: exit animation
      else if (state === -1) {
        const chars = Array.from(parent.querySelectorAll('.char')).reverse();
        tl = gsap.timeline({ paused: true });
        parent.classList.remove('ivi');

        chars.forEach((charEl, i) => {
          const fSpan = charEl.querySelector('.f');
          tl.to(
            fSpan,
            { opacity: 1, scaleX: 1, duration: 0.12, ease: 'power4.inOut' },
            i * 0.04
          );
          tl.to(
            charEl,
            { opacity: 0, duration: 0.2, ease: 'power4.inOut' },
            i * 0.04
          );
        });

        tl.to(parent, { opacity: 0, duration: 0.4, ease: 'power4.inOut' }, 0.4);
        tl.play();
      }
    }

    runWriteFn();

    return () => {
      if (tl) tl.kill();
      // revert SplitType splits
      const revertEls = parent.querySelectorAll('.char, .line, .word');
      revertEls.forEach((el) => {
        // If SplitType left a wrapper, remove it
        if (el.classList.contains('char') && el.parentElement) {
          const txt = el.textContent || '';
          el.replaceWith(document.createTextNode(txt));
        }
      });
    };
  }, [ref, state]);
}