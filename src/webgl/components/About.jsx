'use client'

import { useRef, useEffect, useState } from 'react'
import { About as AboutEffect } from '@/webgl/components/About'
import { useWebGL } from '@/webgl/core/WebGLContext'
import SplitType from 'split-type'
import gsap from 'gsap'

export default function About({ 
  text,
  className,
  onReady 
}) {
  const containerRef = useRef(null)
  const effectRef = useRef(null)
  const textRef = useRef(null)
  const splitRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  const { webgl } = useWebGL()

  // Initialize WebGL effect with same setup as legacy
  useEffect(() => {
    if (!containerRef.current) return

    const bounds = containerRef.current.getBoundingClientRect()
    
    effectRef.current = new AboutEffect({
      element: containerRef.current,
      bounds,
      camera: webgl.camera,
      scene: webgl.scene
    })

    // Register with WebGL manager
    webgl.registerComponent('about', effectRef.current)

    // Initialize text splitting exactly like legacy
    if (textRef.current) {
      splitRef.current = new SplitType(textRef.current, {
        types: 'chars,words'
      })

      // Add character wrappers
      splitRef.current.chars.forEach(char => {
        const wrapper = document.createElement('span')
        wrapper.classList.add('char-wrapper')

        const inner = document.createElement('span')
        inner.classList.add('n')
        inner.textContent = char.textContent

        char.textContent = ''
        wrapper.appendChild(inner)
        char.appendChild(wrapper)
      })
    }

    // Handle resize
    const handleResize = () => {
      const newBounds = containerRef.current.getBoundingClientRect()
      if (effectRef.current?.resize) {
        effectRef.current.resize(
          window.innerWidth,
          window.innerHeight,
          newBounds
        )
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Start effect
    effectRef.current.start()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (effectRef.current) {
        webgl.unregisterComponent('about')
        effectRef.current.destroy()
      }
      if (splitRef.current?.revert) {
        splitRef.current.revert()
      }
    }
  }, [webgl])

  // Mouse interaction with same behavior as legacy
  useEffect(() => {
    if (!containerRef.current || !effectRef.current) return

    const handleMouseEnter = () => {
      effectRef.current.stopt = 0
      effectRef.current.lerp = 0.02
    }

    const handleMouseMove = (e) => {
      const bounds = containerRef.current.getBoundingClientRect()
      let norm = e.layerY / bounds.height
      norm = Math.max(0, Math.min(1, norm))
      effectRef.current.norm = parseFloat(norm).toFixed(3)
    }

    const handleMouseLeave = (e) => {
      effectRef.current.lerp = 0.01
      const bounds = containerRef.current.getBoundingClientRect()
      let norm = e.layerY / bounds.height
      effectRef.current.norm = parseFloat(norm).toFixed(3)
    }

    const touch = 'ontouchstart' in window
    const element = containerRef.current

    if (!touch) {
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseleave', handleMouseLeave)
    } else {
      element.addEventListener('touchstart', handleMouseEnter)
      element.addEventListener('touchmove', handleMouseMove)
      element.addEventListener('touchend', handleMouseLeave)
    }

    return () => {
      if (!touch) {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
      } else {
        element.removeEventListener('touchstart', handleMouseEnter)
        element.removeEventListener('touchmove', handleMouseMove)
        element.removeEventListener('touchend', handleMouseLeave)
      }
    }
  }, [])

  // Handle intersection with same behavior as legacy
  useEffect(() => {
    if (!containerRef.current || !effectRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (effectRef.current) {
          if (entry.isIntersecting) {
            effectRef.current.start()
            setIsActive(true)
          } else {
            effectRef.current.stop()
            setIsActive(false)
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
      className={`about-container relative ${className || ''} ${isActive ? 'is-active' : ''}`}
    >
      <div className="about-content">
        <div ref={textRef} className="Oiel">{text}</div>
      </div>
      <div className="cCover absolute inset-0">
        {/* WebGL canvas gets mounted here */}
      </div>
    </div>
  )
}
