'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

export function useMouse() {
  const [position, setPosition] = useState([
    window.innerWidth / 2,
    window.innerHeight / 2
  ])
  const [active, setActive] = useState(0)
  const elementRef = useRef(null)
  const childRef = useRef(null)

  // Exact same quickTo setup as legacy
  const moveX = useRef(null)
  const moveY = useRef(null)

  useEffect(() => {
    if (!elementRef.current) return

    // Initialize exact same quickTo animations as legacy
    moveX.current = gsap.quickTo(elementRef.current, "x", {
      duration: 0.05,
      ease: "none"
    })
    moveY.current = gsap.quickTo(elementRef.current, "y", {
      duration: 0.05,
      ease: "none"
    })

    // Mouse down/up handling exactly as legacy
    const handleMouseDown = () => {
      document.documentElement.classList.add('mouse-down')
    }
    const handleMouseUp = () => {
      document.documentElement.classList.remove('mouse-down')
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Follow text handling with exact same timing
  const followIn = async (el) => {
    setActive(1)

    if (childRef.current) {
      await window.waiter(300)
    } else {
      await window.waiter(6)
    }

    if (childRef.current) {
      childRef.current.remove()
      childRef.current = null
    }

    if (active === 0) return false

    const child = document.createElement('div')
    const aWrite = document.createElement('div')
    child.classList.add('mouse_el')
    aWrite.classList.add('Awrite', 'Awrite-inv', 'Ms')

    if (el.dataset.w) {
      aWrite.classList.add('Awrite-w')
    }

    aWrite.innerHTML = el.dataset.tt

    // Same animation event dispatch as legacy
    const animEvent = new CustomEvent('anim', {
      detail: { state: 0, el: aWrite }
    })
    document.dispatchEvent(animEvent)

    child.appendChild(aWrite)
    elementRef.current.appendChild(child)
    childRef.current = child

    animEvent.detail.state = 1
    document.dispatchEvent(animEvent)
  }

  const followOut = () => {
    setActive(0)
    if (!childRef.current) return false

    gsap.to(childRef.current, {
      width: 0,
      duration: 0.2,
      onComplete: () => {
        if (childRef.current) {
          childRef.current.remove()
          childRef.current = null
        }
      }
    })
  }

  // Update function with exact same logic as legacy
  const update = () => {
    if (active === 0) return false
    if (!moveX.current || !moveY.current) return

    moveX.current(position[0])
    moveY.current(position[1])
  }

  useEffect(() => {
    update()
  }, [position, active])

  return {
    elementRef,
    followIn,
    followOut,
    position,
    setPosition,
    active
  }
}
