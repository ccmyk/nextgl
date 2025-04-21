'use client'

import { Program, Mesh } from 'ogl'
import gsap from 'gsap'
import vertexShader from './shaders/main.vert.glsl'
import fragmentShader from './shaders/main.frag.glsl'
import { webgl } from '../../core/WebGLManager'

export class Loader {
  constructor({ element, bounds }) {
    this.element = element
    this.bounds = bounds
    
    // Same uniforms as legacy
    this.uniforms = {
      uResolution: { value: [0, 0] },
      uTime: { value: 0 },
      uStart0: { value: 0 },
      uStart1: { value: 0.1 },
      uStart2: { value: 1 },
      uStartX: { value: 0 },
      uStartY: { value: 0.1 },
      uMultiX: { value: -0.4 },
      uMultiY: { value: 0.45 }
    }

    this.active = -1
    this.isready = 0
    this.createMesh()
    this.initTimeline()
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

  createGeometry() {
    // Same geometry as legacy
    const geometry = new webgl.gl.Geometry()
    
    // Positions
    const positions = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0])
    geometry.addAttribute('position', { size: 3, data: positions })
    
    // UVs
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
    geometry.addAttribute('uv', { size: 2, data: uvs })
    
    geometry.addAttribute('index', {
      data: new Uint16Array([0, 2, 1, 1, 2, 3])
    })

    return geometry
  }

  initTimeline() {
    // Exact same animation timeline as legacy
    this.animstart = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.active = 0
      }
    })
    .fromTo(this.uniforms.uStart0,
      { value: 0 },
      {
        value: 1,
        duration: 0.6,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uStartX,
      { value: 0 },
      {
        value: -0.1,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uMultiX,
      { value: -0.4 },
      {
        value: 0.1,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uStartY,
      { value: 0.1 },
      {
        value: 0.95,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uMultiY,
      { value: 0.45 },
      {
        value: 0.3,
        duration: 2,
        ease: 'power2.inOut'
      },
      0
    )
    .fromTo(this.uniforms.uStart2,
      { value: 1 },
      {
        value: 0,
        duration: 1,
        ease: 'power2.inOut'
      },
      0.6
    )

    // Same timeScale as legacy
    this.animstart.timeScale(1.4)
  }

  start() {
    if (this.active === 1) return false
    this.active = 1
    this.animstart.play()
  }

  stop() {
    if (this.active === 0) return false
    if (this.animstart) {
      this.animstart.pause()
    }
    this.active = 0
  }

  update(time) {
    if (!this.active || this.active === 0) return false
    
    this.uniforms.uTime.value = time || 0
  }

  resize(width, height) {
    if (!this.program) return
    
    this.uniforms.uResolution.value = [width, height]
  }

  destroy() {
    if (this.mesh) {
      webgl.scene.removeChild(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.program.dispose()
    }
  }
}

export default Loader
