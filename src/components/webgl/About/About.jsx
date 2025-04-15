// src/components/webgl/About/About.jsx


import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';

// Import shader code
import msdfShader from './shaders/msdf.frag.glsl';
import parentShader from './shaders/parent.frag.glsl';

// Utility functions from the original code
const lerp = (start, end, t) => start * (1 - t) + end * t;
const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

export function About({ text, font, size, color = [1, 1, 1] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(-1);
  const [isReady, setIsReady] = useState(0);
  const [isStopped, setIsStopped] = useState(0);
  
  const programRef = useRef(null);
  const textureRef = useRef(null);
  const bufferRef = useRef(null);
  const meshRef = useRef(null);
  const postRef = useRef(null);
  const canvasRef = useRef(null);
  const animStartRef = useRef(null);
  const animMouseRef = useRef(null);
  const animCtrRef = useRef(null);
  
  const ctrRef = useRef({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0
  });
  
  const normRef = useRef(0);
  const endRef = useRef(0);
  const lerpValueRef = useRef(0.6);
  const boundRef = useRef([0, 0, 0, 0]);
  const viewportRef = useRef([0, 0]);
  const screenRef = useRef([0, 0]);
  
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
    
    // Create MSDF shader program
    const msdfProgram = shaderManager.createProgram(
      `#version 300 es
       precision highp float;
       attribute vec2 position;
       attribute vec2 uv;
       varying vec2 vUv;
       varying vec2 vUvR;
       
       void main() {
         vUv = uv;
         vUvR = position;
         gl_Position = vec4(position, 0.0, 1.0);
       }`,
      msdfShader,
      'msdf'
    );
    
    // Create parent shader program
    const parentProgram = shaderManager.createProgram(
      `precision highp float;
       attribute vec2 position;
       attribute vec2 uv;
       varying vec2 vUv;
       
       void main() {
         vUv = uv;
         gl_Position = vec4(position, 0.0, 1.0);
       }`,
      parentShader,
      'parent'
    );
    
    // Set up animation timelines with correct easing types
    animStartRef.current = gsap.timeline({ paused: true })
      .set(canvas, { opacity: 1 }, 0)
      .fromTo(parentProgram.uniforms.uStart,
        { value: -.92 },
        {
          value: 1.,
          duration: 4,
          ease: 'power2.inOut' // Using power2.inOut as specified
        },
        0
      );
    
    animMouseRef.current = gsap.timeline({ paused: true })
      .fromTo(parentProgram.uniforms.uMouse,
        { value: -1 },
        {
          value: 1.2,
          duration: 1,
          ease: 'none'
        },
        0
      );
    
    animCtrRef.current = gsap.timeline({ paused: true });
    
    // Store references
    programRef.current = msdfProgram;
    postRef.current = parentProgram;
    
    // Set up initial state
    setIsReady(1);
  };
  
  // Start animation
  const start = () => {
    if (isActive === 1) return false;
    
    if (isActive === -1) {
      animStartRef.current.play();
    }
    
    setIsActive(1);
  };
  
  // Stop animation
  const stop = () => {
    endRef.current = 0;
    ctrRef.current.prog = 0;
    ctrRef.current.progt = 0;
    
    if (animCtrRef.current) {
      animCtrRef.current.progress(0);
    }
    
    if (isActive < 1) return false;
    
    setIsActive(0);
  };
  
  // Update animation
  const updateAnim = () => {
    ctrRef.current.progt = parseFloat(ctrRef.current.current / ctrRef.current.limit).toFixed(3);
    ctrRef.current.prog = lerp(ctrRef.current.prog, ctrRef.current.progt, 0.015);
    
    if (animCtrRef.current) {
      animCtrRef.current.progress(ctrRef.current.prog);
    }
  };
  
  // Update Y position
  const updateY = (y = 0) => {
    if (ctrRef.current.stop !== 1) {
      ctrRef.current.current = y - ctrRef.current.start;
      ctrRef.current.current = clamp(0, ctrRef.current.limit, ctrRef.current.current);
    }
  };
  
  // Handle mouse events
  const handleMouseEnter = () => {
    setIsStopped(0);
    lerpValueRef.current = 0.02;
  };
  
  const handleMouseMove = (e) => {
    if (e.touches) {
      normRef.current = e.touches[0] ? (e.touches[0].pageX - boundRef.current[0]) : 0;
      normRef.current = normRef.current / boundRef.current[3];
    } else {
      normRef.current = e.layerY / boundRef.current[3];
    }
    
    normRef.current = clamp(0, 1, normRef.current);
    normRef.current = parseFloat(normRef.current).toFixed(3);
  };
  
  const handleMouseLeave = (e) => {
    lerpValueRef.current = 0.01;
    
    if (e.touches) {
      normRef.current = e.touches[0] ? (e.touches[0].pageX - boundRef.current[0]) : 0;
      normRef.current = normRef.current / boundRef.current[3];
    } else {
      normRef.current = e.layerY / boundRef.current[3];
    }
    
    normRef.current = parseFloat(normRef.current).toFixed(3);
  };
  
  // Animation loop
  useEffect(() => {
    if (!isReady) return;
    
    let animationFrameId;
    
    const animate = (time) => {
      // Update mouse position
      endRef.current = lerp(endRef.current, normRef.current, lerpValueRef.current);
      
      if (animMouseRef.current) {
        animMouseRef.current.progress(endRef.current);
      }
      
      // Update animation
      if (ctrRef.current.actual !== 0) {
        updateY(ctrRef.current.actual);
      }
      
      if (ctrRef.current.stop !== 1) {
        updateAnim();
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady]);
  
  // Set up event listeners
  useEffect(() => {
    if (!isReady) return;
    
    const element = ref.current;
    if (!element) return;
    
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isReady, ref]);
  
  // Handle resize
  const handleResize = (viewport, screen) => {
    viewportRef.current = [viewport.w, viewport.h];
    screenRef.current = [screen.w, screen.h];
    
    const rect = ref.current.getBoundingClientRect();
    boundRef.current = [rect.x, rect.y, rect.width, rect.height];
    
    let offset = 0;
    let limit = screen.h * 0.2;
    
    // Set control values based on viewport
    ctrRef.current.start = parseInt(rect.y - screen.h + window.scrollY + limit);
    ctrRef.current.limit = parseInt(rect.height + offset + limit);
  };
  
  return (
    <div ref={ref} className="about-component">
      <WebGLCanvas
        width={size.width}
        height={size.height}
        onInit={handleInit}
      />
      <div className="about-text">{text}</div>
    </div>
  );
} 