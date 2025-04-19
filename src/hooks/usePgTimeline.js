// src/hooks/usePgTimeline.js

'use client'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function usePgTimeline({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const { uniforms } = meshRef.current.program

    gsap.to(uniforms.uStart, {
      value: 1,
      duration: 2,
      ease: 'power2.inOut',
    })
  }, [meshRef])
}