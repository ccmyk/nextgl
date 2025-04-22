'use client'

import { useEffect, useRef } from 'react'
import Text from './Text'
import { Title as TitleEffect } from '@/webgl/components/Title'
import { useWebGL } from '@/context/WebGLContext'
import gsap from 'gsap'

export default function Title({ text, className, children }) {
  const textRef = useRef(null)
  const { gl } = useWebGL()

  // Handle mouse interactions through React events
  useEffect(() => {
    if (!textRef.current) return
    const element = textRef.current

    const handleMouseEnter = () => {
      const effect = element.effectRef?.current
      if (!effect) return

      effect.lerp = 0.06 // Same as legacy
      gsap.to(effect.uniforms.uPower, {
        value: 1,
        duration: 0.36,
        ease: 'power4.inOut'
      })
    }

    const handleMouseMove = (e) => {
      const effect = element.effectRef?.current
      if (!effect?.handleMouseMove) return

      // Calculate normalized coordinates through React
      const bounds = element.getBoundingClientRect()
      const x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1
      const y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1
      
      effect.handleMouseMove({ x, y })
    }

    const handleMouseLeave = () => {
      const effect = element.effectRef?.current
      if (!effect) return

      effect.lerp = 0.03 // Same as legacy
      gsap.to(effect.uniforms.uPower, {
        value: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          if (effect.uniforms.uKey) {
            effect.uniforms.uKey.value = -1
          }
        }
      })
    }

    // Event handling through React
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!gl) return null

  return (
    <Text
      ref={textRef}
      text={text}
      component={TitleEffect}
      className={className}
    >
      {children}
    </Text>
  )
}
