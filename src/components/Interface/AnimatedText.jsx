//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

'use client'

import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import gsap from 'gsap'
import { useTextAnimation } from '@/hooks/useTextAnimation'

export default function AnimatedText({ children, className = '', state = 1 }) {
  const el = useRef(null)
  const { write } = useTextAnimation()

  useEffect(() => {
    if (el.current) {
      new SplitType(el.current, { types: 'lines, words' })
      write(el.current, state)
    }
  }, [write, state])

  return (
    <span ref={el} className={`Awrite ${className}`}>
      {children}
    </span>
  )
}