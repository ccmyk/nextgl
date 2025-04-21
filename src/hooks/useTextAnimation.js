// src/hooks/useTextAnimation.js
'use client'

import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import gsap from 'gsap'

/**
 * Custom hook to apply text animations using SplitType and GSAP
 * 
 * @param {Object} ref - React ref to the DOM element to animate
 * @param {Object} options - Animation options
 * @param {number} options.staggerValue - Stagger timing between characters (default: 0.02)
 * @param {number} options.duration - Animation duration (default: 0.7)
 * @param {string} options.ease - GSAP easing function (default: 'power3.out')
 * @param {string} options.animationType - Type of animation ('char-shuffle' or 'standard')
 * @param {boolean} options.loop - Whether to loop the animation
 * @param {string} options.direction - Animation direction ('forward' or 'reverse')
 * @returns {Object} - The SplitType instance
 */
export default function useTextAnimation(
  ref,
  {
    staggerValue = 0.02,
    duration = 0.7, 
    ease = 'power3.out',
    animationType = 'char-shuffle',
    loop = false,
    direction = 'forward',
  } = {}
) {
  const splitRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    if (!ref?.current) return
    
    // Initialize SplitType
    splitRef.current = new SplitType(ref.current, {
      types: 'words,chars',
      tagName: 'span'
    })
    
    // Get elements
    const chars = splitRef.current.chars
    
    // Create a new timeline
    timelineRef.current = gsap.timeline({
      paused: true,
      repeat: loop ? -1 : 0,
      yoyo: loop,
    })
    
    if (animationType === 'char-shuffle') {
      // For each character, create fake characters for animation
      chars.forEach(char => {
        // Create fake characters wrapper
        const fakeWrapper = document.createElement('span')
        fakeWrapper.classList.add('f')
        fakeWrapper.setAttribute('aria-hidden', 'true')
        
        // Create fake character 1
        const fakeChar1 = document.createElement('span')
        fakeChar1.classList.add('f')
        fakeChar1.setAttribute('aria-hidden', 'true')
        fakeChar1.textContent = getRandomSpecialChar()
        
        // Create fake character 2
        const fakeChar2 = document.createElement('span')
        fakeChar2.classList.add('f')
        fakeChar2.setAttribute('aria-hidden', 'true')
        fakeChar2.textContent = getRandomSpecialChar()
        
        // Add fake characters to DOM
        fakeWrapper.appendChild(fakeChar1)
        fakeWrapper.appendChild(fakeChar2)
        char.insertBefore(fakeWrapper, char.firstChild)
        
        // Add the actual character in a span
        const actualChar = document.createElement('span')
        actualChar.classList.add('n')
        actualChar.textContent = char.textContent
        char.appendChild(actualChar)
        
        // Clear the text node
        char.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = ''
          }
        })
      })
      
      // Animate fake characters
      timelineRef.current
        .set(chars, { opacity: 1 })
        .set('.f', { display: 'block', opacity: 0, scale: 0, transformOrigin: 'center center' })
        .set('.n', { opacity: 0 })
        .staggerTo('.f', 0.3, { opacity: 1, scale: 1, stagger: staggerValue }, 0)
        .staggerTo('.f', 0.3, { opacity: 0, scale: 0, stagger: staggerValue }, 0.2)
        .staggerTo('.n', 0.4, { opacity: 1, stagger: staggerValue }, 0.3)
    } else {
      // Standard animation
      timelineRef.current
        .set(chars, { opacity: 0, y: direction === 'forward' ? 20 : -20 })
        .staggerTo(chars, duration, { opacity: 1, y: 0, ease, stagger: staggerValue }, 0)
    }
    
    // Play the timeline
    timelineRef.current.play()
    
    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      
      if (splitRef.current) {
        splitRef.current.revert()
      }
    }
  }, [ref, staggerValue, duration, ease, animationType, loop, direction])
  
  return splitRef.current
}

/**
 * Helper function to get a random special character
 * @returns {string} A random special character
 */
function getRandomSpecialChar() {
  const specialChars = ['@', '#', '$', '%', '&', '*', '(', ')', '{', '}', '[', ']', '|', '\\', '/', '+', '-', '=', '·', '€']
  return specialChars[Math.floor(Math.random() * specialChars.length)]
}

// src/hooks/useTextAnimation.js

'use client'

import { useEffect } from 'react'
import { animateDefault, animateCompressed } from '@/lib/utils/textAnimations'

export function useTextAnimation(ref, style = 0, state = 1) {
  useEffect(() => {
    if (!ref?.current) return

    if (style === 0) {
      animateDefault(ref.current, state)
    } else if (style === 1) {
      animateCompressed(ref.current, state)
    }
  }, [ref, style, state])
}