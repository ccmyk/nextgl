// src/components/gl/loader/Loader.jsx
// ⌛️ React OGL Component - Handles WebGL loader animations

import { useEffect, useRef } from 'react';
import { Renderer, Geometry, Mesh, Program, Triangle, Vec2 } from 'ogl';
import { gsap } from 'gsap';

// Shaders
import fragShader from '@/components/gl/loader/shaders/frag.main.glsl';
import vertShader from '@/components/gl/loader/shaders/vert.main.glsl';

const Loader = ({ el, pos }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const activeRef = useRef(-1);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize WebGL Renderer
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
      width: window.innerWidth,
      height: window.innerHeight,
      canvas: canvasRef.current,
    });

    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.canvas.classList.add('glLoader');

    // Create Geometry
    const geometry = new Triangle(gl);

    // Create Shader Program
    const program = new Program(gl, {
      vertex: vertShader,
      fragment: fragShader,
      uniforms: {
        uTime: { value: 0 },
        uStart0: { value: 1 },
        uStart1: { value: 0.5 },
        uStart2: { value: 1 },
        uStartX: { value: 0 },
        uStartY: { value: 0.1 },
        uMultiX: { value: -0.4 },
        uMultiY: { value: 0.45 },
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
      },
    });

    programRef.current = program;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    // Append canvas to parent
    if (!el.contains(gl.canvas)) {
      el.appendChild(gl.canvas);
    }

    const animate = (time) => {
      if (activeRef.current === 1) {
        program.uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
      }
      requestAnimationFrame(animate);
    };

    // Start animation loop
    activeRef.current = 1;
    animate(0);

    return () => {
      activeRef.current = -1;
      gl.clear(gl.COLOR_BUFFER_BIT);
    };
  }, [el]);

  return <canvas ref={canvasRef} />;
};

export default Loader;