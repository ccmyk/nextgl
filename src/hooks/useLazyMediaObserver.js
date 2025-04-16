// src/hooks/useLazyMediaObserver.js

'use client'

import { useEffect, useRef } from 'react'

export function useLazyMediaObserver({ elRef, onIntersect, root = null, threshold = 0.1 }) {
  const observerRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el || typeof window === 'undefined') return

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && typeof onIntersect === 'function') {
          onIntersect(entry)
          observer.unobserve(entry.target)
        }
      })
    }

    observerRef.current = new IntersectionObserver(observerCallback, {
      root,
      threshold,
    })

    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [elRef, onIntersect, root, threshold])
}
