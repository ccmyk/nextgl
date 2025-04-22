'use client'

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
import vertexShader from './shaders/main.vert.glsl'
import fragmentShader from './shaders/main.frag.glsl'
import parentShader from './shaders/parent.frag.glsl'

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
    this.name      = 'Slides'
    this.el        = element
    this.meshes    = meshes
    this.medias    = medias
    this.textures  = textures
    this.post      = post
    this.renderer  = { gl, scene, camera }  // you can expand this if needed
    this.canvas    = canvas
    this.device    = device

    // initial state
    this.active    = -1
    this.isready   = 0
    this.state     = 0
    this.oldpos    = 0
    this.ctr       = { actual:0, current:0, limit:0, start:0, prog:0, progt:0, stop:0 }
    this.objpos    = { x:0, target:0, timer:0 }

    // hide until start
    gsap.set(canvas, { display: 'none' })

    // build your GSAP timelines (translated from legacy)
    this.animctr = gsap.timeline({ paused: true })
    if (element.dataset.ids !== '0') {
      this.animctr
        .fromTo(this.objpos, { timer:0 }, {
          timer: 1, duration: 0.1, ease: 'power2.inOut',
          onUpdate: () => this.slideanim?.timeScale(this.objpos.timer)
        }, 0)
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
          this.textures.forEach(tex => tex.image.tagName === 'VIDEO' && tex.image.play())
          this.slideanim.play()
        },
        onComplete: () => { delete this.animin }
      })
      .fromTo(canvas, { filter: 'blur(6px)' }, {
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0)
      .fromTo(canvas, { opacity: 0 }, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0)
      .fromTo(this.objpos, { timer:0 }, {
        timer: 1, duration: 0.9, ease: 'none',
        onUpdate: () => this.slideanim?.timeScale(this.objpos.timer)
      }, 0.8)
      .fromTo(
        post.passes[0].program.uniforms.uStart,
        { value: 1.5 },
        { value: 0, duration: 2, ease: 'power4.inOut' },
        0.6
      )
    }

    // hover animation (desktop only)
    this.animhover = gsap.timeline({ paused: true })
    if (device < 3) {
      this.animhover.to(
        post.passes[0].program.uniforms.uHover,
        { value: 1, duration: 1, ease: 'power2.inOut' },
        0
      )
    }

    // build infinite slide loop
    this.initEvents()
  }

  initEvents() {
    // hover in/out
    if (this.device < 2) {
      this.el.parentNode.onmouseenter = () => {
        this.animhover.timeScale(1)
        this.animhover.play()
      }
      this.el.parentNode.onmouseleave = () => {
        this.animhover.pause().timeScale(0.7).reverse()
      }
    }

    // build slide animation timeline
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

    // respond to page visibility
    document.addEventListener('visibilitychange', e => {
      if (document.visibilityState === 'hidden') {
        this.active = -2
        this.slideanim.pause().progress(0)
        this.resetMeshes()
        this.statepos = 0
      } else {
        this.active = 1
        this.slideanim.restart().play()
      }
    })

    // set up meshes initial sizes
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

      // video‐texture updates
      this.textures.forEach((tex, i) => {
        if (tex.image.tagName === 'VIDEO' &&
            tex.image.readyState >= tex.image.HAVE_ENOUGH_DATA) {
          tex.needsUpdate = true
        }
      })

      this.post.render({ scene: this.scene, camera: this.camera })
    }
  }

  onResize(viewport, screen) {
    if (this.state === 1) return
    const bound = this.el.getBoundingClientRect()
    this.bound = [bound.x, bound.y, bound.width, bound.height]
    this.screen = [bound.width, bound.height]

    // calculate spacing & total length
    const isMobile = this.device < 3
    this.wel     = bound.width * (isMobile ? 0.322 : 0.75)
    this.space   = parseFloat(
      getComputedStyle(this.el.parentNode.parentNode
        .querySelector('.nfo_t')).paddingLeft
    )
    this.maxpos  = (this.meshes.length - 1) * (this.wel + this.space)
    this.totalpos= this.meshes.length * (this.wel + this.space)

    this.renderer.setSize(bound.width, bound.height)
    this.camera.perspective({
      aspect: this.renderer.gl.canvas.width / this.renderer.gl.canvas.height
    })

    const fov    = (this.camera.fov * Math.PI) / 180
    const h      = 2 * Math.tan(fov / 2) * this.camera.position.z
    const w      = h * this.camera.aspect
    this.viewport= [w, h]

    // scroll thresholds
    const firstFix = bound.height * (this.el.dataset.ids === '0' ? -0.15 : 0)
    const limit   = bound.height + firstFix + window.scrollY
    this.ctr.start  = Math.floor(bound.y - screen.h + firstFix + window.scrollY)
    this.ctr.limit  = Math.floor(limit)

    this.updateX()
    this.updateY()
    this.updateScale()
    this.resetMeshes()

    // update per‐mesh cover sizes
    this.meshes.forEach((m, i) => {
      m.program.uniforms.uCover.value = [this.wel, this.el.clientHeight]
    })
  }

  removeEvents() {
    if (this.state !== 0) {
      this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
      this.canvas.remove()
      return
    }
    this.active = -2
    this.canvas.style.transition = 'none'
    this.canvas.parentNode.style.pointerEvents = 'none'

    const tl = gsap.timeline({
      onUpdate: () =>
        this.post.render({ scene: this.scene, camera: this.camera }),
      onComplete: () => {
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()
      }
    })
    if (this.device < 3) {
      tl.to(this.post.passes[0].program.uniforms.uStart, { value: 1.5, duration:1 })
        .to(this.post.passes[0].program.uniforms.uHover, { value:1, duration:1 }, 0)
    }
    tl.to(this.objpos, {
      timer:0, duration:0.6, onUpdate: ()=> {
        this.slideanim?.timeScale(this.objpos.timer)
      }
    }, 0)
    .to(this.canvas, { filter:'blur(6px)', duration:1 }, 0)
    .to(this.canvas, { opacity:0, duration:0.6 }, 0.4)
  }

  // helpers
  clamp(v, min, max) { return Math.min(Math.max(v, min), max) }
  lerp(a, b, t)      { return a*(1-t) + b*t }
}

// mix in the geometry methods
Slides.prototype.check       = check
Slides.prototype.start       = start
Slides.prototype.stop        = stop
Slides.prototype.updateX     = updateX
Slides.prototype.updateY     = updateY
Slides.prototype.updateScale = updateScale
Slides.prototype.updateAnim  = updateAnim

export default Slides