'use client'
import { useBase } from '@/hooks/webgl/useBase'

export default function BaseComponent({ pos = 0, touch = 0, className, children }) {
  const { containerRef } = useBase({ pos, touch })

  return (
    <div ref={containerRef} className={`base-container relative ${className || ''}`}>
      <canvas className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  )
}
