// src/hooks/useTouchScrollControl.js

'use client'

import { useEffect } from 'react'
import { useAppContext } from '@/context/useAppContext'

export function useTouchScrollControl() {
  const { main } = useAppContext()

  useEffect(() => {
    const handleStartScroll = () => {
      main.current.controlScroll?.(1)
    }

    const handleStopScroll = () => {
      main.current.controlScroll?.(0)
    }

    const handleOpenMenu = () => {
      main.current.controlScroll?.(0)
    }

    const handleCloseMenu = () => {
      main.current.controlScroll?.(1)
    }

    document.addEventListener('startscroll', handleStartScroll)
    document.addEventListener('stopscroll', handleStopScroll)
    document.addEventListener('openmenu', handleOpenMenu)
    document.addEventListener('closemenu', handleCloseMenu)

    return () => {
      document.removeEventListener('startscroll', handleStartScroll)
      document.removeEventListener('stopscroll', handleStopScroll)
      document.removeEventListener('openmenu', handleOpenMenu)
      document.removeEventListener('closemenu', handleCloseMenu)
    }
  }, [main])
}
