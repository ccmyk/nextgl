// src/app/about/DualIO.jsx

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitType from 'split-type'

export default function DualIO() {
  const dualRef = useRef(null)
  const anim = useRef(null)

  useEffect(() => {
    const el = dualRef.current
    const lines = new SplitType(el.querySelectorAll('p'), { types: 'lines' }).lines

    anim.current = gsap.timeline({ paused: true })
    for (let [i, line] of lines.entries()) {
      anim.current.fromTo(
        line,
        { y: '1.2rem', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        i * 0.2
      )
    }

    const start = () => {
      if (window.innerWidth > 768) anim.current?.play()
      el.classList.add('goout')
    }

    const stop = () => {
      el.classList.remove('goout')
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting ? start() : stop()
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={dualRef} className="about_dual_cnt" />
}