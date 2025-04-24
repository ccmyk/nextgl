'use client';

import { useRef, useEffect } from 'react';
import {
  Renderer, Program, Mesh, Transform, Camera, Triangle
} from 'ogl';
import { useWebGL } from '@/webgl/core/WebGLContext';
import Pg from '@/webgl/components/Pg';
import { vertexShader, fragmentShader } from '@/webgl/components/Pg';

export function usePg({ pos = 0, touch = 0 } = {}) {
  const ref = useRef(null);
  const pgRef = useRef(null);
  const { gl, scene, camera } = useWebGL();

  useEffect(() => {
    if (!ref.current || !gl || !scene) return;
    const el = ref.current;

    // 1) Renderer & canvas
    const renderer = new Renderer({
      canvas: document.createElement('canvas'),
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    const { gl: ogl } = renderer;
    ogl.canvas.classList.add('glPg');
    el.parentNode.appendChild(ogl.canvas);

    // 2) Camera & a fresh scene node
    const cam = new Camera(ogl);
    cam.position.z = 5;
    const sceneNode = new Transform();

    // 3) Full-screen triangle
    const tri = new Triangle(ogl);

    // 4) Program
    const program = new Program(ogl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uLoad:  { value: 0 },
        uZoom:  { value: 0 },
        uMove:  { value: 0 },
        tMap:   { value: null },    // user will supply later if needed
        uCover: { value: [0,0] },
        uMouse: { value: 0 },
        uTextureSize: { value: [0,0] }
      },
      transparent: true,
    });

    // 5) Mesh
    const mesh = new Mesh(ogl, { geometry: tri, program });
    mesh.setParent(sceneNode);

    // 6) Instantiate Pg effect
    pgRef.current = new Pg({
      el,
      pos,
      renderer,
      mesh,
      scene: sceneNode,
      cam,
      touch,
      canvas: ogl.canvas
    });
    pgRef.current.onResize(
      { w: window.innerWidth, h: window.innerHeight },
      { w: window.innerWidth, h: window.innerHeight }
    );

    // 7) Resize observer
    const onResize = () =>
      pgRef.current.onResize(
        { w: window.innerWidth, h: window.innerHeight },
        { w: window.innerWidth, h: window.innerHeight }
      );
    window.addEventListener('resize', onResize);

    // 8) IntersectionObserver
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => pgRef.current.check(e)),
      { threshold: 0.1 }
    );
    obs.observe(el);

    // 9) Render loop
    let frame;
    const loop = t => {
      pgRef.current.update(t, null, pos);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      obs.disconnect();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      pgRef.current.removeEvents();
    };
  }, [gl, scene]);

  return { containerRef: ref };
}