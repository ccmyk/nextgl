// src/hooks/useFooterEvents.js

import { useEffect } from 'react'
import { clamp } from '@/lib/utils/math'
import SplitType from 'split-type'

export default function useFooterEvents({ elRef, canvasRef, animmouseRef, ctrRef, touch, updateY, updateAnim, post, renderer }) {
  useEffect(() => {
    if (!elRef.current || !canvasRef.current || !post || !renderer) return

    const el = elRef.current
    const canvas = canvasRef.current
    const tt = el.parentNode.querySelector('.Oiel')

    if (!tt) return

    // Split text into characters
    new SplitType(tt, { types: 'chars,words' })

    let norm = 0
    let lerp = 0.6

    const inFn = () => {
      lerp = 0.02
    }

    const mvFn = (e) => {
      const bound = canvas.getBoundingClientRect()
      norm = e.touches ? (e.touches[0]?.pageX - bound.left) / bound.height : e.layerY / bound.height
      norm = clamp(0, 1, parseFloat(norm.toFixed(3)))
    }

    const lvFn = (e) => {
      lerp = 0.01
      const bound = canvas.getBoundingClientRect()
      norm = e.touches ? (e.touches[0]?.pageX - bound.left) / bound.height : e.layerY / bound.height
      norm = parseFloat(norm.toFixed(3))
    }

    if (!touch) {
      tt.addEventListener('mouseenter', inFn)
      tt.addEventListener('mousemove', mvFn)
      tt.addEventListener('mouseleave', lvFn)
    }

    const onScroll = () => {
      const pos = window.scrollY
      if (ctrRef.current) {
        ctrRef.current.actual = pos
        updateY(pos)
        updateAnim()
        animmouseRef.current?.progress(norm)
        post.render({ scene: el })
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      if (!touch) {
        tt.removeEventListener('mouseenter', inFn)
        tt.removeEventListener('mousemove', mvFn)
        tt.removeEventListener('mouseleave', lvFn)
      }
      window.removeEventListener('scroll', onScroll)
    }
  }, [elRef, canvasRef, animmouseRef, ctrRef, touch, updateY, updateAnim, post, renderer])
}