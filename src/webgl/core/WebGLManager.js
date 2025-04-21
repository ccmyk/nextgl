'use client'

import { Renderer, Camera, Transform } from 'ogl'

class WebGLManager {
  constructor() {
    this.components = new Map()
    this.active = false
    this.textures = new Map()
  }

  init(canvas) {
    // Same renderer setup as legacy
    this.renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })

    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)

    // Camera setup matching legacy
    this.camera = new Camera(this.gl)
    this.camera.position.set(0, 0, 5)

    // Scene setup
    this.scene = new Transform()

    this.active = true
    this.initAnimation()
  }

  registerComponent(name, component) {
    this.components.set(name, component)
  }

  unregisterComponent(name) {
    this.components.delete(name)
  }

  initAnimation() {
    const animate = (time) => {
      if (!this.active) return

      // Update all active components with same timing as legacy
      for (const [name, component] of this.components) {
        if (component.active && component.update) {
          component.update(time)
        }
      }

      // Render
      this.renderer.render({
        scene: this.scene,
        camera: this.camera
      })

      this.raf = requestAnimationFrame(animate)
    }

    this.raf = requestAnimationFrame(animate)
  }

  // Handle transitions between components
  async transition(from, to) {
    const fromComponent = this.components.get(from)
    const toComponent = this.components.get(to)

    if (fromComponent?.active) {
      await fromComponent.stop()
    }
    if (toComponent) {
      await toComponent.start()
    }
  }

  // Clean up
  destroy() {
    this.active = false
    if (this.raf) cancelAnimationFrame(this.raf)
    
    for (const component of this.components.values()) {
      if (component.destroy) component.destroy()
    }

    if (this.renderer) this.renderer.dispose()
  }

  // Resize handling
  resize(width, height) {
    if (!this.gl || !this.camera || !this.renderer) return

    this.renderer.setSize(width, height)
    
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    })

    // Update all components
    for (const component of this.components.values()) {
      if (component.resize) component.resize(width, height)
    }
  }
}

// Single instance
export const webgl = new WebGLManager()
