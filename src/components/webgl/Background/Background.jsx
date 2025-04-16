// src/components/webgl/Background/Background.jsx

'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Mesh } from 'ogl'
import { useAppContext } from '@/context/AppProvider'
import createBackgroundGeometry from '@/lib/webgl/createBackgroundGeometry'

export default function Background({ el }) {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const sceneRef = useRef(new Transform())
  const cameraRef = useRef(new Camera())

  const { gl } = useAppContext()

  useEffect(() => {
    if (!el) return

    // Create canvas and attach to DOM
    const canvas = document.createElement('canvas')
    canvas.classList.add('webgl-bg-canvas')
    el.appendChild(canvas)
    canvasRef.current = canvas

    // Set up renderer
    const renderer = new Renderer({ canvas, alpha: true })
    rendererRef.current = renderer

    // Set size and camera
    renderer.setSize(el.clientWidth, el.clientHeight)
    const camera = cameraRef.current
    camera.perspective({ aspect: el.clientWidth / el.clientHeight })
    camera.position.z = 5

    // Create mesh from geometry util
    const { geometry, program } = createBackgroundGeometry()
    const mesh = new Mesh(renderer.gl, { geometry, program })
    mesh.setParent(sceneRef.current)
    meshRef.current = mesh

    // Render loop
    const render = (t) => {
      program.uniforms.uTime.value = t * 0.001
      renderer.render({ scene: sceneRef.current, camera })
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    gl.current.background = mesh

    const handleResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight)
      camera.perspective({ aspect: el.clientWidth / el.clientHeight })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.remove()
    }
  }, [el, gl])

  return null
}
