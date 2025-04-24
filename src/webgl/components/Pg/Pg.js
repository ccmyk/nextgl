"use client";
"use client"'use client';

import gsap from 'gsap';

export default class Pg {
  constructor({ el, pos = 0, renderer, mesh, scene, cam, touch = 0, canvas }) {
    this.el       = el;
    this.pos      = pos;
    this.renderer = renderer;
    this.mesh     = mesh;
    this.scene    = scene;
    this.camera   = cam;
    this.canvas   = canvas;
    this.touch    = touch;
    this.active   = -1;

    // scroll/timing state
    this.ctr = { actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, stop: 0 };

    // Build GSAP timeline to fade in the effect
    this.animctr = gsap.timeline({ paused: true })
      .fromTo(this.mesh.program.uniforms.uLoad,    { value: 0 }, { value: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .fromTo(this.mesh.program.uniforms.uZoom,    { value: 0 }, { value: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .fromTo(this.mesh.program.uniforms.uMove,    { value: 0 }, { value: 1, duration: 1.5, ease: 'power2.inOut' }, 0);

    // Start fully hidden
    this.mesh.program.uniforms.uLoad.value = 0;
    this.mesh.program.uniforms.uZoom.value = 0;
    this.mesh.program.uniforms.uMove.value = 0;
  }

  start() {
    if (this.active === 1) return;
    this.active = 1;
    this.animctr.play();
  }

  stop() {
    if (this.active !== 1) return;
    this.animctr.reverse();
    this.active = 0;
  }

  update(time, speed, pos) {
    if (!this.renderer || this.active !== 1) return false;

    // update scroll progress (handled by geometry.updateY/updateAnim)
    if (this.ctr.actual !== pos) {
      this.ctr.actual = pos;
      this.updateY(pos);
      if (this.ctr.stop !== 1) this.updateAnim();
    }

    this.mesh.program.uniforms.uTime.value = time;
    this.renderer.render({ scene: this.scene, camera: this.camera });
    return true;
  }

  onResize(viewport, screen) {
    // adapt canvas & camera
    this.renderer.setSize(screen.w, screen.h);
    this.camera.perspective({
      aspect: this.renderer.gl.canvas.clientWidth / this.renderer.gl.canvas.clientHeight
    });
    // calc scroll bounds for this.el
    const rect = this.el.getBoundingClientRect();
    this.ctr.start = rect.y - screen.h + window.scrollY;
    this.ctr.limit = rect.height;
  }

  removeEvents() {
    this.stop();
    this.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
    this.canvas.remove();
  }
}