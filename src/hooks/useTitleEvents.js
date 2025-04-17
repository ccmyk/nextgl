// src/hooks/useTitleEvents.js

import { useEffect } from 'react'

export default function useTitleEvents({ elRef, meshRef, programRef, canvasRef, device }) {
  useEffect(() => {
    const tt = elRef.current?.parentNode?.querySelector('.Oiel')
    if (!tt || device >= 3) return

    const onEnter = () => {
      programRef.current.uniforms.uPower.value = 1.5
    }

    const onLeave = () => {
      programRef.current.uniforms.uPower.value = 1
    }

    tt.addEventListener('mouseenter', onEnter)
    tt.addEventListener('mouseleave', onLeave)

    return () => {
      tt.removeEventListener('mouseenter', onEnter)
      tt.removeEventListener('mouseleave', onLeave)
    }
  }, [elRef, programRef, device])
}