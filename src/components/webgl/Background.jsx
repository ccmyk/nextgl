'use client'

import { useRef } from 'react'
import { useBackground } from '@/hooks/webgl/useBackground'

export default function Background() {
  const containerRef = useRef(null)
  const { isActive } = useBackground()

  return (
    <div 
      ref={containerRef}
      className={`background fixed inset-0 z-0 ${isActive ? 'is-active' : ''}`}
      aria-hidden="true"
    />
  )
}
