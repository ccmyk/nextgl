import gsap from 'gsap'
import { Renderer, Triangle, Program, Mesh, Vec2 } from 'ogl'
import loaderVert from './shaders/main.vert.glsl'
import loaderFrag from './shaders/main.frag.glsl'

export default class Loader {
  constructor({ canvas }) {
    this.canvas = canvas
    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
      antialias: true,
    })
    this.gl = this.renderer.gl

    // full‑screen triangle
    const geometry = new Triangle(this.gl)

    // compile shaders
    this.program = new Program(this.gl, {
      vertex:   loaderVert,
      fragment: loaderFrag,
      uniforms: {
        uTime:        { value: 0 },
        uStart0:     { value: 1 },
        uStartX:     { value: 0 },
        uStartY:     { value: 0.1 },
        uMultiX:     { value: -0.4 },
        uMultiY:     { value:  0.45 },
        uStart2:     { value: 1 },
        uResolution: { value: [ this.gl.canvas.width, this.gl.canvas.height ] },
      },
      transparent: true,
      depthWrite:  false,
    })

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    this.active = -1

    this._initTimeline()
  }

  // trigger on/off from an IntersectionObserver
  check(entry) {
    if (entry.isIntersecting) this.start()
    else                       this.stop()
  }

  start() {
    if (this.active === 1) return
    this.active = 1
    this._tl.play()
  }

  stop() {
    if (this.active === 0) return
    this.active = 0
    this._tl.pause()
  }

  update(time) {
    if (!this.renderer) return
    this.program.uniforms.uTime.value = time
    this.renderer.render({ scene: this.mesh })
  }

  onResize(width, height) {
    this.renderer.setSize(width, height)
    this.program.uniforms.uResolution.value = [width, height]
  }

  remove() {
    this.renderer.gl
      .getExtension('WEBGL_lose_context')
      .loseContext()
    this.canvas.remove()
  }

  // private
  _initTimeline() {
    this._tl = gsap.timeline({ paused: true, onComplete: () => {
      this.active = 0
    }})
    .fromTo(this.program.uniforms.uStart0,
      { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0
    )
    .fromTo(this.program.uniforms.uStartX,
      { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0
    )
    .fromTo(this.program.uniforms.uMultiX,
      { value: -0.4 }, { value: 0.1, duration: 2, ease: 'power2.inOut' }, 0
    )
    .fromTo(this.program.uniforms.uStartY,
      { value: 0.1 }, { value: 0.95, duration: 2, ease: 'power2.inOut' }, 0
    )
    .fromTo(this.program.uniforms.uMultiY,
      { value: 0.45 }, { value: 0.3, duration: 2, ease: 'power2.inOut' }, 0
    )
    .fromTo(this.program.uniforms.uStart2,
      { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0.6
    )
    .timeScale(1.4)
  }
}