// src/context/WebGLContext.jsx

'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform, Vec2 } from 'ogl';

const WebGLContext = createContext(null);

export function WebGLProvider({ children }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // WebGL initialization is done client-side only
    if (typeof window === 'undefined') return;
    
    try {
      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1';
      
      // Append to body
      document.body.appendChild(canvas);
      canvasRef.current = canvas;
      
      // Initialize OGL Renderer
      const renderer = new Renderer({
        canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        alpha: true,
        dpr: Math.min(window.devicePixelRatio, 2), // Cap DPR for performance
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      glRef.current = renderer.gl;
      rendererRef.current = renderer;
      
      // Create scene graph
      const scene = new Transform();
      sceneRef.current = scene;
      
      // Create camera
      const camera = new Camera(renderer.gl, {
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100,
      });
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;
      
      // Handle resize
      const handleResize = () => {
        const { innerWidth: width, innerHeight: height } = window;
        renderer.setSize(width, height);
        camera.perspective({
          aspect: width / height,
        });
      };
      
      // Use ResizeObserver for more efficient resizing
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(document.body);
      
      setIsReady(true);
      
    } catch (err) {
      setIsSupported(false);
      console.error('WebGL initialization failed:', err);
    }
    
    return () => {
      // Cleanup WebGL resources
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current);
      }
    };
  }, []);

  // Setup render loop in a separate useEffect to ensure refs are current
  useEffect(() => {
    if (!isReady || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    const render = (t) => {
      // Update any animations or time-based values here
      
      // Render the scene
      rendererRef.current.render({
        scene: sceneRef.current,
        camera: cameraRef.current,
      });
      
      rafRef.current = requestAnimationFrame(render);
    };
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(render);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isReady]);

  const contextValue = {
    gl: glRef.current,
    scene: sceneRef.current,
    renderer: rendererRef.current,
    camera: cameraRef.current,
    canvas: canvasRef.current,
    isReady,
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

export const useWebGL = () => {
  const context = useContext(WebGLContext);
  
  if (context === null) {
    throw new Error('useWebGL must be used within a WebGLProvider');
  }
  
  return context;
};
