'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

// Replicate the exact lerp function from legacy code
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

export function useUniformAnimation(uniforms, options = {}) {
  const lerpRef = useRef(0.06) // Same lerp value as legacy
  const normRef = useRef([0, 0])
  const endRef = useRef([0, 0])
  const powerRef = useRef(options.initialPower || 0.5) // Legacy initial power value

  // Animation state management without DOM manipulation
  const animate = useCallback((state) => {
    if (!uniforms.current) return

    // Use the exact same animation configuration as legacy
    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (state === 'in') {
          lerpRef.current = 0.06 // Same as legacy mouseenter lerp
        } else {
          lerpRef.current = 0.03 // Same as legacy mouseleave lerp
        }
      }
    })

    if (state === 'in') {
      timeline
        .fromTo(uniforms.current.uPower,
          { value: powerRef.current },
          {
            value: 1,
            duration: 0.36, // Exact legacy duration
            ease: 'power4.inOut' // Exact legacy easing
          }
        )
    } else {
      timeline
        .to(uniforms.current.uPower,
          {
            value: 0,
            duration: 0.6, // Exact legacy duration
            ease: 'power2.inOut', // Exact legacy easing
            onComplete: () => {
              uniforms.current.uKey.value = -1 // Legacy reset behavior
            }
          }
        )
    }

    timeline.play()
  }, [uniforms])

  // Update function that uses the same lerp logic as legacy
  const update = useCallback(() => {
    if (!uniforms.current) return

    endRef.current[0] = lerp(endRef.current[0], normRef.current[0], lerpRef.current)
    endRef.current[1] = lerp(endRef.current[1], normRef.current[1], lerpRef.current)

    uniforms.current.uMouse.value = [endRef.current[0], 0]
    uniforms.current.uTime.value = performance.now() * 0.001
  }, [uniforms])

  // Handle mouse movement with the same constraints as legacy
  const handleMouseMove = useCallback((x, y, bounds) => {
    if (!uniforms.current) return

    const normalizedX = ((x / bounds.width) * 2 - 1)
    const normalizedY = (-(y / bounds.height) * 2 + 1)

    normRef.current = [normalizedX, normalizedY]
  }, [uniforms])

  return {
    animate,
    update,
    handleMouseMove,
    endRef,
    normRef,
    lerpRef
  }
}
