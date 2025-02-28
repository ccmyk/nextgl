'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform } from 'ogl';

// Create WebGL Context
const WebGLContext = createContext(null);

// Custom hook to use the WebGL context
export function useWebGL() {
  const context = useContext(WebGLContext);
  if (!context) {
    throw new Error('useWebGL must be used within a WebGLProvider');
  }
  return context;
}

// WebGL Provider Component
export function WebGLProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [effectInstances, setEffectInstances] = useState({});
  
  // Refs for WebGL objects
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);
  
  // Initialize WebGL
  useEffect(() => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'webgl-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    
    // Check WebGL support
    try {
      // Try to initialize WebGL
      const renderer = new Renderer({ 
        canvas, 
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2)
      });
      
      const gl = renderer.gl;
      const scene = new Transform();
      const camera = new Camera(gl);
      camera.position.z = 5;
      
      // Store refs
      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      canvasRef.current = canvas;
      
      // Append canvas to body
      document.body.appendChild(canvas);
      
      // Handle resize
      const handleResize = () => {
        if (renderer && camera) {
          renderer.setSize(window.innerWidth, window.innerHeight);
          // Update camera aspect ratio
          camera.perspective({
            aspect: window.innerWidth / window.innerHeight,
          });
        }
      };
      
      // Create resize observer
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(document.body);
      
      // Initial resize
      handleResize();
      
      // Animation loop
      const animate = () => {
        if (renderer && scene && camera) {
          renderer.render({ scene, camera });
        }
        rafRef.current = requestAnimationFrame(animate);
      };
      
      // Start animation loop
      animate();
      
      // Set ready state
      setIsReady(true);
      setIsSupported(true);
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      setIsSupported(false);
    }
    
    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Initialize WebGL for specific canvas elements
  const initializeWebGL = async (canvas, options = {}) => {
    if (!canvas || !isSupported) return null;
    
    try {
      const { effect = '', text = '', position = { x: 0, y: 0 } } = options;
      
      // Dynamically import the effect module
      let effectModule;
      switch (effect) {
        case '💬':
          effectModule = await import('@/components/gl/\uD83D\uDCAC/base');
          break;
        case '🔥':
          effectModule = await import('@/components/gl/\uD83D\uDD25/base');
          break;
        case '🎢':
          effectModule = await import('@/components/gl/\uD83C\uDFA2/base');
          break;
        case '🧮':
          effectModule = await import('@/components/gl/\uD83E\uDDEE/base');
          break;
        case '🖼':
          effectModule = await import('@/components/gl/\uD83D\uDDBC/base');
          break;
        case '⌛️':
          effectModule = await import('@/components/gl/effects/⌛️/base');
          break;
        case '👩‍⚖️':
          effectModule = await import('@/components/gl/effects/👩‍⚖️/base');
          break;
        case '🏜':
          effectModule = await import('@/components/gl/\uD83C\uDFDC/base');
          break;
        default:
          console.warn(`Effect ${effect} not found`);
          return null;
      }
      
      // Create a new renderer for this canvas
      const renderer = new Renderer({ 
        canvas, 
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2)
      });
      
      const gl = renderer.gl;
      const scene = new Transform();
      const camera = new Camera(gl);
      camera.position.z = 5;
      
      // Initialize the effect
      const effectInstance = new effectModule.default({
        el: canvas,
        renderer,
        scene,
        cam: camera,
        text,
        pos: position
      });
      
      // Store the effect instance
      setEffectInstances(prev => ({
        ...prev,
        [canvas.id || `canvas-${Object.keys(prev).length}`]: effectInstance
      }));
      
      // Handle resize
      const handleResize = () => {
        if (renderer && camera) {
          const rect = canvas.getBoundingClientRect();
          renderer.setSize(rect.width, rect.height);
          // Update camera aspect ratio
          camera.perspective({
            aspect: rect.width / rect.height,
          });
          
          // Update effect if it has an onResize method
          if (effectInstance && typeof effectInstance.onResize === 'function') {
            effectInstance.onResize({
              width: rect.width,
              height: rect.height
            });
          }
        }
      };
      
      // Create resize observer for this canvas
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);
      
      // Initial resize
      handleResize();
      
      // Animation loop for this canvas
      const animate = () => {
        if (renderer && scene && camera) {
          // Update effect if it has an update method
          if (effectInstance && typeof effectInstance.update === 'function') {
            effectInstance.update();
          }
          
          renderer.render({ scene, camera });
        }
        requestAnimationFrame(animate);
      };
      
      // Start animation loop
      animate();
      
      return effectInstance;
    } catch (error) {
      console.error('WebGL initialization failed for canvas:', error);
      return null;
    }
  };
  
  // Context value
  const value = {
    isReady,
    isSupported,
    renderer: rendererRef.current,
    scene: sceneRef.current,
    camera: cameraRef.current,
    canvas: canvasRef.current,
    initializeWebGL,
    effectInstances
  };
  
  return (
    <WebGLContext.Provider value={value}>
      {children}
    </WebGLContext.Provider>
  );
}
