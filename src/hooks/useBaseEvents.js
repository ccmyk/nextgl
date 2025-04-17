// src/hooks/useBaseEvents.js

import { useEffect } from 'react'

export default function useBaseEvents({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    const u = meshRef.current.program.uniforms

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        u.uStart.value = 1
      } else {
        u.uStart.value = 0
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [meshRef])
}