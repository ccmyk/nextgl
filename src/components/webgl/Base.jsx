"use client";
"use client";
"use client""use client"'use client'
import React from 'react'
import { useBase } from '@/hooks/webgl/useBase'

export default function Base({ className }) {
  const { containerRef } = useBase()
  return (
    <div ref={containerRef} className={`base-container relative ${className||''}`}>
      <canvas className="absolute inset-0 pointer-events-none" />
    </div>
  )
}