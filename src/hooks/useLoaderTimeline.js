// src/hooks/useLoaderTimeline.js

'use client'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function useLoaderTimeline({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const u = meshRef.current.program.uniforms

    gsap.timeline({ repeat: -1 })
      .to(u.uStartX, { value: 1, duration: 1, ease: 'power1.inOut' }, 0)
      .to(u.uStartY, { value: 0.5, duration: 1, ease: 'power1.inOut' }, 0)
      .to(u.uStart1, { value: 0.25, duration: 1, ease: 'power1.inOut' }, 0)
      .to(u.uStart2, { value: 0.85, duration: 1, ease: 'power1.inOut' }, 0)
  }, [meshRef])
}