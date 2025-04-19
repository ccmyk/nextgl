// src/hooks/useBaseComponent.js

'use client'

import { useEffect, useRef, useState } from 'react'

export default function useBaseComponent() {
  const ref = useRef(null)
  const [el, setEl] = useState(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (ref.current) {
      setEl(ref.current)
    }
  }, [])

  return {
    ref,
    el,
    active,
    setActive,
  }
}