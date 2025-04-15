// src/hooks/useAnimationLoop.js

'use client'

import { useEffect, useRef } from 'react'

export function useAnimationLoop(callback) {
  const rafRef = useRef(null)

  useEffect(() => {
    const loop = (time) => {
      callback(time)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [callback])
}