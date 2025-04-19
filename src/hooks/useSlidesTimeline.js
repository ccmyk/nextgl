// src/hooks/useSlidesTimeline.js

'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

export default function useSlidesTimeline({ canvas, dataset, objPos, texturesRef, slideAnimRef, post }) {
  useEffect(() => {
    const timeline = gsap.timeline({ paused: true })
    timeline.to({}, { duration: 1 })
    slideAnimRef.current = timeline
  }, [])
}