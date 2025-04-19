// src/hooks/useTitleAnimation.js

'use client'

import { useEffect } from 'react'
import useTitleState from './useTitleState'
import useTitleTimeline from './useTitleTimeline'
import useTitleEvents from './useTitleEvents'

export default function useTitleAnimation({
  elRef,
  meshRef,
  programRef,
  postRef,
  canvasRef,
  sceneRef,
  cameraRef,
  device,
}) {
  const state = useTitleState({ elRef, programRef, device })
  const timeline = useTitleTimeline({ programRef, postRef })
  useTitleEvents({ elRef, meshRef, programRef, canvasRef, device })

  useEffect(() => {
    return () => {
      state?.cleanup?.()
      timeline?.cleanup?.()
    }
  }, [])
}