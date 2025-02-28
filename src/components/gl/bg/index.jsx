// src/components/gl/bg/index.jsx
// 🏜️
"use client";

import { useRef, useEffect } from "react";
import { Renderer, Camera, Transform, Plane, Program, Vec2 } from "ogl";
import frag from "./shaders/frag.main.glsl";
import vert from "./shaders/vert.main.glsl";

const Background = () => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize WebGL Renderer
    const renderer = new Renderer({ canvas: canvasRef.current, dpr: 2 });
    const gl = renderer.gl;
    rendererRef.current = renderer;

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 5);

    const scene = new Transform();

    const geometry = new Plane(gl, {
      width: 2,
      height: 2,
      widthSegments: 10,
      heightSegments: 10,
    });

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
      },
    });

    const mesh = new Plane(gl, { program });
    scene.add(mesh);

    let time = 0;
    const render = () => {
      time += 0.01;
      program.uniforms.uTime.value = time;
      renderer.render({ scene, camera });
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-canvas" />;
};

export default Background;