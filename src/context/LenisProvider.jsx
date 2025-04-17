// src/context/LenisProvider.jsx

'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { useAppContext } from './AppProvider'

// Create context for Lenis
const LenisContext = createContext(null)

export function LenisProvider({ children }) {
  const { lenis, isReady, setIsReady } = useAppContext()
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const rafId = useRef(null)
  const scrollFnRef = useRef(null)

  // Function to handle scroll events
  const handleScroll = (e) => {
    if (scrollFnRef.current) {
      scrollFnRef.current(e)
    }
  }

  // Initialize Lenis on component mount
  useEffect(() => {
    // Check if it's a touch device
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0
      )
    }
    
    checkTouch()

    // Create Lenis instance
    const lenisInstance = new Lenis({
      wheelEventsTarget: document.documentElement,
      lerp: 0.04,
      duration: 0.8,
      smoothWheel: !isTouchDevice,
      smoothTouch: false,
      normalizeWheel: true,
    })

    // Store in ref from AppContext
    lenis.current = lenisInstance

    // Initially stop Lenis until app is ready
    lenisInstance.stop()

    // Set up RAF for Lenis
    const raf = (time) => {
      lenisInstance.raf(time)
      rafId.current = requestAnimationFrame(raf)
    }
    
    rafId.current = requestAnimationFrame(raf)

    // Register scroll event handler
    lenisInstance.on('scroll', handleScroll)

    // Cleanup on unmount
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      
      lenisInstance.off('scroll', handleScroll)
      lenisInstance.destroy()
    }
  }, [lenis, isTouchDevice])

  // Start Lenis when app is ready
  useEffect(() => {
    if (isReady && lenis.current) {
      lenis.current.start()
    }
  }, [isReady, lenis])

  // Register a scroll callback function
  const registerScrollCallback = (callback) => {
    scrollFnRef.current = callback
    return () => {
      scrollFnRef.current = null
    }
  }

  return (
    <LenisContext.Provider 
      value={{ 
        lenis: lenis.current,
        registerScrollCallback
      }}
    >
      {children}
    </LenisContext.Provider>
  )
}

// Hook to use Lenis in components
export function useLenis() {
  const context = useContext(LenisContext)
  if (context === undefined) {
    throw new Error('useLenis must be used within a LenisProvider')
  }
  return context
}