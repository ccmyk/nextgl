'use client'

import { useRef, useEffect, useCallback } from 'react'
import SplitType from 'split-type'
import gsap from 'gsap'

export function useSplitText(ref, options = {}) {
  const splitInstanceRef = useRef(null)
  const timelineRef = useRef(null)

  // Initialize split text with same configuration as legacy
  useEffect(() => {
    if (!ref.current) return

    // Use exact same SplitType configuration as legacy
    splitInstanceRef.current = new SplitType(ref.current, {
      types: 'chars',
      tagName: 'span'
    })

    // Add character wrappers exactly like legacy
    if (splitInstanceRef.current.chars) {
      splitInstanceRef.current.chars.forEach(char => {
        const wrapper = document.createElement('span')
        wrapper.classList.add('char-wrapper')

        const inner = document.createElement('span')
        inner.classList.add('n')
        inner.textContent = char.textContent

        char.textContent = ''
        wrapper.appendChild(inner)
        char.appendChild(wrapper)
      })
    }

    return () => {
      if (splitInstanceRef.current?.revert) {
        splitInstanceRef.current.revert()
      }
    }
  }, [ref])

  // Animation functions with exact same timings as legacy
  const animateIn = useCallback(() => {
    if (!ref.current || !splitInstanceRef.current) return

    gsap.timeline()
      .to(ref.current.querySelectorAll('.char .n'), {
        y: -3,
        stagger: 0.02,
        duration: 0.2,
        ease: 'power4.inOut',
        ...options.animateIn
      })
  }, [ref, options])

  const animateOut = useCallback(() => {
    if (!ref.current || !splitInstanceRef.current) return

    gsap.timeline()
      .to(ref.current.querySelectorAll('.char .n'), {
        y: 0,
        stagger: 0.01,
        duration: 0.2,
        ease: 'power4.inOut',
        ...options.animateOut
      })
  }, [ref, options])

  // Provide same API for state updates as legacy
  const updateText = useCallback((text) => {
    if (!splitInstanceRef.current) return

    splitInstanceRef.current.revert()
    ref.current.textContent = text

    splitInstanceRef.current = new SplitType(ref.current, {
      types: 'chars',
      tagName: 'span'
    })

    // Re-add wrappers
    if (splitInstanceRef.current.chars) {
      splitInstanceRef.current.chars.forEach(char => {
        const wrapper = document.createElement('span')
        wrapper.classList.add('char-wrapper')

        const inner = document.createElement('span')
        inner.classList.add('n')
        inner.textContent = char.textContent

        char.textContent = ''
        wrapper.appendChild(inner)
        char.appendChild(wrapper)
      })
    }
  }, [ref])

  return {
    split: splitInstanceRef.current,
    animateIn,
    animateOut,
    updateText
  }
}
