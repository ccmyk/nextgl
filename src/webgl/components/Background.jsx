'use client'

import { useRef, useEffect, useState } from 'react'
import { useWebGL } from '@/context/WebGLContext'
import { Background as BackgroundEffect } from '@/webgl/components/Background'
import gsap from 'gsap'

export default function Background() {
  const containerRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const { gl } = useWebGL()

  // Initialize WebGL effect through React lifecycle
  useEffect(() => {
    if (!containerRef.current || !gl) return

    const bounds = containerRef.current.getBoundingClientRect()
    const effect = new BackgroundEffect({
      element: containerRef.current,
      bounds,
      gl
    })

    // Store effect reference in React ref
    containerRef.current.effect = effect

    // Manage noise animation through React
    const animate = () => {
      if (!effect.active) return
      
      const time = performance.now() * 0.001
      effect.uniforms.uStartX.value = Math.sin(time * 0.1) * 0.1
      effect.uniforms.uStartY.value = Math.cos(time * 0.15) * 0.1
    }

    // Animation timeline managed by React
    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => setIsActive(true),
      onUpdate: animate
    })

    timeline
      .fromTo(effect.uniforms.uStart0,
        { value: 0 },
        {
          value: 1,
          duration: 1.2,
          ease: 'power4.inOut'
        }
      )
      .fromTo(effect.uniforms.uStart1,
        { value: 0 },
        {
          value: 1,
          duration: 2,
          ease: 'power2.inOut'
        }, 0)

    effect.start()
    timeline.play()

    // Handle resize through React
    const handleResize = () => {
      if (!effect.resize) return
      
      effect.resize(
        window.innerWidth,
        window.innerHeight
      )
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      timeline.kill()
      effect.destroy()
    }
  }, [gl])

  // Handle intersection through React
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const effect = containerRef.current.effect
        if (!effect) return

        if (entry.isIntersecting) {
          effect.start()
          setIsActive(true)
        } else {
          effect.stop()
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
      className={`background-effect fixed inset-0 z-0 ${isActive ? 'is-active' : ''}`}
      aria-hidden="true"
    />
  )
}
