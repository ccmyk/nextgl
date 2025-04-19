// src/lib/utils/textAnimations.js

import gsap from 'gsap'
import SplitType from 'split-type'

export function animateDefault(target, state = 1) {
  if (!target) return
  
  // Split text if not already split
  if (!target.querySelector('.char')) {
    new SplitType(target, { types: 'chars' })
  }
  
  const chars = target.querySelectorAll('.char')
  if (!chars.length) return

  const tl = gsap.timeline()
  chars.forEach((char, i) => {
    tl.fromTo(
      char,
      { opacity: 0, y: '100%' },
      { opacity: 1, y: '0%', duration: 0.4, ease: 'power3.inOut' },
      i * 0.03
    )
  })
  if (state === -1) tl.reverse()
  
  return tl
}

export function animateCompressed(target, state = 1) {
  if (!target) return
  
  // Split text if not already split
  if (!target.querySelector('.char')) {
    new SplitType(target, { types: 'chars' })
  }
  
  const chars = target.querySelectorAll('.char')
  if (!chars.length) return

  const tl = gsap.timeline()
  chars.forEach((char, i) => {
    tl.fromTo(
      char,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power4.inOut' },
      i * 0.02
    )
  })
  if (state === -1) tl.reverse()
  
  return tl
}