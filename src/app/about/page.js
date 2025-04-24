"use client";
"use client"'use client'

import { useRef, useEffect } from 'react'
import About from '@/components/webgl/About'
import { useWebGL } from '@/webgl/core/WebGLContext'

export default function AboutPage() {
  const containerRef = useRef(null)
  const { webgl } = useWebGL()

  // Register page load handling
  useEffect(() => {
    let isActive = true

    const initializePage = async () => {
      if (!isActive) return

      // Transition loader to about, same as legacy
      await webgl.transition('loader', 'about')
    }

    initializePage()

    return () => {
      isActive = false
    }
  }, [webgl])

  // Text matches legacy
  const aboutText = "Enthusiastic about graphic design, typography, and the dynamic areas of motion and web-based animations. Specialized in translating brands into unique and immersive digital user experiences."

  return (
    <main ref={containerRef} className="min-h-screen">
      <About 
        text={aboutText}
        className="h-screen flex items-center justify-center"
      />
    </main>
  )
}
