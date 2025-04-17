// src/hooks/usePgState.js

import { useEffect } from 'react'

export default function usePgState({ meshRef, elRef, camera }) {
  useEffect(() => {
    if (!meshRef.current || !elRef?.current || !camera) return

    const resize = () => {
      const el = elRef.current
      const rect = el.getBoundingClientRect()
      camera.perspective({ aspect: rect.width / rect.height })
    }

    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [meshRef, elRef, camera])
}