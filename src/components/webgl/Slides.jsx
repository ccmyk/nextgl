'use client'
import { useSlides } from '@/hooks/webgl/useSlides'

export default function SlidesComponent({ ids=0, touch=0, className, children }) {
  const { containerRef } = useSlides({ ids, touch })
  return (
    <div ref={containerRef} className={`slides-container relative ${className||''}`}>
      <canvas className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  )
}