// src/hooks/useComponentFactory.js

'use client'

import { useCallback } from 'react'
import { useAppContext } from '@/context/AppProvider'

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