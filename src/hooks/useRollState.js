// src/hooks/useRollState.js

import { useEffect } from 'react'

export default function useRollState({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return
    meshRef.current.visible = true
  }, [meshRef])
}