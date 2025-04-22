'use client'

import { useRef, useEffect, useState } from 'react'
import { useWebGL } from '@/webgl/core/WebGLContext'
import { Loader } from '@/webgl/components/Loader'
import gsap from 'gsap'

export function useLoader() {
  const [isReady, setIsReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const effectRef = useRef(null)
  const { gl, scene } = useWebGL()

  useEffect(() => {
    if (!gl || !scene) return

    // Create loader with same setup as legacy
    effectRef.current = new Loader({
      gl,
      scene
    })

    // Track loading progress
    const timeline = gsap.timeline({
      paused: true,
      onUpdate: () => {
        setProgress(timeline.progress() * 100)
      },
      onComplete: () => {
        setIsReady(true)
      }
    })

    // Add exact loading sequence from legacy
    timeline.to({}, {
      duration: 0.6,
      ease: 'power2.inOut'
    })
    .to({}, {
      duration: 2,
      ease: 'power2.inOut'
    }, 0)
    .to({}, {
      duration: 1,
      ease: 'power2.inOut'
    }, 0.6)

    // Start loader
    effectRef.current.start()
    timeline.play()

    return () => {
      timeline.kill()
      if (effectRef.current) {
        effectRef.current.destroy()
      }
    }
  }, [gl, scene])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!effectRef.current) return
      effectRef.current.resize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isReady,
    progress,
    effectRef
  }
}
