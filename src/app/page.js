'use client'

import { useEffect, useState } from 'react'
import Loader      from '@/components/Interface/Loader';
import WebglLoader from '@/components/webgl/Loader';
import Background from '@/components/webgl/Background'
import Title from '@/components/webgl/Title'
import { useWebGL } from '@/webgl/core/WebGLContext'
import { useScroll } from '@/hooks/useScroll';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showBackground, setShowBackground] = useState(false)
  const { gl } = useWebGL()

  useScroll();// Handle initial load sequence exactly like legacy
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
    <>
      <Loader />
      <WebglLoader />
      {showBackground && <Background />}
      {showBackground && <Title />}
    </>
  )
}
