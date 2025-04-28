// src/components/webgl/Loader.jsx

'use client';
import { useRef } from 'react';
import { useLoader } from '@/hooks/useLoader';
import { useWebglLoader } from '@/hooks/webgl/useWebglLoader';
import { useIOSLoader } from '@/hooks/webgl/useIOSLoader';
import { useWebGL }     from '@/context/WebGLContext';


export default function WebglLoader() {
  const canvasRef = useRef(null);
  const { progress } = useLoader();
  const webgl = useWebGL();
  useIOSLoader(webgl.iosMap, true);

  // Pass normalized progress and default offsets/multipliers
  useWebglLoader(canvasRef, {
    progressNormalized: progress / 100,
    startX: 0,
    startY: 0,
    multiX: 1,
    multiY: 1,
  });

  return (
    <canvas
      ref={canvasRef}
      className="glF"
      data-temp="loader"
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}