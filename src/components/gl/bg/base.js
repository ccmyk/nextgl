// src/components/gl/bg/base.js
// 🏜

"use client";

import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Plane, Program, Vec2 } from "ogl";
import Base from "./base";
import frag from "./shaders/frag.main.glsl";
import vert from "./shaders/vert.main.glsl";

const Background = () => {
  const canvasRef = useRef(null);
  const webglRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize WebGL Renderer
    const renderer = new Renderer({ canvas: canvasRef.current, dpr: 2 });
    const gl = renderer.gl;

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 5);

    const scene = new Transform();

    // Create Geometry
    const geometry = new Plane(gl, {
      width: 2,
      height: 2,
      widthSegments: 10,
      heightSegments: 10,
    });

    // Create Shader Program
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
      },
    });

    // Create WebGL Mesh
    const mesh = new Base({
      el: canvasRef.current,
      pos: new Vec2(0, 0),
      renderer,
      mesh: geometry,
      canvas: gl.canvas,
    });

    mesh.start();
    scene.add(mesh.mesh);

    webglRef.current = { renderer, camera, scene, mesh };

    let time = 0;
    const render = () => {
      time += 0.01;
      mesh.update?.(time);
      renderer.render({ scene, camera });
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      mesh.onResize?.({ w, h }, { w, h });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);

      if (mesh.removeEvents) mesh.removeEvents();
      if (renderer.gl) {
        renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-canvas" />;
};

export default Background;