"use client";

import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import { useAppContext } from '@/components/AppInitializer';
import Title from "@/components/gl/loader/Loader.jsx";

export default function Home() {
  const appContext = useAppContext();
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const titleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    
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
    setIsLoaded(true);

    // Cleanup
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
  }, []);

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