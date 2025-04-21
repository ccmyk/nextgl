'use client'

import { useRef, useEffect } from 'react'
import { Loader as LoaderEffect } from '@/webgl/components/Loader'
import { webgl } from '@/webgl/core/WebGLManager'
import gsap from 'gsap'

export default function Loader() {
  const containerRef = useRef(null)
  const effectRef = useRef(null)
  const timelineRef = useRef(null)

  // Initialize WebGL effect with same timing as legacy
  useEffect(() => {
    if (!containerRef.current) return

    const bounds = containerRef.current.getBoundingClientRect()
    
    effectRef.current = new LoaderEffect({
      element: containerRef.current,
      bounds
    })

    // Register with WebGL manager
    webgl.registerComponent('loader', effectRef.current)

    // Set up the text animation timeline
    timelineRef.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (effectRef.current) {
          effectRef.current.active = 0
        }
      }
    })

    // Add same text animation as legacy
    const text = containerRef.current.querySelector('.loader-text')
    if (text) {
      timelineRef.current.fromTo(text,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out'
        }
      )
    }

    // Handle resize
    const handleResize = () => {
      const newBounds = containerRef.current.getBoundingClientRect()
      if (effectRef.current?.resize) {
        effectRef.current.resize(
          window.innerWidth,
          window.innerHeight
        )
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Start animation
    effectRef.current.start()
    timelineRef.current.play()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (effectRef.current) {
        webgl.unregisterComponent('loader')
        effectRef.current.destroy()
      }
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  // Handle intersection
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (effectRef.current) {
          if (entry.isIntersecting) {
            effectRef.current.start()
          } else {
            effectRef.current.stop()
          }
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
      className="loader-container fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="loader-text text-5xl font-montreal opacity-0 transform">
        Loading
      </div>
    </div>
  )
}
