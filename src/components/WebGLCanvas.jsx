"use client";
import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Plane, Program, Vec2 } from "ogl";
import gsap from "gsap";

export default function WebGLCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Renderer
    const renderer = new Renderer({ canvas: canvasRef.current });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1); // Black background

    // Camera & Scene
    const camera = new Camera(gl);
    const scene = new Transform();

    // Vertex & Fragment Shaders
    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5; // Convert from [-1,1] to [0,1]
          gl_Position = vec4(position, 0, 1);
        }
      `,
      fragment: `
        precision highp float;
        varying vec2 vUv;
        uniform float opacity;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, opacity); // Red with animated opacity
        }
      `,
      uniforms: {
        opacity: { value: 0 }, // Start fully transparent
      },
    });

    // Create Plane
    const plane = new Plane(gl, { program });
    plane.setParent(scene);

    // GSAP Animation (Fade In)
    gsap.to(program.uniforms.opacity, {
      value: 1,
      duration: 1.2,
      ease: "power2.out",
    });

    // Animation Loop
    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      renderer.render({ scene, camera });
    };
    render();

    // Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-canvas" />;
}