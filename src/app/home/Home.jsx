"use client";
"use client"// src/app/home/Intro.jsx

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HomeIntro({ elRef }) {
  const introRef = useRef(null)

  useEffect(() => {
    if (!elRef?.current) return

    introRef.current = elRef.current

    // Optional animation logic if needed in the future
    // const anim = gsap.timeline({ paused: true })
    // anim.to(introRef.current, { opacity: 1, duration: 1 })
    // anim.play()
  }, [elRef])

  return null
}
