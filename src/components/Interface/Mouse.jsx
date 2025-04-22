'use client'

import { useEffect } from 'react'
import { useMouse } from '@/hooks/useMouse'

export default function Mouse({ main }) {
  const {
    elementRef,
    followIn,
    followOut,
    position,
    setPosition,
    active
  } = useMouse()

  // Handle mouse movement exactly as legacy
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (active === 0) return false
      setPosition([e.clientX, e.clientY])
    }

    document.body.onmousemove = handleMouseMove

    // Set up .MW elements exactly as legacy
    const mWriteElements = document.querySelectorAll('.MW')
    mWriteElements.forEach(el => {
      if (!el.classList.contains('evt')) {
        el.addEventListener('mouseenter', (e) => followIn(el, e))
        el.addEventListener('mouseleave', (e) => followOut(el, e))
        el.classList.add('evt')
      }
    })

    // Handle page transitions
    const pHide = document.querySelector('.pHide')
    if (pHide) {
      pHide.onmouseenter = () => {
        const child = elementRef.current?.querySelector('.mouse_el')
        if (child) {
          gsap.to(child, {
            width: 0,
            duration: 0.2,
            onComplete: () => {
              if (child.parentNode === elementRef.current) {
                child.remove()
              }
            }
          })
        }
      }
    }

    return () => {
      document.body.onmousemove = null
      mWriteElements.forEach(el => {
        el.removeEventListener('mouseenter', followIn)
        el.removeEventListener('mouseleave', followOut)
      })
    }
  }, [active, followIn, followOut, setPosition])

  return (
    <div 
      ref={elementRef}
      className="mouse"
    />
  )
}
