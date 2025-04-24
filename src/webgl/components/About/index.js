"use client";
"use client"'use client'

import { Program, Mesh, Post, Vec2 } from 'ogl'
import gsap from 'gsap'
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateAnim
} from './geometry'
import vertexShader   from './shaders/msdf.vert.glsl'
import fragmentShader from './shaders/msdf.frag.glsl'
import parentShader   from './shaders/parent.frag.glsl'

export default class About {
  constructor({ gl, scene, camera, element, renderer, touch = 0 }) {
    this.name      = 'About'
    this.gl        = gl
    this.scene     = scene
    this.camera    = camera
    this.element   = element
    this.renderer  = renderer
    this.touch     = touch

    // Legacy state
    this.active = -1
    this.ctr    = { actual:0, current:0, limit:0, start:0, prog:0, progt:0, stop:0 }
    this.oldpos = 0
    this.norm   = 0
    this.end    = 0
    this.lerpVal= 0.6
    this.stopt  = 0

    // Build mesh + post
    const geo = this.createGeometry(gl)
    this.mesh = new Mesh(gl, { geometry: geo, program: this.createProgram(gl) })
    this.mesh.setParent(scene)

    this.post = new Post(gl)
    this.post.addPass({
      fragment: parentShader,
      uniforms: {
        uTime:   { value: 0 },
        uStart:  { value: 0.8 },
        uMouseT: { value: 0.2 },
        uMouse:  { value: 0.39 },
        uOut:    { value: 0 }
      },
    })

    // Wire up geometry helpers
    this.mesh.program = this.mesh.program
    Object.assign(About.prototype, { check, start, stop, updateX, updateY, updateAnim })

    this.initTimelines()
    this.initEvents()
  }

  createGeometry(gl) {
    // Delegated to geometry.js
    return null
  }

  createProgram(gl) {
    return new Program(gl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap:   { value: null },
        uColor: { value: 0 },
        uTime:  { value: 0 },
        uStart: { value: 0.8 }
      },
      transparent: true,
      cullFace:    null,
      depthWrite:  false
    })
  }

  initTimelines() {
    this.animctr = gsap.timeline({ paused: true })
    // (no entrance anim on text for About)
    this.animmouse = gsap.timeline({ paused: true })
      .fromTo(this.post.passes[0].program.uniforms.uMouse,
              { value: -1 }, { value: 1.2, duration: 1, ease:'none' }, 0)
    this.animmouse.progress(0)
  }

  initEvents() {
    const tt = this.element.parentNode.querySelector('.Oiel')
    new window.SplitType(tt, { types: 'chars,words' })

    this.inFn = () => { this.stopt = 0; this.lerpVal = 0.02 }
    this.mvFn = e => {
      const y = e.touches
        ? e.touches[0].pageY - this.bound[1]
        : e.layerY
      this.norm = Math.min(Math.max(y / this.bound[3], 0), 1)
    }
    this.lvFn = () => this.lerpVal = 0.01

    if (!this.touch) {
      tt.onmouseenter = this.inFn
      tt.onmousemove  = this.mvFn
      tt.onmouseleave = this.lvFn
    }
  }

  onResize(viewport, screen) {
    const rect = this.element
      .parentNode.querySelector('.cCover')
      .getBoundingClientRect()
    this.bound = [rect.x, rect.y, rect.width, rect.height]

    this.ctr.start = rect.y - screen.h + window.scrollY + rect.height * 0.5
    this.ctr.limit = this.element.clientHeight + rect.height * 0.5

    const { gl, camera, renderer } = this
    renderer.setSize(rect.width, rect.height)
    camera.perspective({
      aspect: gl.canvas.clientWidth / gl.canvas.clientHeight
    })
    camera.position.set(0, 0, 7)

    const fov    = camera.fov * (Math.PI/180)
    const height = 2 * Math.tan(fov/2) * camera.position.z
    const width  = height * camera.aspect
    this.viewport = [width, height]

    renderer.render({ scene: this.scene, camera })
  }

  removeEvents() {
    this.active = -2
    gsap.timeline({
      onUpdate:   () => this.post.render({ scene: this.mesh }),
      onComplete: () => {
        this.gl.getExtension('WEBGL_lose_context').loseContext()
        this.renderer.canvas.remove()
      }
    })
    .to(this.post.passes[0].program.uniforms.uOut,
        { value: -0.2, duration: 1, ease: 'power2.inOut' }, 0)
    .to(this.renderer.canvas,
        { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4)
  }

  update(time, _, pos) {
    if (this.active !== 1) return false
    this.end = this.end * (1 - this.lerpVal) + this.norm * this.lerpVal
    this.animmouse.progress(this.end)
    if (this.ctr.actual !== pos) {
      this.ctr.actual = pos
      this.updateY(pos)
    }
    if (this.ctr.stop !== 1) this.updateAnim()
    if (!this.stopt) this.post.render({ scene: this.mesh })
    return true
  }
}