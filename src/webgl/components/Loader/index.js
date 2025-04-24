"use client";
"use client"'use client';

const { { Program, Mesh } } = dynamic(() => import('ogl'), { ssr: false });
import gsap from 'gsap';
import { createLoaderGeometry } from './geometry';
import vert from './shaders/main.vert.glsl';
import frag from './shaders/main.frag.glsl';

export class Loader {
  constructor({ gl, scene }) {
    this.gl     = gl;
    this.scene  = scene;
    this.active = -1;

    // Legacy uniforms
    this.uniforms = {
      uResolution: { value: [0, 0] },
      uTime:       { value: 0 },
      uStart0:     { value: 0 },
      uStartX:     { value: 0 },
      uMultiX:     { value: -0.4 },
      uStartY:     { value: 0.1 },
      uMultiY:     { value: 0.45 },
      uStart2:     { value: 1 },
    };

    // Build mesh
    const geometry = createLoaderGeometry(gl);
    const program  = new Program(gl, {
      vertex:   vert,
      fragment: frag,
      uniforms: this.uniforms,
      transparent: true,
    });
    this.mesh = new Mesh(gl, { geometry, program });
    if (scene) scene.addChild(this.mesh);

    this._initTimeline();
  }

  _initTimeline() {
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => { this.active = 0; }
    })
    .fromTo(this.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
    .fromTo(this.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.uniforms.uMultiY, { value: 0.45 }, { value: 0.3, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0.6)
    .timeScale(1.4);
  }

  start() {
    if (this.active === 1) return;
    this.active = 1;
    this.timeline.play();
  }

  stop() {
    if (this.active === 0) return;
    this.timeline.pause();
    this.active = 0;
  }

  update(time) {
    if (!this.active) return;
    this.uniforms.uTime.value = time;
  }

  resize(w, h) {
    this.uniforms.uResolution.value = [w, h];
  }

  destroy() {
    if (!this.mesh) return;
    this.scene.removeChild(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.program.dispose();
  }
}

export default Loader;