// src/webgl/components/Loader/index.js

import { Program, Mesh } from 'ogl';
import { createLoaderGeometry } from './geometry';
import vert from './shaders/main.vert.glsl';
import frag from './shaders/main.frag.glsl';

/**
 * Bootstraps the loader scene, compiles shaders, binds geometry and kicks off render loop.
 * Returns a cleanup function to cancel the loop and listeners.
 */
export function setupLoaderScene(
  gl,
  {
    progressNormalized = 0,
    startX = 0,
    startY = 0,
    multiX = 1,
    multiY = 1,
  } = {}
) {
  // 1. Create geometry + program + mesh
  const geometry = createLoaderGeometry(gl);
  const program  = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      uTime:       { value: 0 },
      uStart0:     { value: progressNormalized },
      uStart1:     { value: progressNormalized },
      uStart2:     { value: progressNormalized },
      uStartX:     { value: startX },
      uStartY:     { value: startY },
      uMultiX:     { value: multiX },
      uMultiY:     { value: multiY },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  // 2. Handle full-screen DPI resize
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    gl.canvas.width  = window.innerWidth * dpr;
    gl.canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
  }
  window.addEventListener('resize', resize);
  resize();

  // 3. Render loop with full legacy shader uniforms
  let rafId;
  function render(t) {
    const sec = t * 0.001;
    program.uniforms.uTime.value = sec;
    // keep other uniforms static or update here if dynamic
    gl.clear();
    mesh.draw();
    rafId = requestAnimationFrame(render);
  }
  rafId = requestAnimationFrame(render);

  // 4. Cleanup function
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}