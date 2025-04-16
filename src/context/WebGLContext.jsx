import { createContext, useContext, useEffect, useRef } from 'react';

const WebGLContext = createContext(null);

export function WebGLProvider({ children }) {
  const glRef = useRef(null);
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        throw new Error('WebGL not supported');
      }
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