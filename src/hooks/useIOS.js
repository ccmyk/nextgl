// src/hooks/useIOS.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/useAppContext'
import { createIos } from '@/lib/ios/createIos'
import { callIos } from '@/lib/ios/callIos'
import { showIos } from '@/lib/ios/showIos'

export function useIOS() {
  const { page } = useAppContext()

  useEffect(() => {
    if (!page?.current || !page.current.DOM?.el) return

    // Initialize .iO elements and assign logic handlers
    createIos(page.current)
    callIos(page.current)
    showIos(page.current)
  }, [page])
}