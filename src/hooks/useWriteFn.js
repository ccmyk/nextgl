// src/hooks/useWriteFn.js
import { useEffect } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

/**
 * Exactly mirrors legacy main/anims.js writeFn logic.
 * @param {React.RefObject<HTMLElement>} ref 
 * @param {0|1|-1} state   0=setup split, 1=enter, -1=exit
 */
export function useWriteFn(ref, state = 1) {
  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;
    let tl;

    // Recursively split and insert fake chars
    async function writeCt(el) {
      const fakes = '##·$%&/=€|()@+09*+]}{[';
      if (el.classList.contains('Atext')) {
        // split into lines
        const spty = new SplitType(el, { types: 'lines' });
        const lines = el.querySelectorAll('.line');
        for (let [i, line] of Array.from(lines).entries()) {
          // legacy used dataset params per line
          line.dataset.params = `${i * 0.15},3`;
          await writeCt(line);
        }
      } else if (el.classList.contains('Aline')) {
        // only split into lines
        new SplitType(el, { types: 'lines' });
      } else {
        // split into chars + words, then append fakes
        const spty = new SplitType(el, { types: 'chars, words' });
        const chars = el.querySelectorAll('.char');
        chars.forEach(charEl => {
          const spanF = document.createElement('span');
          spanF.className = 'f';
          spanF.textContent = fakes[Math.floor(Math.random() * fakes.length)];
          charEl.appendChild(spanF);
        });
      }
      el.style.opacity = 0;
    }

    // main runner
    async function run() {
      // STATE 0: just split
      if (state === 0) {
        await writeCt(parent);
      }
      // STATE 1: enter
      else if (state === 1) {
        if (!parent.querySelector('.char')) {
          await writeCt(parent);
        }
        // parse legacy params (delay, duration)
        let [delay = 0, dur = 3] = parent.dataset.params
          ? parent.dataset.params.split(',').map(Number)
          : [0, 3];
        const chars = Array.from(parent.querySelectorAll('.char'));
        tl = gsap.timeline();
        tl.set(parent, { opacity: 1 }, 0);
        chars.forEach((el, i) => {
          tl.fromTo(
            el,
            { opacity: 0, yPercent: 50 },
            { opacity: 1, yPercent: 0, duration: 0.6, ease: 'power4.inOut' },
            delay + i * 0.1
          );
        });
        tl.call(() => parent.classList.add('ivi'), null, '>-0.1');
      }
      // STATE -1: exit
      else if (state === -1) {
        const chars = Array.from(parent.querySelectorAll('.char')).reverse();
        tl = gsap.timeline();
        parent.classList.remove('ivi');
        chars.forEach((el, i) => {
          const fSpan = el.querySelector('.f');
          tl.to(fSpan, { opacity: 1, scaleX: 1, duration: 0.12, ease: 'power4.inOut' }, i * 0.04);
          tl.to(el, { opacity: 0, duration: 0.2, ease: 'power4.inOut' }, i * 0.04);
        });
        tl.to(parent, { opacity: 0, duration: 0.4, ease: 'power4.inOut' }, 0.4);
      }
    }

    run();

    return () => {
      if (tl) tl.kill();
      // revert splits
      parent.querySelectorAll('.char, .line, .word').forEach(el => {
        if (el.parentElement) {
          const txt = el.textContent || '';
          el.replaceWith(document.createTextNode(txt));
        }
      });
    };
  }, [ref, state]);
}