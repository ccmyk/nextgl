// src/hooks/useViewLoader.js

'use client'

import { useEffect, useState, useRef } from 'react'
import views from '@/lib/animations/viewRegistry'
import { useParams } from 'next/navigation'

export function useViewLoader(mainRef) {
  const [viewInstance, setViewInstance] = useState(null)
  const template = useParams()?.template || 'home'
  const hasLoaded = useRef(false)

  useEffect(() => {
    let isMounted = true

    const loadView = async () => {
      if (!views.has(template)) return

      const module = await views.get(template)()
      const ViewClass = module.default

      if (ViewClass && isMounted && mainRef.current) {
        const instance = new ViewClass(mainRef.current)
        setViewInstance(instance)
      }
    }

    if (!hasLoaded.current) {
      loadView()
      hasLoaded.current = true
    }

    return () => {
      isMounted = false
    }
  }, [template, mainRef])

  return viewInstance
}