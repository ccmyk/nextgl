// src/hooks/useTitleTimeline.js

'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function useTitleTimeline({ programRef, postRef }) {
  const tl = useRef(null)

  useEffect(() => {
    if (!programRef.current || !postRef.current) return

    tl.current = gsap.timeline({ paused: true })
    .fromTo(programRef.current.uniforms.uKey, { value: -1 }, { value: 1, duration: 2, ease: 'power2.inOut' }, 0)
    .fromTo(programRef.current.uniforms.uPower, { value: 2 }, { value: 0, duration: 2, ease: 'power4.out' }, 0)

    return () => {
      tl.current?.kill()
    }
  }, [programRef, postRef])

  return {
    timeline: tl.current,
    cleanup: () => tl.current?.kill(),
  }
}