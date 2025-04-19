// src/hooks/useTextAnimation.js

'use client'

import { useEffect } from 'react'
import { animateDefault, animateCompressed } from '@/lib/utils/textAnimations'

export function useTextAnimation(ref, style = 0, state = 1) {
  useEffect(() => {
    if (!ref?.current) return

    if (style === 0) {
      animateDefault(ref.current, state)
    } else if (style === 1) {
      animateCompressed(ref.current, state)
    }
  }, [ref, style, state])
}