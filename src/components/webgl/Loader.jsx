// src/components/webgl/Loader.jsx

'use client';

import { useRef, useEffect } from 'react';
import { useWebglLoader } from '@/hooks/webgl/useWebglLoader';

export default function WebglLoader() {
  const canvasRef = useRef(null);
  const { initializeWebGL } = useWebglLoader(canvasRef);

  useEffect(() => {
    if (canvasRef.current) {
      initializeWebGL();
    }
  }, [initializeWebGL]);

  return (
    <canvas
      ref={canvasRef}
      className="glF"
      data-temp="loader"
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}