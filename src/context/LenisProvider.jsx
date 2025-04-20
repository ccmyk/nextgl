// src/context/LenisProvider.jsx

'use client'

import { createContext, useContext, useRef, useEffect, useState } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext({ lenis: null })

export function LenisProvider({ children }) {
  const [isReady, setIsReady] = useState(false)
  const lenisRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    // Initialize Lenis only on client-side
    if (typeof window === 'undefined') return

    // Create Lenis instance with configuration
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Set up the animation loop
    function raf(time) {
      lenisRef.current?.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    // Start the animation loop
    rafRef.current = requestAnimationFrame(raf)
    setIsReady(true)

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      // Destroy Lenis instance
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return (
    <LenisContext.Provider value={{ lenis: lenisRef, isReady }}>
      {children}
    </LenisContext.Provider>
  )
}

export const useLenis = () => {
  const context = useContext(LenisContext)
  
  if (context === undefined) {
    throw new Error('useLenis must be used within a LenisProvider')
  }
  
  return context
}
