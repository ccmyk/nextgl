'use client'

import { useAppContext } from '@/context/AppProvider'

export function usePageTransition() {
  const { pHide } = useAppContext()

  const showTransition = () => {
    if (pHide.current) {
      pHide.current.classList.remove('out')
      pHide.current.classList.add('in')
    }
  }

  const hideTransition = () => {
    if (pHide.current) {
      pHide.current.classList.remove('in')
      pHide.current.classList.add('out')
    }
  }

  return {
    showTransition,
    hideTransition,
  }
}