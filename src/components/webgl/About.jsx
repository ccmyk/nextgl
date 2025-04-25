"use client";

import React from 'react'
import { useAbout } from '@/hooks/webgl/useAbout'

export default function AboutComponent({ pos = 0, touch = 0, className, children }) {
  const { containerRef } = useAbout({ pos, touch })
  return (
    <div ref={containerRef} className={`about-container relative ${className || ''}`}>
      <canvas className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  )
}