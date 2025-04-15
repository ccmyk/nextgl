// src/hooks/useLoaderAnimation.js

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function useLoaderAnimation({ program, renderer, mesh }) {
  const active = useRef(1)
  const raf = useRef()

  useEffect(() => {
    const startTime = performance.now()

    const animate = (t) => {
      if (active.current !== 0) {
        program.uniforms.uTime.value = (t - startTime) * 0.001
        renderer.render({ scene: mesh })
        raf.current = requestAnimationFrame(animate)
      }
    }

    raf.current = requestAnimationFrame(animate)

    const animstart = gsap.timeline({
      paused: false,
      onComplete: () => {
        active.current = 0
      },
    })
      .fromTo(program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: 'power2.inOut' }, 0)

    return () => {
      cancelAnimationFrame(raf.current)
      active.current = 0
    }
  }, [program, renderer, mesh])
}