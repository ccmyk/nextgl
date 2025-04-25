'use client'

import React, { createContext, useContext, useRef, useEffect, useCallback, useMemo } from 'react'
import { webgl } from './WebGLManager'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'

const WebGLContext = createContext({
  webgl:   null,
  lenis:   null,
  scrollTo: () => {},
})

export function WebGLProvider({ children }) {
  const canvasRef = useRef(null)
  const lenisRef  = useRef(null)

  // Initialize once
  useEffect(() => {
    if (canvasRef.current) return

    // 1) Create and style the shared <canvas>
    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, {
      position:       'fixed',
      top:            0,
      left:           0,
      width:         '100vw',
      height:        '100vh',
      pointerEvents: 'none',
      zIndex:        1,
    })
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    // 2) Init WebGLManager
    webgl.init(canvas)

    // 3) Init Lenis scroller
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing:   (t) => Math.min(1, 1.001 - 2**(-10 * t)),
      orientation:       'vertical',
      gestureOrientation:'vertical',
      smoothWheel:       true,
      wheelMultiplier:   1,
      smoothTouch:       false,
      touchMultiplier:   2,
      infinite:          false,
    })

    // sync Lenis with GSAP ticker
    gsap.ticker.add((t) => {
      lenisRef.current.raf(t * 1000)
    })

    // 4) Resize observer
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width  = w * window.devicePixelRatio
      canvas.height = h * window.devicePixelRatio
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      webgl.resize(w, h)
    }
    window.addEventListener('resize', onResize)
    onResize()

    // cleanup
    return () => {
      window.removeEventListener('resize', onResize)
      lenisRef.current?.destroy()
      webgl.destroy()
      canvas.remove()
    }
  }, [])

  // scrollTo helper
  const scrollTo = useCallback((target, options = {}) => {
    lenisRef.current?.scrollTo(target, {
      offset:  0,
      duration: 1.2,
      easing:  (t) => Math.min(1, 1.001 - 2**(-10 * t)),
      ...options
    })
  }, [])

  // Context value memoization
  const value = useMemo(() => ({
    webgl,
    lenis: lenisRef.current,
    scrollTo,
  }), [scrollTo])

  return (
    <WebGLContext.Provider value={value}>
      {children}
    </WebGLContext.Provider>
  )
}

export function useWebGL() {
  const ctx = useContext(WebGLContext)
  if (!ctx.webgl) {
    throw new Error('useWebGL() must be inside <WebGLProvider>')
  }
  return ctx
}