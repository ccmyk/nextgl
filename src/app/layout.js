'use client'

import { WebGLProvider } from '@/webgl/core/WebGLContext'
import { useEffect } from 'react'
import { webgl } from '@/webgl/core/WebGLManager'
import Nav from '@/components/Interface/Nav'
import '@/styles/index.css'

export default function RootLayout({ children }) {
  // Initialize font loading same as legacy
  useEffect(() => {
    // Add fonts to document for MSDF text
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'montreal';
        src: url('/fonts/PPNeueMontreal-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: block;
      }
    `
    document.head.appendChild(style)

    // Handle device detection same as legacy
    const isTouch = /Mobi|Android|Tablet|iPad|iPhone/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    document.documentElement.classList.add(isTouch ? 'T' : 'D')
    if (isTouch) {
      document.documentElement.classList.add('touch')
    }

    // Clean up
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <html lang="en">
      <body>
        <WebGLProvider>
          <Nav />
          {children}
        </WebGLProvider>
      </body>
    </html>
  )
}
