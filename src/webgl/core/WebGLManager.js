"use client";
"use client"'use client'

import { Renderer, Camera, Transform } from 'ogl'

class WebGLManager {
  constructor() {
    /** Map<string, { active: number, update: Function, start?: Function, stop?: Function, resize?: Function, destroy?: Function }> */
    this.components = new Map()
    this.renderer   = null
    this.gl         = null
    this.camera     = null
    this.scene      = null
    this.raf        = null
  }

  /**
   * Initialize the shared OGL renderer, camera & scene.
   * Should be called once, with the <canvas> that WebGLContext set up.
   */
  init(canvas) {
    this.renderer = new Renderer({
      canvas,
      dpr:         Math.min(window.devicePixelRatio, 2),
      alpha:       true,
      antialias:   true,
      powerPreference: 'high-performance',
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)

    // match legacy camera
    this.camera = new Camera(this.gl)
    this.camera.position.set(0, 0, 5)

    // root scene
    this.scene = new Transform()

    this._startLoop()
  }

  registerComponent(name, component) {
    this.components.set(name, component)
  }

  unregisterComponent(name) {
    const comp = this.components.get(name)
    if (comp?.destroy) comp.destroy()
    this.components.delete(name)
  }

  /**
   * Begin the requestAnimationFrame loop.
   */
  _startLoop() {
    const loop = (time) => {
      // update all active components
      for (const comp of this.components.values()) {
        if (comp.active && comp.update) {
          comp.update(time)
        }
      }
      // render scene
      this.renderer.render({ scene: this.scene, camera: this.camera })
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  /**
   * Stop everything and clean up.
   */
  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf)
    for (const comp of this.components.values()) {
      if (comp.destroy) comp.destroy()
    }
    this.components.clear()
    if (this.renderer) this.renderer.dispose()
    this.renderer = this.gl = this.camera = this.scene = null
  }

  /**
   * Resize the renderer, camera, and notify components.
   */
  resize(width, height) {
    if (!this.renderer) return
    this.renderer.setSize(width, height)
    this.camera.perspective({
      aspect: this.renderer.gl.canvas.width /
              this.renderer.gl.canvas.height,
    })
    for (const comp of this.components.values()) {
      if (comp.resize) {
        comp.resize(width, height)
      }
    }
  }
}

// single shared manager
export const webgl = new WebGLManager()