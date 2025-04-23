'use client'

import { Program, Mesh, Vec2 } from 'ogl'
import gsap from 'gsap'
import { createTitleGeometry } from './geometry'
import vert from './shaders/main.vert.glsl'
import frag from './shaders/main.frag.glsl'

export class Title {
  constructor({ gl, scene, camera, fontMSDF, el }) {
    this.el     = el
    this.scene  = scene
    this.camera = camera

    // Pull text & layout data from DOM
    const textString    = el.dataset.text || ''
    const letterSpacing = parseFloat(el.dataset.l) || 0
    const size          = parseFloat(el.dataset.m) || 1

    // Build geometry + text helper
    const { geometry, text } = createTitleGeometry(
      gl,
      fontMSDF,
      textString,
      { letterSpacing, size, lineHeight: 1 },
    )
    this.geometry = geometry
    this.text     = text

    // Measure individual chars to drive uWidth / uHeight
    const chars = el.querySelectorAll('.char')
    const uWidth  = []
    const uHeight = []
    chars.forEach(c => {
      uWidth.push(c.clientWidth, c.clientWidth)     // two entries per char
      uHeight.push(c.clientHeight, c.clientHeight)
    })

    // Initial uniforms, matching legacy
    this.uniforms = {
      uTime:   { value: 0 },
      uStart:  { value: 1 },
      uPower:  { value: 0.5 },
      uKey:    { value: -1 },
      uWidth:  { value: uWidth },
      uHeight: { value: uHeight },
      uPowers: { value: uWidth.map(() => 0) },
      uMouse:  { value: new Vec2(0, 0) },
    }

    // Create the OGL Program + Mesh
    this.program = new Program(gl, {
      vertex:   vert,
      fragment: frag,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite:  false,
      cullFace:    null,
    })
    this.mesh = new Mesh(gl, { geometry, program: this.program })
    // match legacy Y positioning
    this.mesh.position.y = text.height * 0.58

    // Add to scene
    scene.addChild(this.mesh)

    // Set up interactions & entrance animation
    this.initEvents()
  }

  initEvents() {
    // Prepare SplitType on the DOM node to get .char wrappers
    this.tt = this.el.parentNode.querySelector('.Oiel')
    new window.SplitType(this.tt, { types: 'chars,words' })

    // Build in/out GSAP timelines exactly as legacy
    this.animIn = gsap.timeline({ paused: true })
      .to(this.uniforms.uPower, { value: 1, duration: 0.36, ease:'power4.inOut' }, 0)

    this.animOut = gsap.timeline({ paused: true })
      .to(this.uniforms.uPower, { value: 0, duration: 0.6, ease:'none',
        onComplete: () => this.program.uniforms.uKey.value = -1
      }, 0)

    // Mouse enter / move / leave handlers
    this.inFn = e => {
      this.lerp = 0.03
      this.animOut.pause()
      this.animIn.play()
    }
    this.mvFn = e => {/* compute this.uniforms.uMouse and update uPowers */}
    this.lvFn = e => {
      this.lerp = 0.03
      this.animIn.pause()
    }

    if (!this.touch) {
      this.tt.addEventListener('mouseenter', this.inFn)
      this.tt.addEventListener('mousemove',  this.mvFn)
      this.tt.addEventListener('mouseleave', this.lvFn)
    } else {
      this.tt.addEventListener('touchstart', this.inFn)
      this.tt.addEventListener('touchmove',  this.mvFn)
      this.tt.addEventListener('touchend',   this.lvFn)
    }
  }

  start() {
    if (this.active === 1) return
    this.active = 1
    // entrance timeline: fade uStart → 0, then uPower → 0, then set uKey to −1
    this.timeline = gsap.timeline({ onComplete: () => {
        this.tt.classList.add('act')
      }
    })
    .fromTo(this.uniforms.uStart, { value:1 }, { value:0, duration:0.8, ease:'power4.inOut' }, 0)
    .fromTo(this.uniforms.uPower, { value:0.5 }, { value:0, duration:2, ease:'power2.inOut' }, 0)
    .set(this.uniforms.uKey, { value:-1 }, '>')
  }

  stop() {
    if (this.active !== 1) return
    this.active = 2
    this.animOut.play()
  }

  update(time) {
    if (this.active !== 1) return
    this.uniforms.uTime.value = time
  }

  resize(width, height) {
    // match legacy onResize: update camera aspect & renderer size
    this.camera.perspective({
      aspect: width / height
    })
    this.mesh.gl.canvas.setSize(width, height)
  }

  destroy() {
    this.scene.removeChild(this.mesh)
    this.mesh.geometry.dispose()
    this.program.dispose()
  }
}

export default Title