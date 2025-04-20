// src/components/webgl/Background/Background.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import createBackgroundGeometry from '@/lib/webgl/createBackgroundGeometry'
import useBackgroundState from '@/hooks/useBackgroundState'
import useBackgroundTimeline from '@/hooks/useBackgroundTimeline'

export default function Background() {
  const { gl, scene, camera, viewport, screen } = useAppContext()
  const meshRef = useRef(null)

  useEffect(() => {
    if (!gl) return

    const { mesh } = createBackgroundGeometry(gl)
    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, scene])

  useBackgroundState({ meshRef, viewport, screen })
  useBackgroundTimeline({ meshRef })

  return null
}