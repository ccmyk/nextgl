"use client";
"use client"// src/app/project/IOIn.jsx

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function IOIn({ el }) {
  const scrRef = useRef()
  const animRef = useRef()

  useEffect(() => {
    scrRef.current = document.querySelector('.backto')

    animRef.current = gsap.timeline({ paused: true })
      .to(scrRef.current, { y: '5vh', opacity: 0, duration: 0.4 })
  }, [])

  const update = (speed, pos = 0) => {
    // Scroll-triggered updates can be added here
  }

  return null
}