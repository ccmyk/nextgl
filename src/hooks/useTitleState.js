// src/hooks/useTitleState.js

import { useRef, useEffect } from 'react'

export default function useTitleState({ elRef, programRef, device }) {
  const bound = useRef(null)

  useEffect(() => {
    if (!elRef.current || !programRef.current) return
    bound.current = elRef.current.getBoundingClientRect()

    if (elRef.current.dataset.white) {
      programRef.current.uniforms.uColor.value = 1
    }

    programRef.current.uniforms.uStart.value = 1
    programRef.current.uniforms.uKey.value = -2
    programRef.current.uniforms.uPower.value = 1
  }, [elRef, programRef, device])

  return { cleanup: () => {} }
}