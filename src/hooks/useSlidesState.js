// src/hooks/useSlidesState.js

'use client'

import { useEffect } from 'react'
import { clamp, lerp } from '@/lib/utils/math'

export default function useSlidesState({
  elRef, ctrRef, canvas, post, meshesRef, texturesRef, renderer,
  device, viewport, screen, dataset, objPos, slideAnimRef
}) {
  useEffect(() => {
    const el = elRef.current
    const bound = el.getBoundingClientRect()

    ctrRef.current.start = parseInt(bound.y - screen.h + window.scrollY + screen.h * 0.5)
    ctrRef.current.limit = parseInt(el.clientHeight + screen.h * 0.5)
  }, [elRef, screen])

  useEffect(() => {
    const raf = () => {
      ctrRef.current.progt = parseFloat(ctrRef.current.current / ctrRef.current.limit).toFixed(3)
      ctrRef.current.prog = lerp(ctrRef.current.prog, ctrRef.current.progt, 0.015)
      if (slideAnimRef.current) {
        slideAnimRef.current.progress(ctrRef.current.prog)
      }
      post.render({ scene: meshesRef.current[0] })
      requestAnimationFrame(raf)
    }
    raf()
    return () => cancelAnimationFrame(raf)
  }, [])
}