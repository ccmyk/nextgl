// src/hooks/useBaseState.js

import { useEffect } from 'react'

export default function useBaseState({ meshRef, screen, viewport }) {
  useEffect(() => {
    if (!meshRef.current) return

    const mesh = meshRef.current
    mesh.scale.x = (viewport[0] * 0.5)
    mesh.scale.y = (viewport[1] * 0.5)
    mesh.position.set(0, 0, 0)
  }, [meshRef, screen, viewport])
}