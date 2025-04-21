'use client'

import { useRef, useEffect } from 'react'
import { Program, Mesh } from 'ogl'
import vertexShader from './shaders/msdf.vert.glsl'
import fragmentShader from './shaders/msdf.frag.glsl'

export class Title {
  constructor({ gl, scene, camera, element, bounds, uniforms }) {
    this.gl = gl
    this.scene = scene
    this.camera = camera
    this.element = element
    this.bounds = bounds
    
    // Initialize uniforms with defaults
    this.uniforms = {
      uTime: { value: 0 },
      uPower: { value: 0 },
      uMouse: { value: [0, 0] },
      uWidth: { value: [] },
      uHeight: { value: [] },
      uKey: { value: -1 },
      ...uniforms
    }

    this.createMesh()
    this.resize()
  }

  createMesh() {
    const program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
    })

    const mesh = new Mesh(this.gl, {
      geometry: this.createGeometry(),
      program
    })

    this.program = program
    this.mesh = mesh

    // Add to scene
    if (this.scene) this.scene.addChild(mesh)
  }

  createGeometry() {
    // Create geometry based on element bounds
    // This would contain the specific geometry creation logic
    // from the original base.js
  }

  resize() {
    if (!this.element || !this.gl) return

    const bounds = this.element.getBoundingClientRect()
    this.bounds = bounds

    // Update size and camera
    if (this.mesh) {
      // Resize logic from the original base.js
    }
  }

  update(time) {
    if (!this.mesh || !this.program) return

    // Update uniforms
    this.program.uniforms.uTime.value = time

    // Render is handled by the parent WebGL system
  }

  destroy() {
    if (this.mesh && this.scene) {
      this.scene.removeChild(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.program.dispose()
    }
  }
}

export default function TitleComponent({ 
  element,
  onReady,
  children 
}) {
  const elementRef = useRef()
  const titleRef = useRef()

  useEffect(() => {
    if (!elementRef.current) return

    // Title instance would be created by the useNavTitle hook
    // This component just provides the container and ref

    return () => {
      if (titleRef.current) {
        titleRef.current.destroy()
      }
    }
  }, [element])

  return (
    <div ref={elementRef} className="title-container">
      {children}
    </div>
  )
}
