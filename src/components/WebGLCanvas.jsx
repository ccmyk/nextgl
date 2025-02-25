"use client";
import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Plane, Program } from "ogl";
import gsap from "gsap";

export default function WebGLCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderer = new Renderer({ canvas: canvasRef.current });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);

    const camera = new Camera(gl);
    const scene = new Transform();

    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0, 1);
        }`,
      fragment: `
        precision highp float;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,
    });

    const plane = new Plane(gl, { program });
    plane.setParent(scene);

    gsap.to(plane, {
      duration: 0.8,
      opacity: 1,
      ease: "power4.inOut", //
    });

    renderer.render({ scene, camera });
  }, []);

  return <canvas ref={canvasRef} className="webgl-canvas" />;
}