// src/hooks/useViewTransitions.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/AppProvider'

/**
 * Handles fade-in/out and view-specific transition coordination.
 */
export function useViewTransitions() {
  const { page, pHide } = useAppContext()

  useEffect(() => {
    if (!pHide.current || !page.current) return

    const onPop = async () => {
      pHide.current.classList.add('out')
      await page.current?.animOut?.()
      pHide.current.classList.remove('out')
    }

    const onShow = () => {
      pHide.current.classList.remove('out')
      pHide.current.classList.add('in')
      setTimeout(() => pHide.current.classList.remove('in'), 400)
    }

    document.addEventListener('pop', onPop)
    document.addEventListener('view:show', onShow)

    return () => {
      document.removeEventListener('pop', onPop)
      document.removeEventListener('view:show', onShow)
    }
  }, [page, pHide])
}
