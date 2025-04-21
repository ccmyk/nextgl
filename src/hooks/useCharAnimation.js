'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useCharAnimation(ref, { onComplete } = {}) {
  const timelineRef = useRef(null)
  const lerpRef = useRef(0.06)
  const coordsRef = useRef([0, 0])
  const endRef = useRef([0, 0])
  const normRef = useRef([0, 0])
  
  useEffect(() => {
    if (!ref.current) return
    
    const timeline = gsap.timeline({
      paused: true,
      onComplete
    })
    
    timelineRef.current = timeline
    
    return () => {
      timeline.kill()
    }
  }, [ref, onComplete])

  const animateIn = () => {
    if (!timelineRef.current) return
    
    lerpRef.current = 0.06
    timelineRef.current
      .to(ref.current, {
        duration: 0.36,
        ease: 'power4.inOut',
      })
      .play()
  }

  const animateOut = () => {
    if (!timelineRef.current) return
    
    lerpRef.current = 0.03
    timelineRef.current
      .to(ref.current, {
        duration: 0.6,
        ease: 'power2.inOut',
      })
      .play()
  }

  return {
    animateIn,
    animateOut,
    lerp: lerpRef,
    coords: coordsRef,
    end: endRef,
    norm: normRef
  }
}
