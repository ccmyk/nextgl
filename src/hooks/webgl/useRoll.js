'use client';

import { useRef, useEffect } from 'react';
import { useWebGL } from '@/webgl/core/WebGLContext';
import Roll from '@/webgl/components/Roll';
import { webgl } from '@/webgl/core/WebGLManager';

export function useRoll({ selector }) {
  const containerRef = useRef(null);
  const rollRef      = useRef(null);
  const { gl, scene, camera } = useWebGL();

  useEffect(() => {
    if (!gl || !scene || !camera) return;
    const el = containerRef.current.querySelector(selector);
    // collect the two medias in DOM order
    const medias = Array.from(el.querySelectorAll('img,video')).slice(0,2);
    rollRef.current = new Roll({ gl, scene, camera, medias });
    webgl.registerComponent('Roll', rollRef.current);
    rollRef.current.start();

    return () => {
      webgl.unregisterComponent('Roll');
      rollRef.current.destroy();
    };
  }, [gl, scene, camera, selector]);

  // handle resize
  useEffect(() => {
    const onResize = () => {
      if (rollRef.current) {
        rollRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return containerRef;
}