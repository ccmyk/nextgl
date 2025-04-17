// src/hooks/useFooterTimeline.js

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function useFooterTimeline({ post }) {
  const animmouse = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(
      post.passes[0].program.uniforms.uMouseT,
      { value: 0.2 },
      { value: 2, duration: 0.3, ease: 'power2.inOut' },
      0.1
    )
      .fromTo(
        post.passes[0].program.uniforms.uMouseT,
        { value: 2 },
        { value: 0, duration: 0.3, ease: 'power2.inOut' },
        0.7
      )
      .fromTo(
        post.passes[0].program.uniforms.uMouse,
        { value: 0.39 },
        { value: 0.8, duration: 0.9, ease: 'none' },
        0.1
      )

    animmouse.current = tl
  }, [post])

  return animmouse
}