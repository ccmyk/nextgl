// home/page.js
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import Title from "@/components/gl/loader/base.js";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new Renderer({ canvas });
    const gl = renderer.gl;

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

    const mesh = new Mesh(gl, { geometry, program });

    const title = new Title({
      el: canvasRef.current,
      renderer,
      mesh,
      scene: renderer.scene,
      cam: renderer.camera,
    });

    const animate = (time) => {
      title.update(time, 1, new Vec2());
      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}