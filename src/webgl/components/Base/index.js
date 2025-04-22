'use client'
import { Vec2, Program, Mesh, Texture } from 'ogl'
import gsap from 'gsap'
import { check, start, stop, updateX, updateY, updateScale, updateAnim } from './geometry'
import vertex from './shaders/main.vert.glsl'
import fragment from './shaders/main.frag.glsl'

class Base {
  constructor({ el, pos = 0, mesh, texture, renderer, touch = 0, canvas }) {
    this.el = el
    this.pos = pos
    this.mesh = mesh
    this.tex = texture
    this.renderer = renderer
    this.touch = touch
    this.canvas = canvas

    this.active = -1
    this.isready = 0
    this.media = el.parentNode.querySelector('img,video')

    if (this.tex.image.tagName === 'VIDEO') {
      this.isv = 1
      this.mesh.program.uniforms.uTextureSize.value = [
        this.media.width,
        this.media.height
      ]
    }

    this.coords = [0, 0]
    this.norm = [0, 0]
    this.end = [0, 0]
    this.ease = 0.06

    this.ctr = { actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, lerp: 0.065, stop: 0 }

    let xanim = el.dataset.op ? -0.8 : 0.8
    this.animctr = gsap.timeline({ paused: true })
      .fromTo(
        this.mesh.program.uniforms.uStart,
        { value: xanim },
        { value: 0, ease: 'power2.inOut', onComplete: () => {
            this.ctr.stop = 1
            this.el.classList.add('act')
          }
        },
        0
      )
  }

  async load() {
    this.initEvents()
  }

  update(time, speed, pos) {
    if (!this.mesh || this.isready === 0 || this.active < 0) return false

    this.end[0] = this.lerp(this.end[0], this.norm[0], this.ease)
    this.end[1] = this.lerp(this.end[1], this.norm[1], this.ease)

    this.mesh.program.uniforms.uMouse.value = this.end

    if (this.ctr.actual !== pos) {
      this.ctr.actual = pos
      this.updateY(pos)
    }
    if (this.ctr.stop !== 1) {
      this.updateAnim()
    }
    if (this.isv && this.tex.image.readyState >= this.tex.image.HAVE_ENOUGH_DATA) {
      this.tex.needsUpdate = true
    }

    this.renderer.render({ scene: this.mesh })
    return true
  }

  initEvents() {
    this.mvFn = e => {
      this.ease = 0.03
      this.coords[0] = e.touches ? e.touches[0].clientX : e.clientX
      this.norm[0] = (this.coords[0] - this.bound[0]) / this.bound[2] - 0.5
    }
    this.lvFn = () => {
      this.ease = 0.01
      this.norm[0] = 0
    }

    if (this.touch === 0) {
      this.el.onmousemove = this.mvFn
      this.el.onmouseleave = this.lvFn
    } else {
      this.el.style.touchAction = 'none'
      this.el.ontouchmove = this.mvFn
      this.el.ontouchend = this.lvFn
    }
  }

  removeEvents() {
    this.active = -2
    this.ease = 0.022
    this.norm[0] = -0.5
    this.el.style.pointerEvents = 'none'

    gsap.timeline({
      onUpdate: () => {
        this.end[0] = this.lerp(this.end[0], this.norm[0], this.ease)
        this.mesh.program.uniforms.uMouse.value = this.end
        this.renderer.render({ scene: this.mesh })
      },
      onComplete: () => {
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()
      }
    })
    .to(this.canvas, { webkitFilter: 'blur(6px)', filter: 'blur(6px)', opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4)
  }

  onResize(viewport, screen) {
    this.viewport = [viewport.w, viewport.h]
    this.screen = [screen.w, screen.h]

    const boundRect = this.media.getBoundingClientRect()
    this.bound = [boundRect.x, boundRect.y, boundRect.width, boundRect.height]

    let calc = 0, fix = this.screen[1] * 0.2
    if (this.touch === 0) {
      if (this.media.clientHeight > this.screen[1] * 0.7) calc = this.screen[1] * -0.4
    } else if (this.screen[0] < this.screen[1]) {
      fix = 0
      calc = 0
    }

    this.ctr.start = parseInt(boundRect.y - screen.h + window.scrollY + fix)
    this.ctr.limit = parseInt(this.media.clientHeight + calc + fix)

    if (this.mesh) {
      this.updateY()
      this.renderer.setSize(boundRect.width, boundRect.height)
      this.mesh.program.uniforms.uCover.value = new Vec2(this.bound[2], this.bound[3])
      this.renderer.render({ scene: this.mesh })
    }
  }

  lerp(v1, v2, t) {
    return v1 * (1 - t) + v2 * t
  }
}

// attach position handlers
Base.prototype.check = check
Base.prototype.start = start
Base.prototype.stop = stop
Base.prototype.updateX = updateX
Base.prototype.updateY = updateY
Base.prototype.updateScale = updateScale
Base.prototype.updateAnim = updateAnim

export default Base


// src/webgl/components/Base/geometry.js
export function check(entry) {
  const vis = entry.isIntersecting
  if (vis === undefined) return false
  if (vis) this.start()
  else this.stop()
  return vis
}
export function start() {
  if (this.active === 1) return false
  if (this.isv) this.tex.image.play()
  this.active = 1
  this.updateX()
  this.updateY()
  this.updateScale()
}
export function stop() {
  if (this.active === 0 || this.active === -1) return false
  if (this.isv) this.media.pause()
  this.active = 0
}
export function updateX(x = 0) {}
export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = Math.min(Math.max(y - this.ctr.start, 0), this.ctr.limit)
  }
}
export function updateAnim() {
  this.ctr.progt = (this.ctr.current / this.ctr.limit).toFixed(3)
  this.ctr.prog = this.ctr.prog * (1 - this.ctr.lerp) + this.ctr.progt * this.ctr.lerp
  this.animctr.progress(this.ctr.prog)
}
export function updateScale() {}