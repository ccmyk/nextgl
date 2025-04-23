'use client';

import { useRef, useEffect } from 'react';
import { useLoader } from '@/hooks/webgl/useLoader';
import gsap from 'gsap';

export default function Loader() {
  const { isReady, progress, effectRef } = useLoader();
  const containerRef = useRef(null);
  const numberRef    = useRef(null);
  const textRef      = useRef(null);

  // animate “000 → 42 → 90” exactly like legacy
  useEffect(() => {
    if (!numberRef.current || !textRef.current) return;

    const obj = { num: 0 };
    const tl = gsap.timeline({ paused: true })
      .fromTo(obj, { num: 0 }, {
        num: 42,
        duration: 2,
        ease: 'none',
        onUpdate: () => {
          numberRef.current.textContent = obj.num.toFixed(0).padStart(3, '0');
        }
      }, 0)
      .to(obj, {
        num: 90,
        duration: 8,
        ease: 'power2.inOut',
        onUpdate: () => {
          numberRef.current.textContent = obj.num.toFixed(0).padStart(3, '0');
        }
      }, 2.2)
      .play();

    // text “Loading”“Please Wait” char‐anim exactly as legacy
    textRef.current
      .querySelectorAll('.Awrite')
      .forEach(el => {
        const ev = new CustomEvent('anim', { detail: { state: 0, el } });
        document.dispatchEvent(ev);
        ev.detail.state = 1;
        document.dispatchEvent(ev);
      });

    return () => tl.kill();
  }, []);

  // hide loader when webgl is ready
  useEffect(() => {
    if (!isReady) return;
    // count → 100
    gsap.to({ num: progress }, {
      num: 100,
      duration: 0.49,
      ease: 'power2.inOut',
      onUpdate() {
        numberRef.current.textContent = this.targets()[0].num
          .toFixed(0)
          .padStart(3, '0');
      }
    });
    // fade out container
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut',
      onComplete: () => containerRef.current?.remove()
    });
  }, [isReady, progress]);

  return (
    <div
      ref={containerRef}
      className="loader fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="loader_cnt">
        <div ref={numberRef} className="loader_tp">000</div>
        <div ref={textRef} className="loader_text">
          <div className="Awrite">Loading</div>
          <div className="Awrite">Please Wait</div>
        </div>
      </div>
      <div className="loader_bg" />
    </div>
  );
}