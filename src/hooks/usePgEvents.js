// src/hooks/usePgEvents.js

'use client'
import { useEffect } from 'react'

export default function usePgEvents({ meshRef }) {
  useEffect(() => {
    if (!meshRef.current) return

    meshRef.current.visible = true
  }, [meshRef])
}