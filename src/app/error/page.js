"use client";
"use client"// src/app/error/page.js

'use client'

import { useEffect, useRef } from 'react'
import Intro from './Intro'
import gsap from 'gsap'

export default function ErrorPage() {
  const mainRef = useRef(null)

  useEffect(() => {
    const el = mainRef.current

    // Optional animations, only if .error_intro exists
    const introEl = el.querySelector('.error_intro')
    if (introEl) {
      gsap.to(introEl, { opacity: 1, duration: 1 })
    }
  }, [])

  return (
    <main ref={mainRef} className="error_main">
      <section className="error_intro">
        <Intro />
      </section>
    </main>
  )
}