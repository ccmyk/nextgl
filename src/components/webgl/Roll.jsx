'use client'

import { useRoll } from '@/hooks/webgl/useRoll'

export default function RollComponent({
  pos = 0,
  touch = 0,
  className,
  children,
}) {
  const { containerRef } = useRoll({ pos, touch })

  return (
    <div
      ref={containerRef}
      className={`roll-container relative ${className || ''}`}
    >
      <canvas className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  )
}