// src/hooks/useShowHide.js

'use client'

import { useCallback } from 'react'
import { gsap } from 'gsap'

export function useShowHide() {
  const hide = useCallback((element, duration = 0.4) => {
    if (!element) return
    gsap.to(element, {
      autoAlpha: 0,
      duration,
      onComplete: () => element.classList.add('hide')
    })
  }, [])

  // Show a DOM element (removes .hide and fades in)
  const show = useCallback((element, duration = 0.4) => {
    if (!element) return
    element.classList.remove('hide')
    gsap.to(element, {
      autoAlpha: 1,
      duration
    })
  }, [])

  return { show, hide }
}
