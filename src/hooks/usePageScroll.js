// src/hooks/usePageScroll.js

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'

export function usePageScroll() {
  const ticking = useRef(false)
  const lastY = useRef(0)

  const { page } = useAppContext()

  useEffect(() => {
    const updateScroll = () => {
      if (!page.current?.update) return

      const y = window.scrollY || window.pageYOffset

      if (Math.abs(y - lastY.current) > 1) {
        lastY.current = y
        page.current.update()
      }

      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScroll)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [page])
}
