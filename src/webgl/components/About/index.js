import { Program, Mesh, Post, Vec2, Camera, Transform } from 'ogl'
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

class About {
  constructor({ el, pos = 0, renderer, mesh, post, scene, cam, touch = 0, canvas }) {
    this.name     = 'About'
    this.el       = el
    this.pos      = pos
    this.renderer = renderer
    this.mesh     = mesh
    this.post     = post
    this.scene    = scene
    this.camera   = cam
    this.canvas   = canvas
    this.touch    = touch
    this.cnt      = el.parentNode.querySelector('.cCover')

    this.active   = -1
    this.isready  = 0
    this.stopt    = 0
    this.ctr      = { actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, stop: 0 }

    // GSAP timelines
    this.animctr   = gsap.timeline({ paused: true })
    this.animmouse = gsap.timeline({ paused: true })
      .fromTo(
        this.post.passes[0].program.uniforms.uMouse,
        { value: -1 },
        { value: 1.2, duration: 1, ease: 'none' },
        0
      )
    this.animmouse.progress(0)

    this.initEvents()
  }

  update(time, speed, pos) {
    if (!this.renderer) return false

    // Mouse ripple lerp
    this.end = this.lerp(this.end ?? 0, this.norm ?? 0, this.lerpVal ?? 0.6)
    this.animmouse.progress(this.end)

    // Scroll‑triggered animation
    if (this.ctr.actual !== pos) {
      this.ctr.actual = pos
      this.updateY(pos)
    }
    if (this.ctr.stop !== 1) {
      this.updateAnim()
    }

    // Render post‑pass
    if (this.stopt === 0) {
      this.post.render({ scene: this.mesh })
    }
  }

  initEvents() {
    this.tt = this.el.parentNode.querySelector('.Oiel')
    new window.SplitType(this.tt, { types: 'chars,words' })

    this.inFn = () => { this.stopt = 0; this.lerpVal = 0.02 }
    this.mvFn = e => {
      const y = e.touches ? e.touches[0].pageY - this.bound[1] : e.layerY
      this.norm = this.clamp(y / this.bound[3], 0, 1)
    }
    this.lvFn = e => {
      this.lerpVal = 0.01
      const y = e.touches ? e.touches[0].pageY - this.bound[1] : e.layerY
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
    const rect         = this.cnt.getBoundingClientRect()
    this.bound         = [rect.x, rect.y, rect.width, rect.height]
    this.screen        = [rect.width, rect.height]
    this.ctr.start     = Math.floor(rect.y - screen.h + window.scrollY + this.screen[1] * 0.5)
    this.ctr.limit     = Math.floor(this.el.clientHeight + this.screen[1] * 0.5)

    this.renderer.setSize(rect.width, rect.height)
    this.camera.perspective({
      aspect: this.renderer.gl.canvas.clientWidth /
              this.renderer.gl.canvas.clientHeight
    })
    this.camera.fov = 45
    this.camera.position.set(0, 0, 7)

    const fov        = (this.camera.fov * Math.PI) / 180
    const h          = 2 * Math.tan(fov / 2) * this.camera.position.z
    const w          = h * this.camera.aspect
    this.viewport    = [w, h]

    // initial render
    this.renderer.render({ scene: this.scene, camera: this.camera })
  }

  removeEvents() {
    this.active = -2
    gsap
      .timeline({
        onUpdate: () => this.post.render({ scene: this.mesh }),
        onComplete: () => {
          this.renderer.gl
            .getExtension('WEBGL_lose_context')
            .loseContext()
          this.canvas.remove()
        }
      })
      .to(this.post.passes[0].program.uniforms.uStart, {
        value: -1, duration: 1, ease: 'power2.inOut'
      }, 0)
      .to(this.canvas, {
        filter: 'blur(6px)', duration: 1, ease: 'power2.inOut'
      }, 0)
      .to(this.canvas, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4)
  }

  clamp(v, min, max) { return Math.min(Math.max(v, min), max) }
  lerp(a, b, t)      { return a * (1 - t) + b * t }
}

// attach geometry helpers
About.prototype.check     = check
About.prototype.start     = start
About.prototype.stop      = stop
About.prototype.updateX   = updateX
About.prototype.updateY   = updateY
About.prototype.updateAnim= updateAnim

export default About