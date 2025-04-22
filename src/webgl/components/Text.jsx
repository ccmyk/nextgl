'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { useWebGL } from '@/context/WebGLContext'

export default function Text({ 
  text,
  component: WebGLEffect,
  className,
  children,
  onReady 
}) {
  const containerRef = useRef(null)
  const effectRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const webgl = useWebGL()

  // Split text into characters using React state
  const chars = useMemo(() => {
    if (!text) return []
    return text.split('')
  }, [text])

  // Initialize WebGL effect
  useEffect(() => {
    if (!containerRef.current) return

    const bounds = containerRef.current.getBoundingClientRect()
    
    effectRef.current = new WebGLEffect({
      element: containerRef.current,
      bounds,
      camera: webgl.camera,
      scene: webgl.scene
    })

    webgl.registerComponent(effectRef.current.name, effectRef.current)

    const handleResize = () => {
      if (!containerRef.current || !effectRef.current?.resize) return
      const newBounds = containerRef.current.getBoundingClientRect()
      effectRef.current.resize(
        window.innerWidth,
        window.innerHeight,
        newBounds
      )
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (effectRef.current) {
        webgl.unregisterComponent(effectRef.current.name)
        effectRef.current.destroy()
      }
    }
  }, [WebGLEffect, webgl])

  // Handle intersection through React
  useEffect(() => {
    if (!containerRef.current || !effectRef.current) return

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

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`text-effect ${isActive ? 'is-active' : ''} ${className || ''}`}
    >
      {/* Render using Virtual DOM */}
      <div className="text-content">
        {chars.map((char, i) => (
          <span key={i} className="char">
            <span className="char-wrapper">
              <span className="n">{char}</span>
            </span>
          </span>
        ))}
      </div>
      {children}
    </div>
  )
}
