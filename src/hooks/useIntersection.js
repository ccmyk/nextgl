'use client'

import { useRef, useEffect, useCallback } from 'react'

export function useIntersection(options = {}) {
  const targetRef = useRef(null)
  const observerRef = useRef(null)
  
  // Create callback ref to maintain reference in effects
  const callbackRef = useRef(options.onIntersect)
  callbackRef.current = options.onIntersect

  const handleIntersection = useCallback(([entry]) => {
    if (callbackRef.current) {
      callbackRef.current(entry.isIntersecting, entry)
    }
  }, [])

  useEffect(() => {
    if (!targetRef.current) return

    // Create observer with same timing/options as legacy
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      root: options.root || null
    })

    observerRef.current.observe(targetRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, options.threshold, options.rootMargin, options.root])

  return [targetRef, observerRef.current]
}

// Higher-order hook for common intersection patterns
export function useIntersectionEffect(effect, options = {}) {
  const [ref] = useIntersection({
    onIntersect: (isIntersecting) => {
      if (isIntersecting) {
        effect()
      }
    },
    ...options
  })

  return ref
}

// Hook for class-based intersection handling
export function useIntersectionClass(className = 'is-visible', options = {}) {
  const [ref] = useIntersection({
    onIntersect: (isIntersecting, entry) => {
      if (isIntersecting) {
        entry.target.classList.add(className)
      } else if (options.removeOnExit) {
        entry.target.classList.remove(className)
      }
    },
    ...options
  })

  return ref
}
