// src/hooks/usePgEvents.js

import { useEffect } from 'react'

export default function usePgEvents({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    meshRef.current.visible = true
  }, [meshRef])
}