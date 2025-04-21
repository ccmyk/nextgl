'use client'

import { Program, Mesh } from 'ogl'
import { webgl } from '../../core/WebGLManager'
import gsap from 'gsap'

// Import shaders
import vertexShader from './shaders/msdf.vert.glsl'
import fragmentShader from './shaders/msdf.frag.glsl'

export class Title {
  constructor({ element, bounds, options = {} }) {
    this.element = element
    this.bounds = bounds
    this.options = options

    // Same uniforms setup as legacy
    this.uniforms = {
      tMap: { value: null },
      uTime: { value: 0 },
      uPower: { value: 0 },
      uMouse: { value: [0, 0] },
      uStart: { value: 1 },
      uKey: { value: -1 },
      uPowers: { value: [] },
      uCols: { value: 20 },
      uColor: { value: 0 }
    }

    this.active = false
    this.lerp = 0.06 // Same lerp value as legacy
    this.createMesh()
  }

  createMesh() {
    const program = new Program(webgl.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: this.uniforms,
      transparent: true
    })

    const mesh = new Mesh(webgl.gl, {
      geometry: this.createGeometry(),
      program
    })

    this.program = program
    this.mesh = mesh

    webgl.scene.addChild(mesh)
  }

  // Animation system matching legacy timing
  async start() {
    if (this.active) return
    this.active = true

    // Same animation timeline as legacy
    const timeline = gsap.timeline({ paused: true })
      .fromTo(this.uniforms.uStart,
        { value: 1 },
        {
          value: 0,
          duration: 0.8,
          ease: 'power4.inOut'
        }
      )
      .fromTo(this.uniforms.uPower,
        { value: 0.5 },
        {
          value: 0,
          duration: 2,
          ease: 'power2.inOut'
        }
      )
      .set(this.uniforms.uKey,
        {
          value: -1,
          onComplete: () => {
            if (this.element) {
              this.element.classList.add('act')
            }
            this.stopt = 1
            this.actualChar = -1
          }
        }
      )

    timeline.play()
  }

  stop() {
    if (!this.active) return
    this.active = false
  }

  // Mouse interaction with same timing as legacy
  handleMouseMove(e) {
    const { clientX, clientY } = e
    this.coords = [clientX, clientY]

    if (!this.bounds) return

    this.end = [
      ((clientX - this.bounds.left) / this.bounds.width) * 2 - 1,
      -((clientY - this.bounds.top) / this.bounds.height) * 2 + 1
    ]
  }

  update(time) {
    if (!this.active) return

    // Same lerp calculation as legacy
    if (this.end) {
      this.uniforms.uMouse.value[0] = this.lerp(
        this.uniforms.uMouse.value[0],
        this.end[0],
        this.lerp
      )
      this.uniforms.uMouse.value[1] = this.lerp(
        this.uniforms.uMouse.value[1],
        this.end[1],
        this.lerp
      )
    }

    this.uniforms.uTime.value = time * 0.001
  }

  // Helper function from legacy
  lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  destroy() {
    if (this.mesh) {
      webgl.scene.removeChild(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.program.dispose()
    }
  }
}

export default Title
