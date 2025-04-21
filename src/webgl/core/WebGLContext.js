'use client'

import { createContext, useContext, useRef, useEffect } from 'react'
import { webgl } from './WebGLManager'
import gsap from 'gsap'
import Lenis from '@studio-freight/lenis'

const WebGLContext = createContext(null)

export function WebGLProvider({ children }) {
  const canvasRef = useRef(null)
  const lenisRef = useRef(null)
  const isInitializedRef = useRef(false)

  // Initialize WebGL system
  useEffect(() => {
    if (isInitializedRef.current) return
    
    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1;
    `
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    // Initialize WebGL with same settings as legacy
    webgl.init(canvas)

    // Initialize Lenis with same config as legacy
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Animation loop with same timing as legacy
    gsap.ticker.add((time) => {
      lenisRef.current.raf(time * 1000)
    })

    // Handle resize
    const handleResize = () => {
      const { innerWidth: width, innerHeight: height } = window
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      webgl.resize(width, height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    isInitializedRef.current = true

    return () => {
      window.removeEventListener('resize', handleResize)
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      webgl.destroy()
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [])

  // Functions for component coordination
  const startTransition = async (from, to) => {
    if (!webgl.active) return
    await webgl.transition(from, to)
  }

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: 0,
        immediate: false,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options
      })
    }
  }

  return (
    <WebGLContext.Provider value={{
      webgl,
      lenis: lenisRef.current,
      startTransition,
      scrollTo
    }}>
      {children}
    </WebGLContext.Provider>
  )
}

export function useWebGL() {
  const context = useContext(WebGLContext)
  if (!context) {
    throw new Error('useWebGL must be used within WebGLProvider')
  }
  return context
}
