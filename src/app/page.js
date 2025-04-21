'use client'

import { useRef, useEffect } from 'react'
import { useWebGL } from '@/webgl/core/WebGLContext'
import Title from '@/components/webgl/Title'

// This component shows how the Title integrates with other WebGL components
export default function Home() {
  const { webgl, startTransition } = useWebGL()
  const titleRef = useRef(null)
  const containerRef = useRef(null)

  // Handle initial page load animation sequence
  useEffect(() => {
    let isActive = true

    const initializeAnimations = async () => {
      if (!isActive) return

      // Same sequence timing as legacy
      await startTransition('loader', 'title')
      
      if (titleRef.current) {
        titleRef.current.start()
      }
    }

    initializeAnimations()

    return () => {
      isActive = false
    }
  }, [startTransition])

  return (
    <main ref={containerRef} className="relative">
      <section className="h-screen flex items-center justify-center">
        <Title
          ref={titleRef}
          text="NextGL"
          className="title-main"
        >
          <h1 className="text-5xl">NextGL</h1>
        </Title>
      </section>

      {/* Additional sections use the same pattern for other WebGL components */}
      <section className="h-screen bg-black">
        {/* Background component would go here */}
      </section>

      <section className="h-screen">
        {/* Slides component would go here */}
      </section>

      <section className="h-screen">
        {/* About component would go here */}
      </section>
    </main>
  )
}
