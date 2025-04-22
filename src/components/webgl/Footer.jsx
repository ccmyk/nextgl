'use client'
import React from 'react'
import { useFooter } from '@/hooks/webgl/useFooter'

export default function FooterComponent({ pos = 0, touch = 0, className, children }) {
  const { containerRef } = useFooter({ pos, touch })
  return (
    <div ref={containerRef} className={`footer-container relative ${className || ''}`}>
      <canvas className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  )
}