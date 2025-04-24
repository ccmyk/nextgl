"use client";
"use client"'use client'
import { Program, Mesh, Geometry, Vec2 } from 'ogl'
import gsap from 'gsap'
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateScale
} from './geometry'
import vert from './shaders/main.vert.glsl'
import frag from './shaders/main.frag.glsl'

export default class Base {
  constructor({ gl, scene, camera, renderer }) {
    this.name      = 'Base'
    this.gl        = gl
    this.scene     = scene
    this.camera    = camera
    this.renderer  = renderer

    this.active    = -1
    this.isready   = 0

    // build full-screen triangle + program
    this.program = new Program(gl, {
      vertex:   vert,
      fragment: frag,
      uniforms: {
        uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
        uTime:       { value: 0 },
        uStart0:     { value: 0 },
        uStart1:     { value: 0 },
        uStart2:     { value: 1 },
        uStartX:     { value: 0 },
        uMultiX:     { value: -0.4 },
        uStartY:     { value: 0.1 },
        uMultiY:     { value: 0.45 },
      },
      transparent: true,
      depthWrite:  false,
      cullFace:    null,
    })

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv:       { size: 2, data: new Float32Array([ 0,  0, 2,  0,  0, 2]) },
    })

    this.mesh = new Mesh(gl, { geometry, program: this.program })
    scene.addChild(this.mesh)

    // wire up intersection/scroll helpers
    Object.assign(Base.prototype, { check, start, stop, updateX, updateY, updateScale })

    this.initTimeline()
  }

  initTimeline() {
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => { this.active = 1 }
    })
    .fromTo(this.program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
    .fromTo(this.program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.program.uniforms.uMultiX, { value: -0.4 }, { value:  0.1, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.program.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.program.uniforms.uMultiY, { value: 0.45 }, { value: 0.3,  duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(this.program.uniforms.uStart2, { value: 1 },   { value: 0,    duration: 1, ease: 'power2.inOut' }, 0.6)
    this.timeline.timeScale(1.4)
  }

  update(time) {
    if (!this.renderer || this.active !== 1) return false
    this.program.uniforms.uTime.value = time
    this.renderer.render({ scene: this.scene, camera: this.camera })
    return true
  }

  onResize({ width, height }) {
    this.renderer.setSize(width, height)
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })
    this.program.uniforms.uResolution.value.set(width, height)
  }

  removeEvents() {
    this.active = 0
    this.gl.getExtension('WEBGL_lose_context').loseContext()
  }
}