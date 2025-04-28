// src/hooks/webgl/useWebglLoader.js

import { useContext, useRef, useEffect } from 'react';
import { AppEventsContext } from '@/context/AppEventsContext';
import { setupLoaderScene } from '@/webgl/components/Loader';

export function useWebglLoader(canvasRef, loaderOptions = {}) {
  const { emit } = useContext(AppEventsContext);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      emit('glReady');
      return;
    }

    // Initialize scene and capture cleanup
    cleanupRef.current = setupLoaderScene(gl, loaderOptions);
    emit('glReady');

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [canvasRef, emit, loaderOptions]);
}