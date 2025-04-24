'use client'

import { useRef, useEffect, useState } from 'react'
import { useAppEvents } from '@/context/AppEventsContext'
import gsap from 'gsap'

export function useLoader() {
  const { dispatchAnim } = useAppEvents()
  const [num, setNum] = useState(0)
  const tl = useRef(null)

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true })
      .fromTo({ v: 0 }, { v: 42, ease: 'none', duration: 2, onUpdate() { setNum(this.targets()[0].v.toFixed(0)) } }, 0)
      .to({ v: 90 }, { v: 90, ease: 'power2.inOut', duration: 8, onUpdate() { setNum(this.targets()[0].v.toFixed(0)) } }, 2.2)
    return () => tl.current.kill()
  }, [])

  const start = () => {
    dispatchAnim(1, document.querySelectorAll('.Awrite')[0])
    dispatchAnim(1, document.querySelectorAll('.Awrite')[1])
    tl.current.play()
  }

  return { num, start }
