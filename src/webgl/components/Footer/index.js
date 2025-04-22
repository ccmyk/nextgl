'use client'

import { Program, Mesh, Post } from 'ogl'
import gsap from 'gsap'
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateAnim
} from './geometry'
import vertexShader from './shaders/msdf.vert.glsl'
import fragmentShader from './shaders/msdf.frag.glsl'
import parentShader from './shaders/parent.frag.glsl'

class Footer {
  constructor({ gl, scene, camera, element, renderer, touch = 0 }) {
    this.name      = 'Footer'
    this.gl        = gl
    this.scene     = scene
    this.camera    = camera
    this.element   = element
    this.renderer  = renderer
    this.touch     = touch

    // state from legacy
    this.active = -1
    this.ctr    = { actual:0, current:0, limit:0, start:0, prog:0, progt:0, stop:0 }
    this.norm   = 0
    this.end    = 0
    this.lerpVal= 0.6
    this.stopt  = 0

    this.createMesh()
    this.createPost()
    this.initTimelines()
    this.initEvents()
  }

  createMesh() {
    this.program = new Program(this.gl, {
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
    this.mesh = new Mesh(this.gl, {
      geometry: this.createGeometry(this.gl),
      program:  this.program
    })
    this.scene.addChild(this.mesh)
  }

  createPost() {
    this.post = new Post(this.gl)
    this.post.addPass({
      fragment: parentShader,
      uniforms: {
        uTime:   { value: 0 },
        uStart:  { value: 0.8 },
        uMouseT: { value: 0.2 },
        uMouse:  { value: 0.39 },
        uOut:    { value: 0 }
      }
    })
  }

  initTimelines() {
    // time‑based animation
    this.animctr = gsap.timeline({ paused: true })
      .fromTo(this.post.passes[0].program.uniforms.uTime,
              { value: 0 }, { value: 2,   duration: 0.3, ease: 'power2.inOut' }, 0)
      .fromTo(this.post.passes[0].program.uniforms.uTime,
              { value: 2 }, { value: 0,   duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(this.post.passes[0].program.uniforms.uStart,
              { value: 0.39 }, { value: 0.8, duration: 1,   ease: 'power2.inOut' }, 0)

    // mouse‑driven “ripple” effect
    this.animmouse = gsap.timeline({ paused: true })
      .fromTo(this.post.passes[0].program.uniforms.uMouseT,
              { value: 0.2 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0.1)
      .fromTo(this.post.passes[0].program.uniforms.uMouseT,
              { value: 2   }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(this.post.passes[0].program.uniforms.uMouse,
              { value: 0.39 }, { value: 0.8, duration: 0.9, ease: 'none' }, 0.1)
    this.animmouse.progress(0)
  }

  update(time, speed, pos) {
    if (this.active !== 1) return false
    this.end = this.lerp(this.end, this.norm, this.lerpVal)
    this.animmouse.progress(this.end)

    if (this.ctr.actual !== pos) {
      this.ctr.actual = pos
      this.updateY(pos)
    }
    if (this.ctr.stop !== 1) {
      this.updateAnim()
    }
    if (this.stopt === 0) {
      this.post.render({ scene: this.mesh })
    }
    return true
  }

  initEvents() {
    this.tt = this.element.querySelector('.Oiel')
    new window.SplitType(this.tt, { types: 'chars,words' })

    this.inFn = () => {
      this.stopt = 0
      this.lerpVal = 0.02
    }
    this.mvFn = e => {
      const y = e.touches
        ? (e.touches[0].pageY - this.bound[1])
        : e.layerY
      this.norm = this.clamp(y / this.bound[3], 0, 1)
    }
    this.lvFn = e => {
      this.lerpVal = 0.01
      const y = e.touches
        ? (e.touches[0].pageY - this.bound[1])
        : e.layerY
      this.norm = this.clamp(y / this.bound[3], 0, 1)
    }

    if (this.touch === 0) {
      this.tt.onmouseenter = this.inFn
      this.tt.onmousemove  = this.mvFn
      this.tt.onmouseleave = this.lvFn
    } else {
      this.tt.ontouchstart = this.inFn
      this.tt.ontouchmove  = this.mvFn
      this.tt.ontouchend   = this.lvFn
    }
  }

  onResize(viewport, screen) {
    const rect = this.element
      .parentNode
      .querySelector('.cCover')
      .getBoundingClientRect()
    this.bound = [rect.x, rect.y, rect.width, rect.height]

    this.ctr.start = rect.y - screen.h + window.scrollY + rect.height * 0.5
    this.ctr.limit = this.element.clientHeight + rect.height * 0.5

    this.renderer.setSize(rect.width, rect.height)
    this.camera.perspective({
      aspect: this.gl.canvas.clientWidth / this.gl.canvas.clientHeight
    })
    this.camera.position.set(0, 0, 7)

    const fov    = this.camera.fov * (Math.PI/180)
    const height = 2 * Math.tan(fov/2) * this.camera.position.z
    const width  = height * this.camera.aspect
    this.viewport = [ width, height ]

    this.renderer.render({ scene: this.scene, camera: this.camera })
  }

  removeEvents() {
    this.active = -2
    this.tt.style.pointerEvents = 'none'

    gsap.timeline({
      onUpdate:   () => this.post.render({ scene: this.mesh }),
      onComplete: () => {
        this.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()
      }
    })
    .to(this.post.passes[0].program.uniforms.uOut,
        { value: -0.2, duration: 1, ease: 'power2.inOut' }, 0)
    .to(this.canvas,
        { opacity: 0, duration: 0.8, ease: 'none' }, 0.2)
  }

  // small helpers
  clamp(v, min, max)  { return Math.min(Math.max(v, min), max) }
  lerp(a, b, t)       { return a*(1-t) + b*t }

}

// wire up the geometry helpers:
Footer.prototype.check     = check
Footer.prototype.start     = start
Footer.prototype.stop      = stop
Footer.prototype.updateX   = updateX
Footer.prototype.updateY   = updateY
Footer.prototype.updateAnim= updateAnim

export default Footer