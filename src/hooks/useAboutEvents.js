// src/hooks/useAboutEvents.js

import { useEffect } from 'react'
import SplitType from 'split-type'

export default function useAboutEvents({ elRef, post, device }) {
  useEffect(() => {
    const el = elRef.current
    const tt = el?.parentNode?.querySelector('.Oiel')
    if (!tt || device >= 3) return

    new SplitType(tt, { types: 'chars,words' })

    const handleMove = (e) => {
      const bound = el.getBoundingClientRect()
      const norm = e.layerY / bound.height
      const clamped = Math.min(1, Math.max(0, parseFloat(norm.toFixed(3))))
      post.passes[0].program.uniforms.uMouse.value = clamped
    }

    tt.addEventListener('mousemove', handleMove)
    return () => {
      tt.removeEventListener('mousemove', handleMove)
    }
  }, [elRef, post, device])
}