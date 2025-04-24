'use client';
import { useRef, useEffect } from 'react';
import { Renderer, Transform, Camera, Text, Geometry, Texture } from 'ogl';
import { useWebGL } from '@/webgl/core/WebGLContext';
import Footer from '@/webgl/components/Footer';
import vert from '@/webgl/components/Footer/shaders/msdf.vert.glsl';
import frag from '@/webgl/components/Footer/shaders/msdf.frag.glsl';
import parent from '@/webgl/components/Footer/shaders/parent.frag.glsl';

export function useFooter({ text, letterSpacing=0, size=1 }) {
  const containerRef = useRef(null);
  const elementRef   = useRef(null);
  const footerRef    = useRef(null);
  const { gl, scene, camera } = useWebGL();

  useEffect(() => {
    const wrapper = containerRef.current;
    const el      = elementRef.current;
    if (!wrapper || !el || !gl || !scene) return;

    // 1) OGL renderer on shared canvas
    const renderer = new Renderer({
      canvas: gl.canvas,
      alpha:  true,
      dpr:    Math.min(window.devicePixelRatio, 2),
      antialias: true
    });
    const ogl = renderer.gl;
    ogl.canvas.classList.add('glFooter');
    wrapper.querySelector('.cCover').appendChild(ogl.canvas);

    // 2) Prepare MSDF text buffers
    const fontJSON = await fetch('@/assets/fonts/PPNeueMontreal-Medium.json').then(r => r.json());
    const textObj  = new Text({
      font: fontJSON,
      text,
      align: 'center',
      letterSpacing,
      size,
      lineHeight: 1
    });
    const geo = new Geometry(ogl, {
      position: { size: 3, data: textObj.buffers.position },
      uv:       { size: 2, data: textObj.buffers.uv },
      id:       { size: 1, data: textObj.buffers.id },
      index:    { data: textObj.buffers.index }
    });
    geo.computeBoundingBox();
    const img = new Image();
    img.src = '@/assets/fonts/PPNeueMontreal-Medium.png';
    await img.decode();
    const tex = new Texture(ogl, { generateMipmaps: false });
    tex.image = img;

    // 3) Instantiate Footer effect
    footerRef.current = new Footer({
      gl:       ogl,
      scene:    new Transform(), // local scene
      camera,
      element:  el,
      renderer,
      touch:    0
    });
    footerRef.current.mesh.program.uniforms.tMap.value = tex;

    // 4) Resize & observe
    const doResize = () => {
      footerRef.current.onResize({ w:window.innerWidth,h:window.innerHeight }, { w:window.innerWidth,h:window.innerHeight });
    };
    window.addEventListener('resize', doResize);
    doResize();

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => footerRef.current.check(e));
    }, { threshold: 0.1 });
    obs.observe(el);

    // 5) RAF loop
    let id = requestAnimationFrame(function frame(t) {
      footerRef.current.update(t, null, 0);
      id = requestAnimationFrame(frame);
    });

    return () => {
      obs.disconnect();
      window.removeEventListener('resize', doResize);
      cancelAnimationFrame(id);
      footerRef.current.removeEvents();
    };
  }, [gl, scene, camera, text, letterSpacing, size]);

  return { containerRef, elementRef };
}