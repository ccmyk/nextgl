// src/hooks/useFooterEvents.js

import { useEffect } from 'react'
import SplitType from 'split-type'

export default function useFooterEvents({
  elRef,
  isTouch,
  norm,
  lerpVal,
  animmouse,
  canvasRef,
}) {
  useEffect(() => {
    const el = elRef.current
    const tt = el.parentNode.querySelector('.Oiel')
    new SplitType(tt, { types: 'chars,words' })

    const bound = canvasRef.current.getBoundingClientRect()

    const handleEnter = () => {
      lerpVal.current = 0.02
    }

    const handleMove = (e) => {
      const n = isTouch
        ? (e.touches?.[0]?.pageX - bound.x) / bound.height
        : e.layerY / bound.height
      norm.current = Math.max(0, Math.min(1, parseFloat(n.toFixed(3))))
    }

    const handleLeave = (e) => {
      lerpVal.current = 0.01
      handleMove(e)
    }

    if (!isTouch) {
      tt.addEventListener('mouseenter', handleEnter)
      tt.addEventListener('mousemove', handleMove)
      tt.addEventListener('mouseleave', handleLeave)
    }

    return () => {
      if (!isTouch) {
        tt.removeEventListener('mouseenter', handleEnter)
        tt.removeEventListener('mousemove', handleMove)
        tt.removeEventListener('mouseleave', handleLeave)
      }
    }
  }, [elRef, isTouch, norm, lerpVal, canvasRef])
}