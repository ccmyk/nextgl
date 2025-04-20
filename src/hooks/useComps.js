// src/hooks/useComps.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/useAppContext'
import { usePageComponents } from '@/hooks/usePageComponents'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useIOS } from '@/hooks/useIOS'
import { useScrollManager } from '@/hooks/useScrollManager'
import { usePageScroll } from '@/hooks/usePageScroll'
import { useTouchScrollControl } from '@/hooks/useTouchScrollControl'

// Modular wrapper that initializes all per-page component systems
export function useComps() {
  const { page } = useAppContext()

  useEffect(() => {
    if (!page?.current) return

    page.current.createComps?.()
    page.current.createIos?.()
    page.current.callIos?.()
    page.current.showIos?.()
  }, [page])

  usePageComponents()
  useScrollAnimation()
  useIOS()
  useScrollManager()
  usePageScroll()
  useTouchScrollControl()
}