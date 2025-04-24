"use client";
"use client"'use client'

import { useEffect, useState } from 'react'
import Loader from '@/components/webgl/Loader'
import Background from '@/components/webgl/Background'
import Title from '@/components/webgl/Title'
import { useWebGL } from '@/webgl/core/WebGLContext'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showBackground, setShowBackground] = useState(false)
  const { gl } = useWebGL()

  // Handle initial load sequence exactly like legacy
  useEffect(() => {
    if (!gl) return

    const initialize = async () => {
      await document.fonts.ready

      setTimeout(() => {
        setShowBackground(true)
        document.documentElement.classList.add('has-background')

        setTimeout(() => {
          setIsLoading(false)
          document.documentElement.classList.add('is-loaded')
        }, 800)
      }, 400)
    }

    initialize()
  }, [gl])

  return (
    <main className="relative min-h-screen">
      {isLoading && <Loader />}
      {showBackground && <Background />}

      {/* First Name Title - exact same as legacy */}
      <Title 
        text="Chris"
        letterSpacing={-0.022}
        size={5}
      />

      {/* Second Name Title */}
      <Title 
        text="Hall"
        letterSpacing={-0.016}
        size={5}
      />

      {/* Featured Works Title */}
      <Title 
        text="Featured works"
        letterSpacing={-0.024}
        size={3.8}
        width={33}
        scale={0.29}
        noAnimation
      />

      {/* Interactive Designer Title */}
      <Title 
        text="Interactive Designer,"
        letterSpacing={-0.024}
        size={3.8}
        white
        noAnimation
      />

      {/* Also Speaker & Teacher Title */}
      <Title 
        text="also Speaker & Teacher"
        letterSpacing={-0.032}
        size={3.8}
        white
        noAnimation
      />
    </main>
  )
}
