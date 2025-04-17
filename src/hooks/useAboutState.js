// src/hooks/useAboutState.js

import { useEffect, useRef } from 'react'
import { clamp, lerp } from '@/lib/utils/math'

export default function useAboutState({ elRef, post, renderer, scene, camera, screen, viewport }) {
  const ctr = useRef({ actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, stop: 0 })

  useEffect(() => {
    const el = elRef.current
    const bound = el.getBoundingClientRect()
    const calc = screen[1] * 0.5
    const start = parseInt(bound.y - screen[1] + window.scrollY + calc)
    const limit = parseInt(el.clientHeight + calc)

    ctr.current.start = start
    ctr.current.limit = limit
  }, [elRef, screen])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!renderer || ctr.current.stop === 1) return

      ctr.current.progt = parseFloat(ctr.current.current / ctr.current.limit).toFixed(3)
      ctr.current.prog = lerp(ctr.current.prog, ctr.current.progt, 0.015)
      post.render({ scene, camera })
    }, 16)

    return () => clearInterval(interval)
  }, [post, scene, camera, renderer])
}