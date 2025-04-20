// src/hooks/useComponentFactory.js

'use client'

import { useCallback } from 'react'
import { useAppContext } from '@/context/useAppContext'

export function useComponentFactory() {
  const { page } = useAppContext()

  const createComponent = useCallback((selector, ComponentClass, name) => {
    if (!name) {
      console.error("Component 'name' must be defined for selector:", selector)
      return
    }
    if (!page.current?.DOM?.el || !ComponentClass) return

    const target = page.current.DOM.el.querySelector(selector)
    if (!target) return

    const instance = new ComponentClass(target, page.current?.main?.device)
    if (!page.current.components) page.current.components = {}

    if (page.current.components[name]) {
      console.warn(`Component with name '${name}' already exists. Overwriting.`)
    }

    console.log(`Creating component with name: ${name}`)
    page.current.components[name] = instance
  }, [page])

  return { createComponent }
}