"use client";

import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import { useAppContext } from '@/components/AppInitializer';
import Title from "@/components/gl/loader/Loader.jsx";
import { setupGlobalUtils } from '@/lib/utils/animationUtils';
import HomeIntro from '@/app/home/intro/page';
import HomeIntroIO from '@/app/home/intro/io';
import { loadImages, loadVideos } from '@/lib/utils/pageLoads';
import { createIos, callIos, showIos } from '@/lib/utils/pageIos';

export default function Home() {
  const appContext = useAppContext();
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const titleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const domRef = useRef({
    el: null,
    images: null,
    videos: null,
    ios: null
  });
  const componentsRef = useRef({
    intro: null
  });

  useEffect(() => {
    // Setup global utilities for legacy compatibility
    setupGlobalUtils();
    
    const initPage = async () => {
      try {
        // Get main element
        const mainElement = document.querySelector('main');
        if (!mainElement) return;
        
        domRef.current = {
          el: mainElement,
          images: null,
          videos: null,
          ios: null
        };
        
        // Check device capabilities
        const { browserInfo } = appContext || {};
        const device = browserInfo?.device || 0;
        const webgl = browserInfo?.webgl || 0;
        
        // Initialize WebGL if enabled
        if (webgl !== 0 && canvasRef.current) {
          initWebGL();
        } else {
          // Load media if WebGL is disabled
          await loadImages.call({ DOM: domRef.current });
          await loadVideos.call({ DOM: domRef.current });
        }
        
        // Initialize components
        await createComponents();
        
        // Create and initialize intersection observers
        await createIos.call({ 
          DOM: domRef.current,
          iOpage: (animobj) => {
            if (animobj.el.classList.contains('iO-scroll')) {
              // Scroll animation logic would go here
              // animobj.class = new Scroll(animobj, device);
            } else if (animobj.el.classList.contains('iO-home')) {
              animobj.class = new HomeIntroIO(animobj, device);
            }
            return animobj;
          }
        });
        
        callIos.call({ DOM: domRef.current, isVisible: 1 });
        showIos.call({ DOM: domRef.current });
        
        // Start intro animation
        if (componentsRef.current.intro) {
          componentsRef.current.intro.start();
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing home page:', error);
      }
    };
    
    const createComponents = async () => {
      // Initialize intro component if it exists
      const introElement = domRef.current.el.querySelector('.home_intro');
      if (introElement) {
        componentsRef.current.intro = new HomeIntro(
          introElement, 
          appContext?.browserInfo?.device || 0
        );
      }
    };
    
    const initWebGL = () => {
      // Initialize WebGL renderer
      const canvas = canvasRef.current;
      const renderer = new Renderer({ canvas });
      rendererRef.current = renderer;
      
      const gl = renderer.gl;
      
      // Handle resize
      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
  
      // Create geometry and shader program
      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: `
          attribute vec2 uv;
          attribute vec3 position;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragment: `
          precision highp float;
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(vUv, 0.0, 1.0);
          }
        `,
      });
  
      // Create mesh
      const mesh = new Mesh(gl, { geometry, program });
  
      // Initialize Title component
      titleRef.current = new Title({
        el: canvas,
        renderer,
        mesh,
        scene: renderer.scene,
        cam: renderer.camera,
      });
  
      // Animation loop
      let animationFrame;
      const animate = (time) => {
        if (titleRef.current) {
          titleRef.current.update(time, 1, new Vec2());
        }
        animationFrame = requestAnimationFrame(animate);
      };
  
      // Start animation
      animate(0);
      
      // Return cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        if (renderer && renderer.gl) {
          // Clean up WebGL resources
          geometry.remove();
          program.remove();
          mesh.remove();
          renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      };
    };
    
    // Handle page exit animation
    const handleBeforeUnload = () => {
      // Any exit animations would go here
    };
    
    // Initialize the page
    const cleanup = initPage();
    
    // Add event listener for navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Run exit animation
      handleBeforeUnload();
    };
  }, [appContext]);

  return (
    <div className="home-container">
      {!isLoaded && <div className="loading">Loading home...</div>}
      <canvas 
        ref={canvasRef} 
        className="webgl-canvas"
        style={{ 
          width: '100%', 
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }} 
      />
    </div>
  );
}