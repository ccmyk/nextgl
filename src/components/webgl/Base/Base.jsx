// src/components/webgl/Base/Base.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import createBaseGeometry from '@/lib/webgl/createBaseGeometry'
import useBaseState from '@/hooks/useBaseState'
import useBaseTimeline from '@/hooks/useBaseTimeline'
import useBaseEvents from '@/hooks/useBaseEvents'

export default function Base() {
  const { gl, scene, camera, screen, viewport } = useAppContext()
  const meshRef = useRef(null)

  useEffect(() => {
    if (!gl) return

    const { mesh } = createBaseGeometry(gl)
    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, scene])

  useBaseState({ meshRef, screen, viewport })
  useBaseTimeline({ meshRef })
  useBaseEvents({ meshRef })

  return null
}