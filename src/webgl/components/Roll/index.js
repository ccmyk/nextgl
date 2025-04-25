'use client'

import { Program, Mesh, Texture, Vec2 } from 'ogl'
import gsap from 'gsap';
import { createRollGeometry } from './geometry';
import vert from './shaders/single.vert.glsl';
import frag from './shaders/single.frag.glsl';

export class Roll {
  /**
   * @param {object} params
   * @param {WebGLRenderingContext} params.gl
   * @param {Transform}            params.scene
   * @param {WebGLProgram}         params.camera
   * @param {HTMLImageElement[]|HTMLVideoElement[]} params.medias
   */
  constructor({ gl, scene, camera, medias }) {
    this.gl     = gl;
    this.scene  = scene;
    this.camera = camera;
    this.active = -1;

    // load both textures (image or video)
    this.textures = medias.map((m) => {
      const tex = new Texture(gl, { generateMipmaps: false });
      tex.image = m;
      return tex;
    });

    // initial uniforms
    this.uniforms = {
      tMap:          { value: this.textures[0] },
      tMap2:         { value: this.textures[1] },
      uTextureSize:  { value: [medias[0].naturalWidth || medias[0].videoWidth,
                               medias[0].naturalHeight || medias[0].videoHeight] },
      uTextureSize2: { value: [medias[1].naturalWidth || medias[1].videoWidth,
                               medias[1].naturalHeight || medias[1].videoHeight] },
      uCover:        { value: new Vec2(gl.canvas.width, gl.canvas.height) },
      uChange:       { value: 0 },
      uStart:        { value: 0 },
      uEnd:          { value: 0 },
    };

    // build mesh
    const geometry = createRollGeometry(gl);
    const program  = new Program(gl, {
      vertex:   vert,
      fragment: frag,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new Mesh(gl, { geometry, program });
    scene.addChild(this.mesh);

    this._initTimeline();
  }

  _initTimeline() {
    this.timeline = gsap.timeline({ paused: true })
      // fade-out first image
      .to(this.uniforms.uChange, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      // animate “start” and “end” if you need further layered fades:
      .to(this.uniforms.uStart, { value: 1, duration: 0.6, ease:'power4.out' }, 0)
      .to(this.uniforms.uEnd,   { value: 1, duration: 0.6, ease:'power4.in' }, 0.6);
  }

  /**
   * Kick off the roll.
   */
  start() {
    if (this.active === 1) return;
    this.active = 1;
    this.timeline.play();
  }

  /**
   * Reverse or stop immediately.
   */
  stop() {
    if (this.active !== 1) return;
    this.timeline.reverse();
    this.active = 0;
  }

  /**
   * Called every frame by WebGLManager.
   */
  update(time) {
    if (!this.active) return;
    // ensure video textures stay fresh
    this.textures.forEach((t) => {
      if (t.image.tagName === 'VIDEO' && t.image.readyState >= t.image.HAVE_CURRENT_DATA) {
        t.needsUpdate = true;
      }
    });
  }

  /**
   * On window resize.
   */
  resize(w, h) {
    this.uniforms.uCover.value.set(w, h);
    this.mesh.program.uniforms.uCover.value = new Vec2(w, h);
  }

  destroy() {
    this.scene.removeChild(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.program.dispose();
  }
}

export default Roll;