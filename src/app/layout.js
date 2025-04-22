'use client'

import { useEffect } from 'react'
import Mouse from '@/components/interface/Mouse'
import { initTextAnimations } from '@/lib/animations/text'

import '@/styles/index.css'

export default function RootLayout({ children }) {
  // Initialize core systems
  useEffect(() => {
    // Start text animation system
    const cleanupTextAnimations = initTextAnimations()

    // Handle initial mouse position
    const handleInitialMousePosition = (e) => {
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
      })
      document.dispatchEvent(mouseEvent)
    }

    // Detect touch device
    const isTouch = /Mobi|Android|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    // Add device classes same as legacy
    document.documentElement.classList.add(isTouch ? 'T' : 'D')
    if (isTouch) {
      document.documentElement.classList.add('touch')
    } else {
      // Only initialize mouse on non-touch
      window.addEventListener('mouseover', handleInitialMousePosition, { once: true })
    }

    return () => {
      cleanupTextAnimations()
      window.removeEventListener('mouseover', handleInitialMousePosition)
    }
  }, [])

  return (
    <html lang="en">
      <body>
        {!('ontouchstart' in window) && <Mouse />}
        {children}
      </body>
    </html>
  )
}
