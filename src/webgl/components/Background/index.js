'use client'

import { Program, Mesh, Vec2 } from 'ogl'
import gsap from 'gsap'
import { createBackgroundGeometry } from './geometry'
import vert from './shaders/main.vert.glsl'
import frag from './shaders/main.frag.glsl'
import { webgl } from '@/webgl/core/WebGLManager';

export default class Background {
  constructor({ gl, renderer, scene, camera }) {
    this.name     = 'Background';
    this.gl       = gl;
    this.renderer = renderer;
    this.scene    = scene;
    this.camera   = camera;
    this.active   = -1;

    // Uniforms exactly as in legacy ⌛️ shader
    this.uniforms = {
      uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
      uTime:       { value: 0 },
      uStart0:     { value: 0 },
      uStart1:     { value: 0 },
      uStart2:     { value: 1 },
      uStartX:     { value: 0 },
      uStartY:     { value: 0 },
      uMultiX:     { value: -0.25 },
      uMultiY:     { value: 0.45 },
    };

    // Build mesh
    const geometry = createBackgroundGeometry(gl);
    const program  = new Program(gl, {
      vertex:      vert,
      fragment:    frag,
      uniforms:    this.uniforms,
      transparent: true,
      depthWrite:  false,
      cullFace:    null,
    });
    this.mesh = new Mesh(gl, { geometry, program });
    scene.addChild(this.mesh);

    // Entrance timeline matches legacy timings
    this.timeline = gsap.timeline({ paused: true })
      .fromTo(this.uniforms.uStart0, { value: 0 }, { value: 1, duration: 1.2, ease: 'power4.inOut' }, 0)
      .fromTo(this.uniforms.uStart1, { value: 0 }, { value: 1, duration: 2,   ease: 'power2.inOut' }, 0)
      .fromTo(this.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1,   ease: 'power4.inOut' }, 0.6);

    // Register yourself so the single RAF loop will call update()
    webgl.registerComponent(this.name, this);
  }

  start() {
    if (this.active === 1) return;
    this.active = 1;
    this.timeline.play();
  }

  stop() {
    if (this.active !== 1) return;
    this.active = 0;
    this.timeline.reverse();
  }

  update(time) {
    if (this.active !== 1) return;
    // legacy used uTime only for noise offsets
    const t = time * 0.001;
    this.uniforms.uTime.value = t;
    this.uniforms.uStartX.value = Math.sin(t * 0.1) * 0.1;
    this.uniforms.uStartY.value = Math.cos(t * 0.15) * 0.1;
  }

  resize(width, height) {
    // one shared canvas, so just forward to renderer & camera
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
    this.uniforms.uResolution.value.set(width, height);
  }

  destroy() {
    webgl.unregisterComponent(this.name);
    this.scene.removeChild(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.program.dispose();
  }
}