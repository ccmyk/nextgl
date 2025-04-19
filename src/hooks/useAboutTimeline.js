// src/hooks/useAboutTimeline.js

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function useAboutTimeline({ post }) {
  const animTimeline = useRef(null)

  useEffect(() => {
    const u = post.passes[0].program.uniforms

    const tl = gsap.timeline({ paused: true })
    tl.fromTo(u.uMouseT, { value: 0.2 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0.1)
    tl.fromTo(u.uMouseT, { value: 2 }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
    tl.fromTo(u.uMouse, { value: -1 }, { value: 0.8, duration: 0.9, ease: 'none' }, 0.1)

    animTimeline.current = tl
  }, [post])
}