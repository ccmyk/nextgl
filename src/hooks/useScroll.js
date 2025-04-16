// src/hooks/useScroll.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/AppProvider'

export function useScroll() {
  const { page } = useAppContext()

  useEffect(() => {
    if (!page?.current) return

    let lastScroll = window.scrollY

    const onScroll = () => {
      const newScroll = window.scrollY
      const diff = newScroll - lastScroll

      page.current.scroll = {
        current: newScroll,
        delta: diff,
        direction: diff > 0 ? 'down' : 'up'
      }

      lastScroll = newScroll
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [page])
}