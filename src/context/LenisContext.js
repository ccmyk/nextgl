'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext(null)

export function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // 1. Instantiate
    lenisRef.current = new Lenis({
      wheelEventsTarget: document.documentElement,
      lerp: 0.04,
      duration: 0.8,
      smoothWheel: true,     // !isTouch
      smoothTouch: false,
      normalizeWheel: true
    })
    lenisRef.current.stop()

    // 2. RAF loop
    let id
    function raf(t) {
      lenisRef.current.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(id)
      // no built-in destroy needed
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}

export function useLenis() {
  return useContext(LenisContext)
}