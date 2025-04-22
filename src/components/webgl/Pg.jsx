'use client'
import React from 'react'
import { usePg } from '@/hooks/webgl/usePg'

export default function PgComponent({ pos = 0, touch = 0, className, children }) {
  const { containerRef } = usePg({ pos, touch })
  return (
    <div ref={containerRef} className={`pg-container relative ${className || ''}`}>  
      <canvas className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  )
}