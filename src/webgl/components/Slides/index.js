"use client";
"use client"'use client'

import { Program, Mesh, Post } from 'ogl'
import gsap from 'gsap'
import {
  check,
  start,
  stop,
  updateX,
  updateY,
  updateScale,
  updateAnim
} from './geometry'
import vertexShader   from './shaders/main.vert.glsl'
import fragmentShader from './shaders/main.frag.glsl'
import parentShader   from './shaders/parent.frag.glsl'

export class Slides {
  constructor({
    gl,
    scene,
    camera,
    element,
    meshes,
    medias,
    textures,
    post,
    canvas,
    device
  }) {
    this.name     = 'Slides'
    this.el       = element
    this.meshes   = meshes
    this.medias   = medias
    this.textures = textures
    this.post     = post
    this.renderer = { gl, scene, camera }
    this.canvas   = canvas
    this.device   = device

    // initial state
    this.active  = -1
    this.isready = 0
    this.state   = 0
    this.oldpos  = 0

    this.ctr    = { actual:0, current:0, limit:0, start:0, prog:0, progt:0, stop:0 }
    this.objpos = { x:0, target:0, timer:0 }

    // keep hidden until start
    gsap.set(canvas, { display: 'none' })

    // main slide‐timing timeline
    this.animctr = gsap.timeline({ paused: true })
    if (element.dataset.ids !== '0') {
      this.animctr
        .fromTo(
          this.objpos, { timer: 0 }, { 
            timer: 1, duration: 0.1, ease: 'power2.inOut',
            onUpdate: () => this.slideanim.timeScale(this.objpos.timer)
          },
          0
        )
        .fromTo(
          post.passes[0].program.uniforms.uStart,
          { value: 1.5 },
          { value: 0, duration: 0.45 },
          0
        )
    } else {
      // intro animation for first slide
      this.animin = gsap.timeline({
        paused: true,
        delay: 0.1,
        onStart: () => {
          this.active = 1
          this.textures.forEach(t => t.image.tagName==='VIDEO' && t.image.play())
          this.slideanim.play()
        }
      })
      .fromTo(canvas, { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: 0.8 }, 0)
      .fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
      .fromTo(this.objpos, { timer:0 }, {
        timer: 1, duration: 0.9, ease: 'none',
        onUpdate: () => this.slideanim.timeScale(this.objpos.timer)
      }, 0.8)
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 1.5 },
        { value: 0, duration: 2, ease: 'power4.inOut' },
        0.6
      )
    }

    // hover ripple (desktop only)
    this.animhover = gsap.timeline({ paused: true })
    if (device < 3) {
      this.animhover.to(
        post.passes[0].program.uniforms.uHover,
        { value: 1, duration: 1, ease: 'power2.inOut' },
        0
      )
    }

    this.initEvents()
  }

  initEvents() {
    // desktop hover in/out
    if (this.device < 2) {
      const parent = this.el.parentNode
      parent.onmouseenter = () => this.animhover.play()
      parent.onmouseleave = () => this.animhover.reverse()
    }

    // infinite slide loop
    this.slideanim = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat: () => {
        this.resetMeshes()
        this.statepos = 0
      }
    })
    .fromTo(
      this.objpos, { x:0 }, { x:1, ease:'none', duration: 42 },
      0
    )

    // pause/resume on page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.active = -2
        this.slideanim.pause().progress(0)
        this.resetMeshes()
      } else {
        this.active = 1
        this.slideanim.restart()
      }
    })

    // initial sizing
    this.onResize(
      { w: window.innerWidth, h: window.innerHeight },
      { w: window.innerWidth, h: window.innerHeight }
    )
  }

  update(time, speed, pos) {
    if (this.state < 1 && this.active === 1) {
      this.updateY(pos)
      if (this.ctr.stop !== 1 && this.state === 0) this.updateAnim()
      this.updateX()
    }
  }

  onResize(viewport, screen) {
    if (this.state === 1) return

    const rect = this.el.getBoundingClientRect()
    this.bound = [rect.x, rect.y, rect.width, rect.height]
    this.screen = [rect.width, rect.height]

    // spacing & widths from layout
    this.space  = parseFloat(
      getComputedStyle(this.el.parentNode.querySelector('.nfo_t')).paddingLeft
    )
    const wUnit     = this.device < 3 ? screen.w * 0.322 : screen.w * 0.75
    this.minpos    = -wUnit
    this.maxpos    = (this.meshes.length - 1) * (wUnit + this.space)
    this.totalpos  = this.meshes.length * (wUnit + this.space)

    // update canvas & camera
    this.renderer.gl.canvas.style.width  = `${rect.width}px`
    this.renderer.gl.canvas.style.height = `${rect.height}px`
    this.renderer.camera.perspective({
      aspect: this.renderer.gl.canvas.width / this.renderer.gl.canvas.height
    })

    const fov      = this.renderer.camera.fov * Math.PI / 180
    const camH     = 2 * Math.tan(fov/2) * this.renderer.camera.position.z
    this.viewport  = [ camH * this.renderer.camera.aspect, camH ]

    // scroll‐in animation bounds
    this.ctr.start = rect.y - screen.h + window.scrollY
    this.ctr.limit = rect.height + screen.h

    // layout meshes
    this.meshes.forEach((m, i) => {
      m.scale.x  = (this.viewport[0] * wUnit) / this.screen[0]
      m.scale.y  = (this.viewport[1] * rect.height) / this.screen[1]
      m.position.z = 0
      m.setParent(this.renderer.scene)
      m.geometry.attributes.uv.needsUpdate = true
    })

    this.updateX()
    this.updateY()
    this.updateScale()
  }

  removeEvents() {
    document.removeEventListener('visibilitychange', this)
    this.active = -2
    this.slideanim.pause()
    this.textures.forEach(t => t.image.pause())
    this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
    this.canvas.remove()
  }
}

// wire up our geometry helpers
Slides.prototype.check       = check
Slides.prototype.start       = start
Slides.prototype.stop        = stop
Slides.prototype.updateX     = updateX
Slides.prototype.updateY     = updateY
Slides.prototype.updateScale = updateScale
Slides.prototype.updateAnim  = updateAnim

export default Slides