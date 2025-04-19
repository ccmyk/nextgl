// src/hooks/useRollTimeline.js

'use client'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function useRollTimeline({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const { uniforms } = meshRef.current.program

    gsap.timeline()
      .fromTo(uniforms.uChange, { value: 0 }, { value: 1, duration: 1.5, ease: 'power2.inOut' })
  }, [meshRef])
}