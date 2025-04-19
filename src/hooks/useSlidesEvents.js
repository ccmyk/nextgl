// src/hooks/useSlidesEvents.js

'use client'

import { useEffect } from 'react'

export default function useSlidesEvents({ elRef, slideAnimRef, texturesRef, meshesRef, canvas, post, renderer, device }) {
  useEffect(() => {
    const canvasEl = canvas
    if (canvasEl) canvasEl.style.pointerEvents = 'none'

    return () => {
      if (canvasEl) canvasEl.style.pointerEvents = 'auto'
    }
  }, [canvas])
}