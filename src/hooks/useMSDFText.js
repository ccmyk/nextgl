'use client'

import { useRef, useEffect, useCallback } from 'react'
import SplitType from 'split-type'
import gsap from 'gsap'

export function useMSDFText(ref, options = {}) {
  const splitRef = useRef(null)
  const timelineRef = useRef(null)
  const isAnimatingRef = useRef(false)

  // Initialize text splitting exactly like legacy
  useEffect(() => {
    if (!ref.current) return

    splitRef.current = new SplitType(ref.current, {
      types: 'chars,words',
      tagName: 'span'
    })

    // Add character wrappers exactly like legacy
    if (splitRef.current?.chars) {
      splitRef.current.chars.forEach(char => {
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
      if (splitRef.current?.revert) {
        splitRef.current.revert()
      }
    }
  }, [ref])

  // Animation functions with exact same timings as legacy
  const animateIn = useCallback(() => {
    if (!ref.current || isAnimatingRef.current) return

    isAnimatingRef.current = true

    gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
      }
    })
    .set(ref.current.querySelectorAll('.char .n'), {
      y: '100%',
      opacity: 0
    })
    .to(ref.current.querySelectorAll('.char .n'), {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power4.inOut'
    })
  }, [ref])

  const animateOut = useCallback(() => {
    if (!ref.current || isAnimatingRef.current) return

    isAnimatingRef.current = true

    gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
      }
    })
    .to(ref.current.querySelectorAll('.char .n'), {
      y: '-100%',
      opacity: 0,
      duration: 0.6,
      stagger: 0.01,
      ease: 'power2.inOut'
    })
  }, [ref])

  // Text content update with same animation as legacy
  const updateText = useCallback((text) => {
    if (!ref.current || !splitRef.current) return

    const timeline = gsap.timeline()

    // Fade out existing text
    timeline.to(ref.current.querySelectorAll('.char .n'), {
      y: '-100%',
      opacity: 0,
      duration: 0.4,
      stagger: 0.01,
      ease: 'power2.inOut',
      onComplete: () => {
        // Update text content
        splitRef.current.revert()
        ref.current.textContent = text

        // Re-split and add wrappers
        splitRef.current = new SplitType(ref.current, {
          types: 'chars,words',
          tagName: 'span'
        })

        if (splitRef.current?.chars) {
          splitRef.current.chars.forEach(char => {
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

        // Fade in new text
        gsap.fromTo(ref.current.querySelectorAll('.char .n'),
          {
            y: '100%',
            opacity: 0
          },
          {
            y: '0%',
            opacity: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: 'power4.inOut'
          }
        )
      }
    })
  }, [ref])

  return {
    split: splitRef.current,
    animateIn,
    animateOut,
    updateText
  }
}

export default useMSDFText
