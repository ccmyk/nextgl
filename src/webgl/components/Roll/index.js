'use client'

import gsap from 'gsap'
import { Program, Mesh } from 'ogl'
import { check, start, stop, updateY, updateScale, updateAnim } from './geometry'
import vertexShader from './shaders/single.vert.glsl'
import fragmentShader from './shaders/single.frag.glsl'

class Roll {
  constructor({ el, pos = 0, renderer, mesh, scene, medias, textures, canvas }) {
    this.name     = 'Roll'
    this.el       = el
    this.pos      = pos
    this.renderer = renderer
    this.mesh     = mesh
    this.scene    = scene
    this.medias   = medias
    this.textures = textures
    this.canvas   = canvas

    // Hide initial canvas until activated
    this.renderer.gl.canvas.classList.add('hideme')

    this.active = -1
    this.isready = 0

    this.ctr = { actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, stop: 0 }
    this.state = 0
    this.norm = 0
    this.end = 0
    this.lerpVal = 0.6

    this.initTimeline()
    this.initEvents()
  }

  initTimeline() {
    this.animctr = gsap.timeline({ paused: true })
    this.textures.forEach((_, i) => {
      const next = this.textures[i + 1]
      const delay = i + 0.4
      if (i === 0) {
        this.animctr
          .fromTo(
            this.mesh.program.uniforms.uChange,
            { value: 0 },
            {
              value: 1,
              duration: 0.6,
              ease: 'power2.inOut',
              onStart:  () => this.swapTextures(0, 1),
              onReverseComplete: () => this.swapTextures(0, 1)
            },
            delay
          )
          .fromTo(
            this.mesh.program.uniforms.uStart,
            { value: 0 },
            { value: 0.4, duration: 0.6, ease: 'power2.inOut' },
            delay
          )
          .fromTo(
            this.mesh.program.uniforms.uEnd,
            { value: 0.4 },
            { value: 0, duration: 0.6, ease: 'power2.inOut' },
            delay
          )
      } else if (next) {
        this.animctr
          .set(
            this.mesh.program.uniforms.tMap,
            {
              value: this.textures[i],
              onComplete:       () => this.swapTextures(i, i + 1),
              onReverseComplete:() => this.swapTextures(i - 1, i)
            },
            i
          )
          .fromTo(
            this.mesh.program.uniforms.uChange,
            { value: 0 },
            { value: 1, duration: 0.6, ease: 'power2.inOut' },
            delay
          )
          .fromTo(
            this.mesh.program.uniforms.uStart,
            { value: 0 },
            { value: 0.4, duration: 0.6, ease: 'power2.inOut' },
            delay
          )
          .fromTo(
            this.mesh.program.uniforms.uEnd,
            { value: 0.4 },
            { value: 0, duration: 0.6, ease: 'power2.inOut' },
            delay
          )
      }
    })
  }

  swapTextures(a, b) {
    this.mesh.program.uniforms.tMap.value  = this.textures[a]
    this.mesh.program.uniforms.tMap2.value = this.textures[b]
    this.playMedia(a, b)
  }

  playMedia(a, b) {
    this.textures.forEach((tex, idx) => {
      if (tex.image.tagName === 'VIDEO') {
        tex.image[idx === a || idx === b ? 'play' : 'pause']()
      }
    })
    this.updateTextureSize(a, b)
  }

  updateTextureSize(a, b) {
    const size = (m) =>
      m.tagName === 'VIDEO'
        ? [m.width, m.height]
        : [m.naturalWidth || m.image.naturalWidth, m.naturalHeight || m.image.naturalHeight]
    this.mesh.program.uniforms.uTextureSize.value  = size(this.medias[a])
    this.mesh.program.uniforms.uTextureSize2.value = size(this.medias[b])
  }

  update(time, speed, pos) {
    if (!this.renderer) return false
    if (this.state === 1) {
      this.ctr.actual = pos
      this.updateY(pos)
      if (this.ctr.stop !== 1) this.updateAnim()
      this.textures.forEach(tex => {
        if (tex.image.tagName === 'VIDEO' && tex.image.readyState >= tex.image.HAVE_ENOUGH_DATA) {
          tex.needsUpdate = true
        }
      })
      this.renderer.render({ scene: this.mesh })
    }
  }

  initEvents() {
    // Observers and pointer events handled externally in hook
  }

  onResize(viewport, screen) {
    const rect = this.el.getBoundingClientRect()
    this.bound = [rect.x, rect.y, rect.width, rect.height]
    const parent = this.el.parentNode.querySelector('.cRoll')
    this.renderer.setSize(parent.clientWidth, parent.clientHeight)
    this.ctr.start = rect.y + window.scrollY - parent.clientHeight
    this.ctr.limit = rect.height + parent.clientHeight
    this.updateY()
    this.updateScale()
    this.mesh.program.uniforms.uCover.value = [parent.clientWidth, parent.clientHeight]
  }

  removeEvents() {
    if (this.state !== 1) {
      this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
      this.canvas.remove()
      return false
    }
    this.active = -2
    this.canvas.parentNode.style.pointerEvents = 'none'
    gsap.timeline({
      onUpdate: () => this.renderer.render({ scene: this.mesh }),
      onComplete: () => {
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()
      }
    })
      .to(this.mesh.program.uniforms.uStart, { value: 0.8, duration: 1, ease: 'power2.inOut' }, 0)
      .to(this.canvas, { filter: 'blur(6px)', duration: 1, ease: 'power2.inOut' }, 0)
      .to(this.canvas, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4)
  }

  // Helpers
  clamp(v, min, max) { return Math.min(Math.max(v, min), max) }
  lerp(a, b, t)     { return a * (1 - t) + b * t }
}

Roll.prototype.check        = check
Roll.prototype.start        = start
Roll.prototype.stop         = stop
Roll.prototype.updateY      = updateY
Roll.prototype.updateScale  = updateScale
Roll.prototype.updateAnim   = updateAnim

export default Roll
