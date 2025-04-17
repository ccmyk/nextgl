// src/hooks/useLoaderState.js

import { useEffect } from 'react'

export default function useLoaderState({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    meshRef.current.visible = true
  }, [meshRef])
}