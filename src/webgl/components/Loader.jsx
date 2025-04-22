'use client'

import { useState, useRef, useEffect } from 'react'
import { useWebGL } from '@/context/WebGLContext'
import { Loader as LoaderEffect } from '@/webgl/components/Loader'
import gsap from 'gsap'

export default function Loader() {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const { gl } = useWebGL()

  // Initialize WebGL effect with React lifecycle
  useEffect(() => {
    if (!containerRef.current || !gl) return

    const bounds = containerRef.current.getBoundingClientRect()
    const effect = new LoaderEffect({
      element: containerRef.current,
      bounds,
      gl
    })

    // Progress animation using React state
    const timeline = gsap.timeline({
      onUpdate: () => {
        setProgress(timeline.progress() * 100)
      },
      onComplete: () => {
        setIsActive(false)
      }
    })

    // Text animation through React refs
    if (textRef.current) {
      timeline.fromTo(textRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out'
        }
      )
    }

    effect.start()
    timeline.play()

    return () => {
      timeline.kill()
      effect.destroy()
    }
  }, [gl])

  // Handle resize through React
  useEffect(() => {
    if (!containerRef.current) return

    const handleResize = () => {
      const effect = containerRef.current.effect
      if (!effect?.resize) return

      effect.resize(
        window.innerWidth,
        window.innerHeight
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`loader-container fixed inset-0 z-50 flex items-center justify-center ${isActive ? 'is-active' : ''}`}
    >
      <div 
        ref={textRef} 
        className="loader-text text-5xl font-montreal transform"
        style={{ 
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        <span className="text">Loading</span>
        <span className="progress">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}
