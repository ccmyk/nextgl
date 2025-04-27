// src/hooks/webgl/useWebglLoader.js

import { useContext, useCallback } from 'react';
import { AppEventsContext } from '@/context/AppEventsContext';
import { setupLoaderScene } from '@/webgl/components/Loader';

export function useWebglLoader(canvasRef) {
  const { emit } = useContext(AppEventsContext);

  const initializeWebGL = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      emit('glReady'); // proceed anyway
      return;
    }
    setupLoaderScene(gl);
    emit('glReady');
  }, [canvasRef, emit]);

  return { initializeWebGL };
}