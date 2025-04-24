'use client';

import { useRef, useEffect, useState } from 'react';
import { useWebGL } from '@/webgl/core/WebGLContext';
import Loader from '@/webgl/components/Loader';
import gsap from 'gsap';

export function useLoader() {
  const [isReady, setIsReady]   = useState(false);
  const [progress, setProgress] = useState(0);
  const effectRef = useRef(null);
  const { gl, scene } = useWebGL();

  // Instantiate Loader + GSAP progress timeline
  useEffect(() => {
    if (!gl || !scene) return;
    effectRef.current = new Loader({ gl, scene });

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => setProgress(tl.progress() * 100),
      onComplete: () => setIsReady(true),
    })
    .to({}, { duration: 0.6, ease: 'power2.inOut' })
    .to({}, { duration: 2,   ease: 'power2.inOut' }, 0)
    .to({}, { duration: 1,   ease: 'power2.inOut' }, 0.6);

    effectRef.current.start();
    tl.play();

    return () => {
      tl.kill();
      effectRef.current?.destroy();
    };
  }, [gl, scene]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      if (effectRef.current) {
        effectRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { isReady, progress, effectRef };
}