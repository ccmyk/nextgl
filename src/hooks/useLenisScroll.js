// src/hooks/useLenisScroll.js

'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function useLenisScroll({
  lerp = 0.04,
  duration = 0.8,
  smoothWheel = true,
  smoothTouch = false,
  normalizeWheel = true,
  onScroll = null
} = {}) {
  const lenis = useRef(null)

  useEffect(() => {
    lenis.current = new Lenis({
      lerp,
      duration,
      smoothWheel,
      smoothTouch,
      normalizeWheel,
      wheelEventsTarget: document.documentElement
    })

    const update = (time) => {
      lenis.current.raf(time)
      requestAnimationFrame(update)
    }

    requestAnimationFrame(update)

    if (onScroll) {
      lenis.current.on('scroll', onScroll)
    }

    return () => {
      lenis.current.destroy()
    }
  }, [])

  return lenis
}