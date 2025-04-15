import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';

// Import shader code
import mainShader from './shaders/main.frag.glsl';

// Utility functions
const lerp = (start, end, t) => start * (1 - t) + end * t;
const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(-1);
  const [isReady, setIsReady] = useState(0);
  
  const programRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  
  // Intersection observer setup
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  // Handle visibility changes
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
      start();
    } else {
      setIsVisible(false);
      stop();
    }
  }, [inView]);
  
  // Initialize WebGL
  const handleInit = ({ gl, shaderManager, canvas }) => {
    canvasRef.current = canvas;
    
    // Create shader program
    const program = shaderManager.createProgram(
      `#version 300 es
       precision highp float;
       attribute vec2 position;
       attribute vec2 uv;
       varying vec2 vUv;
       
       void main() {
         vUv = uv;
         gl_Position = vec4(position, 0.0, 1.0);
       }`,
      mainShader,
      'footer'
    );
    
    // Set up animation timeline with correct easing type
    animRef.current = gsap.timeline({ paused: true })
      .fromTo(program.uniforms.uTime,
        { value: 0 },
        {
          value: 1,
          duration: 10,
          ease: 'power2.inOut' // Using power2.inOut as specified
        },
        0
      );
    
    // Store reference
    programRef.current = program;
    
    // Set up initial state
    setIsReady(1);
  };
  
  // Start animation
  const start = () => {
    if (isActive === 1) return false;
    
    if (isActive === -1) {
      animRef.current.play();
    }
    
    setIsActive(1);
  };
  
  // Stop animation
  const stop = () => {
    if (isActive < 1) return false;
    
    setIsActive(0);
  };
  
  // Animation loop
  useEffect(() => {
    if (!isReady) return;
    
    let animationFrameId;
    
    const animate = (time) => {
      // Update time uniform
      if (programRef.current && programRef.current.uniforms.uTime) {
        programRef.current.uniforms.uTime.value = time * 0.001;
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady]);
  
  return (
    <footer ref={ref} className="footer-component">
      <WebGLCanvas
        width="100%"
        height="100%"
        onInit={handleInit}
      />
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Eva Sánchez. All rights reserved.</p>
      </div>
    </footer>
  );
} 