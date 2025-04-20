// src/hooks/useScrollManager.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/AppProvider'

export function useScrollManager() {
  const { scroll, isReady } = useAppContext()

  useEffect(() => {
    if (!isReady || !scroll?.current) return

    const handleScroll = () => {
      scroll.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isReady, scroll])
}

// Utility to initialize component modules dynamically
export function useComponentFactory() {
  const { page } = useAppContext()

  const createComponent = useCallback((selector, ComponentClass, name) => {
    if (!page.current?.DOM?.el || !ComponentClass) return

    const target = page.current.DOM.el.querySelector(selector)
    if (!target) return

    const instance = new ComponentClass(target, page.current?.main?.device)
    if (!page.current.components) page.current.components = {}
    page.current.components[name] = instance
  }, [page])

  return { createComponent }
}