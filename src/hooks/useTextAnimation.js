'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useTextAnimation(options = {}) {
  const elementRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const dispatchAnim = (state) => {
      const event = new CustomEvent('anim', {
        detail: {
          state,
          el: element
        }
      })
      document.dispatchEvent(event)
    }

    // Initial setup - exactly as legacy
    dispatchAnim(0)

    // Setup custom cleanup if provided
    const cleanup = options.onCleanup

    return () => {
      if (cleanup) cleanup()
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [options])

  // Helper to trigger animations
  const animate = (state) => {
    if (!elementRef.current) return

    const event = new CustomEvent('anim', {
      detail: {
        state,
        el: elementRef.current
      }
    })
    document.dispatchEvent(event)
  }

  return [elementRef, animate]
}

// Mouse text animation hook - exact same timing as legacy
export function useMouseText() {
  const [ref, animate] = useTextAnimation()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Initial state
    animate(0)

    // Animate in with delay from legacy
    const timeout = setTimeout(() => {
      animate(1)
    }, 6) // Same 6ms delay as legacy

    return () => {
      clearTimeout(timeout)
      // Clean up animation
      if (element) {
        gsap.to(element.querySelectorAll('.char'), {
          opacity: 0,
          y: '-100%',
          duration: 0.2,
          stagger: 0.01,
          ease: 'power2.in'
        })
      }
    }
  }, [animate])

  return ref
}
