"use client";
"use client"// src/app/error/Intro.jsx

'use client'

import { useRef, useEffect } from 'react'

export default function ErrorIntro() {
  const introRef = useRef(null)

  useEffect(() => {
    // Future logic (SplitType, GSAP, etc.) can be added here
  }, [])

  return <div ref={introRef} className="error_intro_inner" />
}