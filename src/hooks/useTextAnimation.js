// src/hooks/useTextAnimation.js

'use client'

import { useEffect } from 'react'
import { writeFn, writeCt } from '@/lib/animations/anims'

export function useTextAnimation(ref, style = 0, state = 1) {
  useEffect(() => {
    if (!ref.current) return

    if (style === 0) {
      writeFn(ref.current, state)
    } else if (style === 1) {
      writeCt(ref.current, state)
    }
  }, [ref, style, state])
}