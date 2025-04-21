'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useWebGL } from '@/context/WebGLContext'
import gsap from 'gsap'

export function useWebGLAnimation(elementRef, options = {}) {
  const { gl } = useWebGL()
  const timelineRef = useRef(null)
  const uniformsRef = useRef({
    uStart: { value: 1 },
    uPower: { value: 0.5 },
    uKey: { value: -1 }
  })

  // Store GSAP instances
  const animationInstancesRef = useRef({})

  const startAnimation = useCallback(() => {
    if (!elementRef.current || !uniformsRef.current) return

    // Create timeline with the exact same timing and easing from legacy code
    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (!elementRef.current) return
        // Use React state instead of classList
        options.onComplete?.()
      }
    })

    // Replicate exact legacy animation timing
    timeline
      .fromTo(uniformsRef.current.uStart,
        { value: 1 },
        {
          value: 0,
          duration: 0.8,
          ease: 'power4.inOut'
        }
      , 0)
      .fromTo(uniformsRef.current.uPower,
        { value: 0.5 },
        {
          value: 0,
          duration: 2,
          ease: 'power2.inOut'
        }
      , 0)
      .set(uniformsRef.current.uKey,
        {
          value: -1,
          onComplete: () => {
            options.onActiveChange?.(true)
          }
        }
      , '>')

    timelineRef.current = timeline
    return timeline
  }, [elementRef, options])

  // Handle intersection
  const handleIntersection = useCallback((isIntersecting) => {
    if (!timelineRef.current) return
    
    if (isIntersecting) {
      timelineRef.current.play()
      options.onVisibilityChange?.(true)
    } else {
      if (timelineRef.current.progress() !== 1) return
      options.onVisibilityChange?.(false)
    }
  }, [options])

  // Set up intersection observer using refs
  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => handleIntersection(entry.isIntersecting),
      { threshold: 0.1 }
    )

    observer.observe(elementRef.current)
    startAnimation()

    return () => {
      observer.disconnect()
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      // Clean up any GSAP instances
      Object.values(animationInstancesRef.current).forEach(instance => {
        if (instance.kill) instance.kill()
      })
    }
  }, [elementRef, handleIntersection, startAnimation])

  // Quick animations for mouse movement - exact same timing as legacy
  const createQuickAnimation = useCallback((property) => {
    if (!elementRef.current) return
    
    return gsap.quickTo(elementRef.current, property, {
      duration: 0.05,
      ease: "none"
    })
  }, [elementRef])

  return {
    uniforms: uniformsRef.current,
    createQuickAnimation,
    startAnimation,
    timeline: timelineRef.current
  }
}
