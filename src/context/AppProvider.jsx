'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { create } from 'zustand'
import LoaderInterface from '@/components/interface/Loader'
import { useLenis } from '@/context/LenisContext'
import { useWebGL } from '@/context/WebGLContext'
import { useAppEvents } from '@/context/AppEventsContext'

// 1) your Zustand store
const useAppStore = create((set) => ({
  // state
  isLoaded: false,
  currentPage: null,
  isNavigating: false,
  menuOpen: false,
  theme: 'light',
  dimensions: { width: 0, height: 0 },
  deviceClass: '',
  deviceNum: 0,
  isTouch: false,
  webp: false,
  webm: false,
  vidauto: false,
  // actions
  setLoaded: () => set({ isLoaded: true }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setNavigating: (nav) => set({ isNavigating: nav }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  setTheme: (theme) => set({ theme }),
  setDimensions: (d) => set({ dimensions: d }),
  initializeDevice: () => {
    const ua = navigator.userAgent
    const isTouch = /Mobi|Android|Tablet|iPad|iPhone/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    let deviceNum = 0, deviceClass = 'desktop'
    const w = window.innerWidth, h = window.innerHeight

    if (!isTouch) {
      deviceClass = 'desktop'
      deviceNum = w > 1780 ? -1 : 0
      document.documentElement.classList.add('D')
    } else {
      document.documentElement.classList.add('T')
      if (w > 767) {
        if (w > h) { deviceClass = 'tabletL'; deviceNum = 1 }
        else        { deviceClass = 'tabletS'; deviceNum = 2 }
      } else {
        deviceClass = 'mobile'; deviceNum = 3
      }
      document.documentElement.classList.add(deviceClass)
    }

    const canvas = document.createElement('canvas')
    const webp = canvas.toDataURL('image/webp').includes('data:image/webp') ? 1 : 0
    let webm = true
    if (ua.includes('Safari') && !ua.includes('Chrome')) webm = false

    set({ isTouch, deviceNum, deviceClass, webp, webm, vidauto: 0 })
  }
}))

// 2) AppContext for refs + helpers
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const store = useAppStore()
  const {
    isLoaded,
    setLoaded,
    initializeDevice,
    setDimensions,
    dimensions
  } = store

  // React contexts
  const lenis       = useLenis()
  const { scrollTo } = useWebGL()
  const { dispatchAnim } = useAppEvents()

  // DOM refs
  const mainRef    = useRef(null)
  const pageRef    = useRef(null)
  const contentRef = useRef(null)
  const navRef     = useRef(null)
  const mouseRef   = useRef(null)

  // on mount → device + initial dimensions
  useEffect(() => {
    initializeDevice()
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [initializeDevice, setDimensions])

  // once loaded → start smooth scroll
  useEffect(() => {
    if (isLoaded) lenis.start()
  }, [isLoaded, lenis])

  // Show loader until it calls onFinish
  if (!isLoaded) {
    return (
      <AppContext.Provider
        value={{ store, scrollTo, dispatchAnim, mainRef, pageRef, contentRef, navRef, mouseRef }}
      >
        <LoaderInterface onFinish={setLoaded} />
      </AppContext.Provider>
    )
  }

  // After loaded → render the app
  return (
    <AppContext.Provider
      value={{ store, scrollTo, dispatchAnim, mainRef, pageRef, contentRef, navRef, mouseRef }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within <AppProvider>')
  }
  return ctx
}

export function useAppState() {
  return useAppStore()
}