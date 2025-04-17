// src/app/about/Intro.jsx

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AboutIntro() {
  const introRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        introRef.current?.classList.add('act')
      },
    })

    // Optional animation logic if needed later
    // tl.to(introRef.current, { opacity: 1, duration: 1 }).play()
  }, [])

  return <div ref={introRef} className="about_intro_inner" />
}