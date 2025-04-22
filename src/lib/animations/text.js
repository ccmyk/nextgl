'use client'

import gsap from 'gsap'

// Exact same text animation handling as legacy
export function handleTextAnimation(event) {
  const { state, el } = event.detail
  
  if (!el) return

  // Get characters for animation
  const chars = el.querySelectorAll('.char')
  if (!chars.length) {
    // Same split setup as legacy
    const text = el.textContent
    el.textContent = ''
    
    text.split('').forEach(char => {
      const span = document.createElement('span')
      span.className = 'char'
      span.textContent = char
      el.appendChild(span)
    })
  }

  // Same animation states as legacy
  if (state === 0) {
    gsap.set(el, { opacity: 1 })
    gsap.set(el.querySelectorAll('.char'), {
      opacity: 0,
      y: '100%'
    })
  } else if (state === 1) {
    gsap.to(el.querySelectorAll('.char'), {
      opacity: 1,
      y: '0%',
      duration: 0.4,
      stagger: 0.02,
      ease: 'power4.inOut'
    })
  }
}

// Initialize animation listener exactly as legacy
export function initTextAnimations() {
  document.addEventListener('anim', handleTextAnimation)
  return () => document.removeEventListener('anim', handleTextAnimation)
}
