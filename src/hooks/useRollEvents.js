// src/hooks/useRollEvents.js

import { useEffect } from 'react'

export default function useRollEvents({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return
    meshRef.current.visible = true
  }, [meshRef])
}