// src/hooks/useScrollAnimation.js

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function useScrollAnimation(targetRef, {
  state = 0,
  params = [0],
  bucle = false,
  onComplete = null
} = {}) {
  const timelineRef = useRef(null)

  useEffect(() => {
    if (!targetRef.current) return
    const el = targetRef.current

    if (state === -1) {
      // Hide animation (reverse)
      const splits = el.querySelectorAll('.char')
      const chars = [...splits].reverse()
      const tl = gsap.timeline({ paused: true })

      chars.forEach((char, i) => {
        const n = char.querySelector('.n')
        const f = char.querySelector('.f')
        tl.to(f, { opacity: 1, scaleX: 1, duration: 0.12, ease: 'power4.inOut' }, i * 0.04)
          .to(char, { opacity: 0, duration: 0.2, ease: 'power4.inOut' }, i * 0.04)
      })

      tl.to(el, { opacity: 0, duration: 0.4, ease: 'power4.inOut' }, 0.4)
      tl.play()
      return
    }

    const chars = el.querySelectorAll('.char')
    const tl = gsap.timeline({ paused: true })

    el.style.opacity = 1
    el.classList.add('ivi')

    if (el.classList.contains('Awrite-inv')) {
      tl.to(el, { opacity: 1, ease: 'power4.inOut' }, params[0])
    } else {
      tl.set(el, { opacity: 1 }, 0)
    }

    chars.forEach((char, i) => {
      const n = char.querySelector('.n')
      const fakes = char.querySelectorAll('.f')

      tl.set(char, { opacity: 1 }, 0)
        .to(n, {
          opacity: 1,
          duration: 0.3,
          ease: 'power4.inOut'
        }, i * 0.05 + params[0])

      fakes.forEach((f, u) => {
        tl.set(f, { opacity: 0 }, 0)
        tl.fromTo(f, {
          scaleX: 1,
          opacity: 1
        }, {
          scaleX: 0,
          opacity: 0,
          duration: 0.16,
          ease: 'power4.inOut'
        }, params[0] + (i * 0.05 + (1 + u) * 0.016))
      })
    })

    if (params[1] === -1) {
      tl.progress(1)
    } else {
      tl.play()
    }

    if (onComplete) tl.eventCallback('onComplete', onComplete)

    timelineRef.current = tl

    return () => {
      if (timelineRef.current) timelineRef.current.kill()
    }
  }, [targetRef, state])

  return timelineRef
}
