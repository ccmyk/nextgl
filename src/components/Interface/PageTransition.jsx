// src/components/Interface/PageTransition.jsx

'use client'

import { useRef, useEffect } from 'react'
import { useAppContext } from '@/context/AppProvider'

export default function PageTransition() {
  const { pHide } = useAppContext()
  const el = useRef(null)

  useEffect(() => {
    pHide.current = el.current
  }, [pHide])

  return (
    <div ref={el} className="pHide in" />
  )
}