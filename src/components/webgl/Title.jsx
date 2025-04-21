'use client'

import { useRef, useEffect, useState } from 'react'
import { Title as TitleEffect } from '@/webgl/components/Title'
import { webgl } from '@/webgl/core/WebGLManager'
import SplitType from 'split-type'
import gsap from 'gsap'

// Component maintains exact same visual appearance and interaction
export default function Title({ children, text, className }) {
  const containerRef = useRef(null)
  const effectRef = useRef(null)
  const splitRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  // Initialize text splitting with same configuration as legacy
  useEffect(() => {
    if (!containerRef.current) return

    // Use same SplitType setup as legacy
    splitRef.current = new SplitType(containerRef.current, {
      types: 'chars',
      tagName: 'span'
    })

    // Add character wrappers exactly like legacy
    if (splitRef.current.chars) {
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

    return () => {
      if (splitRef.current?.revert) {
        splitRef.current.revert()
      }
    }
  }, [text])

  // Initialize WebGL effect
  useEffect(() => {
    if (!containerRef.current) return

    const bounds = containerRef.current.getBoundingClientRect()
    
    effectRef.current = new TitleEffect({
      element: containerRef.current,
      bounds,
    })

    // Register with manager
    webgl.registerComponent('title', effectRef.current)

    const handleResize = () => {
      const newBounds = containerRef.current.getBoundingClientRect()
      if (effectRef.current?.resize) {
        effectRef.current.resize(newBounds)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (effectRef.current) {
        webgl.unregisterComponent('title')
        effectRef.current.destroy()
      }
    }
  }, [])

  // Handle mouse interactions with same timing as legacy
  useEffect(() => {
    if (!containerRef.current || !effectRef.current) return

    const handleMouseEnter = (e) => {
      if (!isActive) setIsActive(true)
      effectRef.current.lerp = 0.06 // Same as legacy mouseenter
      
      gsap.to(effectRef.current.uniforms.uPower, {
        value: 1,
        duration: 0.36,
        ease: 'power4.inOut'
      })
    }

    const handleMouseMove = (e) => {
      if (effectRef.current?.handleMouseMove) {
        effectRef.current.handleMouseMove(e)
      }
    }

    const handleMouseLeave = (e) => {
      effectRef.current.lerp = 0.03 // Same as legacy mouseleave

      gsap.to(effectRef.current.uniforms.uPower, {
        value: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      })
    }

    const element = containerRef.current
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isActive])

  return (
    <div 
      ref={containerRef}
      className={`title-effect ${isActive ? 'is-active' : ''} ${className || ''}`}
      data-text={text}
    >
      {children}
    </div>
  )
}
