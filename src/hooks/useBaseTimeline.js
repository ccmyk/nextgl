// src/hooks/useBaseTimeline.js

import { useEffect } from 'react'
import gsap from 'gsap'

export default function useBaseTimeline({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const u = meshRef.current.program.uniforms

    gsap.timeline({ paused: false })
      .to(u.uStart, { value: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
  }, [meshRef])
}