// src/components/webgl/Canvas.jsx

'use client'

import WebGLManager from './WebGLManager'
import { createWebGLContext } from './createWebGLContext'
import { useEffect, useRef } from 'react'

export default function Canvas({ main }) {
  const glRef = useRef(null)

  useEffect(() => {
    if (!main) return

    const manager = new WebGLManager(main)
    glRef.current = manager

    manager.create().then(() => {
      manager.show()
    })

    const handleResize = () => {
      manager.onResize()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [main])

  return null // Canvas is managed in WebGLManager
}