'use client'

import { useRef, useEffect, useState } from 'react'
import { useWebGL } from '@/webgl/core/WebGLContext'
import { Background } from '@/webgl/components/Background'

export function useBackground() {
  const [isActive, setIsActive] = useState(false)
  const effectRef = useRef(null)
  const { gl, scene } = useWebGL()

  // Initialize WebGL effect
  useEffect(() => {
    if (!gl || !scene) return

    // Create background with same setup as legacy
    effectRef.current = new Background({
      gl,
      scene
    })

    // Handle resize
    const handleResize = () => {
      if (!effectRef.current?.resize) return
      effectRef.current.resize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Start effect
    effectRef.current.start()
    setIsActive(true)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (effectRef.current) {
        effectRef.current.destroy()
      }
    }
  }, [gl, scene])

  // Handle intersection observer same as legacy
  useEffect(() => {
    if (!effectRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!effectRef.current) return

        if (entry.isIntersecting) {
          effectRef.current.start()
          setIsActive(true)
        } else {
          effectRef.current.stop()
          setIsActive(false)
        }
      },
      { threshold: 0.1 }
    )

    // Start observing document body for background
    observer.observe(document.body)

    return () => observer.disconnect()
  }, [])

  return {
    isActive,
    effectRef
  }
}
