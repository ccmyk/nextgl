"use client";

import { useTitle } from '@/hooks/webgl/useTitle'

export default function Title({ 
  text,
  className,
  letterSpacing = -0.022,  // data-l
  size = 5,               // data-m
  white = false,          // data-white
  noAnimation = false,    // data-nome
  width,                  // data-w
  scale,                  // data-s
  children 
}) {
  const { textRef, isActive, handlers } = useTitle({
    letterSpacing,
    size,
    noAnimation
  })

  // Handle touch devices same as legacy
  const isTouchDevice = 'ontouchstart' in window

  return (
    <div 
      className={`title-container relative ${className || ''} ${isActive ? 'is-active' : ''}`}
    >
      <div className="cCover absolute inset-0">
        {/* WebGL canvas gets mounted here */}
      </div>
      <div 
        ref={textRef}
        className={`ttj Oiel ${white ? 'white' : ''}`}
        data-temp="tt"
        data-text={text}
        data-l={letterSpacing}
        data-m={size}
        {...(width && { 'data-w': width })}
        {...(scale && { 'data-s': scale })}
        {...(white && { 'data-white': '1' })}
        {...(noAnimation && { 'data-nome': '1' })}
        {...(!isTouchDevice ? {
          onMouseEnter: handlers.onMouseEnter,
          onMouseMove: handlers.onMouseMove,
          onMouseLeave: handlers.onMouseLeave
        } : {
          onTouchStart: handlers.onMouseEnter,
          onTouchMove: handlers.onMouseMove,
          onTouchEnd: handlers.onMouseLeave
        })}
      >
        {text}
      </div>
      {children}
    </div>
  )
}
