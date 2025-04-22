'use client'

import { useRef, useEffect, useState } from 'react'
import { useWebGL } from '@/webgl/core/WebGLContext'
import { Title } from '@/webgl/components/Title'
import gsap from 'gsap'
import SplitType from 'split-type'

export function useTitle(options = {}) {
  const [isActive, setIsActive] = useState(false)
  const effectRef = useRef(null)
  const textRef = useRef(null)
  const splitRef = useRef(null)
  const { gl, scene, camera } = useWebGL()

  // Initialize text splitting exactly like legacy
  useEffect(() => {
    if (!textRef.current) return

    // Create split instance with same config as legacy
    splitRef.current = new SplitType(textRef.current, {
      types: 'chars,words',
      tagName: 'span'
    })

    // Store ref for WebGL component
    effectRef.current.tt = textRef.current

    return () => {
      if (splitRef.current?.revert) {
        splitRef.current.revert()
      }
    }
  }, [])

  // Initialize WebGL effect
  useEffect(() => {
    if (!textRef.current || !gl || !scene || !camera) return

    const bounds = textRef.current.getBoundingClientRect()
    
    // Create title with same setup as legacy
    effectRef.current = new Title({
      gl,
      scene,
      camera,
      element: textRef.current,
      bounds
    })

    // Handle resize
    const handleResize = () => {
      if (!effectRef.current?.resize) return
      effectRef.current.resize(
        window.innerWidth,
        window.innerHeight
      )
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (effectRef.current) {
        effectRef.current.destroy()
      }
    }
  }, [gl, scene, camera])

  // Handle intersection observer with same timing as legacy
  useEffect(() => {
    if (!textRef.current || !effectRef.current) return

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

    observer.observe(textRef.current)
    return () => observer.disconnect()
  }, [])

  // Mouse interaction handlers with exact same timing as legacy
  const handleMouseEnter = (e) => {
    if (!effectRef.current) return
    effectRef.current.handleMouseEnter(e)
  }

  const handleMouseMove = (e) => {
    if (!effectRef.current) return
    effectRef.current.handleMouseMove(e)
  }

  const handleMouseLeave = (e) => {
    if (!effectRef.current) return
    effectRef.current.handleMouseLeave(e)
  }

  return {
    textRef,
    effectRef,
    isActive,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    }
  }
}

export default useTitle
