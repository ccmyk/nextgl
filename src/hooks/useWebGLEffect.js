'use client'

import { useEffect, useRef } from 'react'
import { useWebGL } from '@/webgl/core/WebGLContext'
import gsap from 'gsap'

// Same timing and animation values as legacy
const DEFAULT_TIMINGS = {
  LERP_ACTIVE: 0.06,
  LERP_INACTIVE: 0.03,
  POWER_IN_DURATION: 0.36,
  POWER_OUT_DURATION: 0.6,
  START_DURATION: 0.8,
  POWER_DURATION: 2,
}

export function useWebGLEffect(effectRef, options = {}) {
  const { webgl } = useWebGL()
  const timelineRef = useRef(null)
  const isActiveRef = useRef(false)

  // Animation timeline setup - exact same as legacy
  useEffect(() => {
    if (!effectRef.current) return

    timelineRef.current = gsap.timeline({ 
      paused: true,
      onComplete: () => {
        if (effectRef.current?.element) {
          effectRef.current.element.classList.add('act')
        }
      }
    })

    timelineRef.current
      .fromTo(effectRef.current.uniforms.uStart,
        { value: 1 },
        {
          value: 0,
          duration: DEFAULT_TIMINGS.START_DURATION,
          ease: 'power4.inOut'
        }
      )
      .fromTo(effectRef.current.uniforms.uPower,
        { value: 0.5 },
        {
          value: 0,
          duration: DEFAULT_TIMINGS.POWER_DURATION,
          ease: 'power2.inOut'
        }
      )
      .set(effectRef.current.uniforms.uKey,
        {
          value: -1
        }
      )

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [effectRef])

  // Handle mouse interactions
  const handleMouseEnter = () => {
    if (!effectRef.current) return
    
    effectRef.current.lerp = DEFAULT_TIMINGS.LERP_ACTIVE

    gsap.to(effectRef.current.uniforms.uPower, {
      value: 1,
      duration: DEFAULT_TIMINGS.POWER_IN_DURATION,
      ease: 'power4.inOut'
    })
  }

  const handleMouseLeave = () => {
    if (!effectRef.current) return

    effectRef.current.lerp = DEFAULT_TIMINGS.LERP_INACTIVE

    gsap.to(effectRef.current.uniforms.uPower, {
      value: 0,
      duration: DEFAULT_TIMINGS.POWER_OUT_DURATION,
      ease: 'power2.inOut'
    })
  }

  const updateMousePosition = (e) => {
    if (!effectRef.current?.handleMouseMove) return
    effectRef.current.handleMouseMove(e)
  }

  return {
    handleMouseEnter,
    handleMouseLeave,
    updateMousePosition,
    timeline: timelineRef.current
  }
}
