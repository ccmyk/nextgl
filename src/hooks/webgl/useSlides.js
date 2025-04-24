'use client';

import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Transform, Camera, Plane } from 'ogl';
import { useWebGL } from '@/webgl/core/WebGLContext';
import Slides from '@/webgl/components/Slides';
import { vertexShader, fragmentShader } from '@/webgl/components/Slides';

export function useSlides({ pos = 0, touch = 0 } = {}) {
  const ref = useRef(null);
  const slidesRef = useRef(null);
  const { gl, scene, camera } = useWebGL();

  useEffect(() => {
    if (!ref.current || !gl || !scene) return;
    const el = ref.current;

    // 1) Create a dedicated OGL Renderer & canvas
    const renderer = new Renderer({ canvas: document.createElement('canvas'), dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    const { gl: ogl } = renderer;
    ogl.canvas.classList.add('glSlides');
    el.parentNode.appendChild(ogl.canvas);

    // 2) Build a camera & a scene Transform
    const cam = new Camera(ogl);
    cam.position.set(0, 0, 5);
    const sceneNode = new Transform();

    // 3) Full-screen plane
    const geometry = new Plane(ogl);

    // 4) Program
    const program = new Program(ogl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:   { value: 0 },
        uStart:  { value: 0 },
        uEnd:    { value: 0 },
        tMap:    { value: null },
        uCover:  { value: [0, 0] },
        uTextureSize: { value: [0, 0] }
      },
      transparent: true
    });

    // 5) Mesh
    const mesh = new Mesh(ogl, { geometry, program });
    mesh.setParent(sceneNode);

    // 6) Instantiate Slides effect
    slidesRef.current = new Slides({
      el,
      pos,
      renderer,
      mesh,
      scene: sceneNode,
      cam,
      touch,
      canvas: ogl.canvas
    });
    slidesRef.current.onResize(
      { w: window.innerWidth, h: window.innerHeight },
      { w: window.innerWidth, h: window.innerHeight }
    );

    // 7) Resize handling
    const onResize = () =>
      slidesRef.current.onResize(
        { w: window.innerWidth, h: window.innerHeight },
        { w: window.innerWidth, h: window.innerHeight }
      );
    window.addEventListener('resize', onResize);

    // 8) IntersectionObserver
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => slidesRef.current.check(e)),
      { threshold: 0.1 }
    );
    obs.observe(el);

    // 9) Render loop
    let frame;
    const animate = t => {
      slidesRef.current.update(t, null, pos);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      obs.disconnect();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      slidesRef.current.removeEvents();
    };
  }, [gl, scene]);

  return { containerRef: ref };
}