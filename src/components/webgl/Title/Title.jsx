// src/components/webgl/Title/Title.jsx

import { useEffect, useRef } from 'react'
import { Vec2 } from 'ogl'
import gsap from 'gsap'
import { check, start, stop, updateX, updateY, updateScale } from './position.js'

class Title {
  constructor({ el, pos, renderer, mesh, text, canvas, touch, scene, cam }) {
    this.el = el
    this.cnt = el.parentNode.querySelector('.cCover')
    this.pos = pos
    this.renderer = renderer
    this.mesh = mesh
    this.text = text
    this.canvas = canvas
    this.touch = touch
    this.scene = scene
    this.camera = cam
    this.lastx = 0
    this.active = -1
    this.isready = 0

    this.coords = [0, 0]
    this.norm = [0, 0]
    this.end = [0, 0]
    this.lerp = 0.6
    this.actualChar = -2

    this.power = []
    this.positioncur = []
    this.positiontar = []

    this.change = 0
    this.stopt = 0

    this.initEvents()
  }

  update(time, speed, pos) {
    if (!this.renderer || this.active === 2) return
    this.end[0] = lerp(this.end[0], this.norm[0], this.lerp)
    this.mesh.program.uniforms.uMouse.value = [this.end[0], 0]
    this.mesh.program.uniforms.uTime.value = time
    this.positioncur = this.lerpArr(this.positioncur, this.positiontar, this.lerp)
    this.mesh.program.uniforms.uPowers.value = this.positioncur
    if (this.stopt === 0) {
      this.renderer.render({ scene: this.scene, camera: this.camera })
    }
  }

  removeEvents() {
    this.tt.classList.remove('act')
    this.lerp = 0.03
    this.animout.pause()
    this.animin.pause()
    this.active = 2
    this.mesh.program.uniforms.uKey.value = this.chars.length - 1
    this.calcChars(this.tt.clientWidth)
    this.positioncur = this.lerpArr(this.positioncur, this.positiontar, 1)

    gsap.timeline({
      onUpdate: () => {
        this.calcChars(0, -0.5)
        this.end[0] = lerp(this.end[0], this.norm[0], this.lerp)
        this.mesh.program.uniforms.uMouse.value = [this.end[0], 0]
        this.positioncur = this.lerpArr(this.positioncur, this.positiontar, this.lerp)
        this.mesh.program.uniforms.uPowers.value = this.positioncur
        this.renderer.render({ scene: this.scene, camera: this.camera })
      },
      onComplete: () => {
        this.renderer.gl.getExtension('WEBGL_lose_context').loseContext()
        this.canvas.remove()
      }
    })
      .to(this.mesh.program.uniforms.uPower, { value: 1, duration: 0.8, ease: 'power4.inOut' }, 0)
      .to(this.cnt, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0)
  }

  initEvents() {
    this.animin = gsap.timeline({ paused: true }).to(this.mesh.program.uniforms.uPower, { value: 1, duration: 0.36, ease: 'power4.inOut' }, 0)
    this.animout = gsap.timeline({ paused: true }).to(this.mesh.program.uniforms.uPower, {
      value: 0,
      duration: 0.6,
      ease: 'none',
      onComplete: () => {
        this.mesh.program.uniforms.uKey.value = -1
      }
    }, 0)

    this.tt = this.el.parentNode.querySelector('.Oiel')
    new window.SplitType(this.tt, { types: 'chars,words' })
    this.getChars()
    if (this.el.dataset.nome) return

    this.inFn = (e) => {
      this.stopt = 0
      this.lerp = 0.03
      let lX = e.touches ? e.touches[0]?.pageX - this.bound[0] : e.layerX
      const out = lX < 60 ? -0.5 : 0.5
      this.calcChars(lX, out)
      this.animout.pause()
      this.animin.play()
      this.lerp = 0.06
    }

    this.mvFn = (e) => {
      const lX = e.touches ? e.touches[0]?.pageX - this.bound[0] : e.layerX
      this.calcChars(lX)
    }

    this.lvFn = (e) => {
      const lX = e.touches ? e.touches[0]?.pageX - this.bound[0] : e.layerX
      this.lerp = 0.03
      const out = lX < 60 ? 0.5 : -0.5
      this.calcChars(lX, out)
      this.animin.pause()
    }

    if (this.touch === 0) {
      this.tt.onmouseenter = this.inFn
      this.tt.onmousemove = this.mvFn
      this.tt.onmouseleave = this.lvFn
    } else {
      this.tt.ontouchstart = this.inFn
      this.tt.ontouchmove = this.mvFn
      this.tt.ontouchend = this.lvFn
    }

    this.charFn = (e, i) => {
      this.mesh.program.uniforms.uKey.value = i
      this.actualChar = i
    }

    for (let [i, a] of this.chars.entries()) {
      a.onmouseenter = (e) => this.charFn(e, i)
      a.ontouchstart = (e) => this.charFn(e, i)
    }
  }

  getChars() {
    this.chars = this.tt.querySelectorAll('.char')
    this.charw = []
    this.charsposw = []
    this.totalw = 0
    const arrw = []
    const arrh = []
    for (let [i, a] of this.chars.entries()) {
      this.positiontar.push(0.5)
      this.positioncur.push(0.5)
      this.charw.push(a.clientWidth)
      this.charsposw.push(this.totalw)
      this.totalw += a.clientWidth
      arrw.push(a.clientWidth, a.clientWidth)
      arrh.push(a.clientHeight)
    }
    this.mesh.program.uniforms.uWidth.value = arrw
    this.mesh.program.uniforms.uHeight.value = arrh
  }

  calcChars(x, out = undefined) {
    this.lastx = x
    const arr = []
    if (out !== undefined) {
      this.chars.forEach(() => arr.push(out))
    } else {
      for (let [i] of this.chars.entries()) {
        let tot = x - this.charsposw[i]
        tot /= this.charw[i]
        tot -= 0.5
        tot = Math.min(Math.max(tot, -0.5), 0.5)
        arr.push(tot)
      }
    }
    this.positiontar = arr
  }

  onResize(viewport, screen) {
    const bound = this.cnt.getBoundingClientRect()
    this.bound = [bound.x, bound.y, bound.width, bound.height]
    this.screen = [bound.width, bound.height]
    this.renderer.setSize(bound.width, bound.height)
    this.camera.perspective({
      aspect: this.renderer.gl.canvas.clientWidth / this.renderer.gl.canvas.clientHeight
    })
    this.camera.fov = 45
    this.camera.position.set(0, 0, 7)

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = [width, height]

    this.getChars()
  }

  lerpArr(a, b, t, out) {
    if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t)
    out = out || new Array(Math.min(a.length, b.length))
    for (let i = 0; i < out.length; i++) out[i] = lerp(a[i], b[i], t)
    return out
  }
}

Title.prototype.check = check
Title.prototype.start = start
Title.prototype.stop = stop
Title.prototype.updateX = updateX
Title.prototype.updateY = updateY
Title.prototype.updateScale = updateScale

export default Title
