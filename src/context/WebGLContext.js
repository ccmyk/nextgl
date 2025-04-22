'use client'

import { createContext, useContext, useRef, useEffect } from 'react'
import { Renderer, Camera, Transform } from 'ogl'

const WebGLContext = createContext()

export function WebGLProvider({ children }) {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const componentsRef = useRef(new Map())

  // Initialize WebGL system
  useEffect(() => {
    // Create canvas through React
    const canvas = document.createElement('canvas')
    canvasRef.current = canvas
    
    // Initialize renderer with same settings as legacy
    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    // Camera setup matching legacy
    const camera = new Camera(gl)
    camera.position.set(0, 0, 5)
    camera.fov = 45

    // Scene setup
    const scene = new Transform()

    // Store references
    rendererRef.current = renderer
    sceneRef.current = scene
    cameraRef.current = camera

    // Start animation loop
    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      // Update all active components
      componentsRef.current.forEach(component => {
        if (component.active && component.update) {
          component.update(performance.now())
        }
      })
      // Render
      renderer.render({ scene, camera })
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      renderer.dispose()
    }
  }, [])

  const value = {
    get gl() { return rendererRef.current?.gl },
    get scene() { return sceneRef.current },
    get camera() { return cameraRef.current },
    registerComponent: (name, component) => {
      componentsRef.current.set(name, component)
    },
    unregisterComponent: (name) => {
      componentsRef.current.delete(name)
    }
  }

  return (
    <WebGLContext.Provider value={value}>
      {children}
    </WebGLContext.Provider>
  )
}

export function useWebGL() {
  const context = useContext(WebGLContext)
  if (!context) {
    throw new Error('useWebGL must be used within WebGLProvider')
  }
  return context
}
