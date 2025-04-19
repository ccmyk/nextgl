// src/hooks/useBackgroundTimeline.js

'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

export default function useBackgroundTimeline({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const u = meshRef.current.program.uniforms

    gsap.timeline({ paused: false })
      .fromTo(u.uStart0, { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo(u.uStart1, { value: 0.5 }, { value: 1, duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo(u.uStart2, { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0.4)
  }, [meshRef])
}