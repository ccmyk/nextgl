// components/providers/WebGLProvider.jsx
import { createContext, useContext, useEffect, useRef } from 'react';
import { createWebGLContext } from '@/lib/webgl/context';

const WebGLContext = createContext(null);

export function WebGLProvider({ children }) {
  const glRef = useRef(null);
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    try {
      const gl = createWebGLContext(canvas);
      glRef.current = gl;
    } catch (err) {
      console.error('WebGL initialization failed:', err);
    }
  }, []);

  return (
    <WebGLContext.Provider value={glRef.current}>
      {children}
    </WebGLContext.Provider>
  );
}

export const useWebGL = () => useContext(WebGLContext);