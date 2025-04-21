'use client'

import { useRef, useEffect, useState } from 'react'
import { useWebGLAnimation } from '@/hooks/useWebGLAnimation'
import { useWebGL } from '@/context/WebGLContext'
import { Program, Mesh } from 'ogl'
import vertexShader from './shaders/msdf.vert.glsl'
import fragmentShader from './shaders/msdf.frag.glsl'

export default function TitleEffect({ 
  children,
  text,
  onReady
}) {
  const containerRef = useRef(null)
  const meshRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const { gl, scene, camera } = useWebGL()

  // Use the animation hook with the exact timings
  const { uniforms, createQuickAnimation } = useWebGLAnimation(containerRef, {
    onActiveChange: setIsActive,
    onComplete: () => {
      if (onReady) onReady()
    }
  })

  // Set up WebGL mesh with exact same shader configuration
  useEffect(() => {
    if (!gl || !scene || !containerRef.current) return

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
      transparent: true
    })

    const mesh = new Mesh(gl, {
      geometry: createGeometry(),
      program
    })

    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
      program.remove()
    }
  }, [gl, scene, uniforms])

  // Handle mouse movement with the same timing as legacy
  useEffect(() => {
    if (!containerRef.current) return

    const moveX = createQuickAnimation('x')
    const moveY = createQuickAnimation('y')

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      moveX(clientX)
      moveY(clientY)
    }

    containerRef.current.addEventListener('mousemove', handleMouseMove)
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [createQuickAnimation])

  return (
    <div 
      ref={containerRef}
      className={`title-effect ${isActive ? 'is-active' : ''}`}
      data-text={text}
    >
      {children}
    </div>
  )
}

function createGeometry() {
  // Same geometry creation as legacy code
  // This would contain the MSDF text geometry setup
}
