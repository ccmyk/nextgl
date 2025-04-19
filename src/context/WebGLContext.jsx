// src/context/WebGLContext.jsx

'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebGLContext = createContext(null);

export function WebGLProvider({ children }) {
  const glRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);
  
  useEffect(() => {
    // WebGL detection is done client-side only
    if (typeof window === 'undefined') return;
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        setIsSupported(false);
        console.warn('WebGL not supported in this browser');
        return;
      }
      
      glRef.current = gl;
    } catch (err) {
      setIsSupported(false);
      console.error('WebGL initialization failed:', err);
    }
    
    return () => {
      // Cleanup WebGL resources if needed
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const contextValue = {
    gl: glRef.current,
    scene: sceneRef.current,
    renderer: rendererRef.current,
    camera: cameraRef.current,
    isWebGLSupported: isSupported,
    setScene: (scene) => { sceneRef.current = scene; },
    setRenderer: (renderer) => { rendererRef.current = renderer; },
    setCamera: (camera) => { cameraRef.current = camera; }
  };

  return (
    <WebGLContext.Provider value={contextValue}>
      {children}
    </WebGLContext.Provider>
  );
}

export const useWebGL = () => useContext(WebGLContext);