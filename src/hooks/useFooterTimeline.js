// src/hooks/useFooterTimeline.js

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function useFooterTimeline(postRef, canvasRef) {
  const animCtrRef = useRef(null)
  const animMouseRef = useRef(null)

  useEffect(() => {
    if (!postRef.current || !canvasRef.current) return

    const pass = postRef.current.passes[0]

    // Timeline for scroll-based transition
    animCtrRef.current = gsap.timeline({ paused: true })
      .fromTo(pass.program.uniforms.uTime, { value: 0 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0)
      .fromTo(pass.program.uniforms.uTime, { value: 2 }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(pass.program.uniforms.uStart, { value: 0.39 }, { value: 0.8, duration: 1, ease: 'power2.inOut' }, 0)

    // Timeline for pointer/mouse interaction
    animMouseRef.current = gsap.timeline({ paused: true })
      .fromTo(pass.program.uniforms.uMouseT, { value: 0.2 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0.1)
      .fromTo(pass.program.uniforms.uMouseT, { value: 2 }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(pass.program.uniforms.uMouse, { value: 0.39 }, { value: 0.8, duration: 0.9, ease: 'none' }, 0.1)

    return () => {
      animCtrRef.current?.kill()
      animMouseRef.current?.kill()
    }
  }, [postRef, canvasRef])

  return {
    animCtr: animCtrRef,
    animMouse: animMouseRef,
  }
}
