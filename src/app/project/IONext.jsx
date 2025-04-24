"use client";
"use client"// src/app/project/IONext.jsx

'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

export default function IONext({ el }) {
  useEffect(() => {
    const lines = el.querySelectorAll('p')
    const timeline = gsap.timeline({ paused: true })

    lines.forEach((line, i) => {
      timeline.fromTo(
        line,
        { y: '1.2rem', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        i * 0.2
      )
    })

    timeline.play()
  }, [el])

  return null
}