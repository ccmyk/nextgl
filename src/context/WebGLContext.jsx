'use client'

import { createContext, useContext, useRef, useEffect } from 'react'
import { Renderer, Camera, Transform } from 'ogl'
import { useAppState } from './AppProvider'

const WebGLContext = createContext(null)

export function WebGLProvider({ children }) {
  const { dimensions } = useAppState()
  const glRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const timelineRef = useRef(null)
  const rafRef = useRef(null)

  // Initialize WebGL with same setup as legacy
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '1'

    // Use same renderer configuration as legacy
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
    camera.fov = 45 // Same as legacy

    // Scene setup
    const scene = new Transform()

    // Store references
    glRef.current = gl
    rendererRef.current = renderer
    sceneRef.current = scene
    cameraRef.current = camera

    document.body.appendChild(canvas)

    // Start render loop with same timing as legacy
    const animate = (t) => {
      rafRef.current = requestAnimationFrame(animate)
      renderer.render({ scene, camera })
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
      renderer.dispose()
    }
  }, [])

  // Handle resize with same calculations as legacy
  useEffect(() => {
    if (!glRef.current || !cameraRef.current || !rendererRef.current) return

    const handleResize = () => {
      const gl = glRef.current
      const camera = cameraRef.current
      const renderer = rendererRef.current

      renderer.setSize(dimensions.width, dimensions.height)

      camera.perspective({
        aspect: gl.canvas.width / gl.canvas.height,
      })

      const fov = camera.fov * (Math.PI / 180)
      const height = 2 * Math.tan(fov / 2) * camera.position.z
      const width = height * camera.aspect
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [dimensions])

  return (
    <WebGLContext.Provider value={{
      gl: glRef.current,
      renderer: rendererRef.current,
      scene: sceneRef.current,
      camera: cameraRef.current
    }}>
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
