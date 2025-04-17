// src/hooks/useBackgroundState.js

import { useEffect } from 'react'

export default function useBackgroundState({ meshRef, viewport, screen }) {
  useEffect(() => {
    if (!meshRef.current) return

    const mesh = meshRef.current
    mesh.scale.x = viewport[0] * 1.0
    mesh.scale.y = viewport[1] * 1.0

    mesh.position.x = 0
    mesh.position.y = 0
  }, [meshRef, viewport, screen])
}