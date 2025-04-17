// src/components/webgl/Roll/Roll.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/AppProvider'
import createRollGeometry from '@/lib/webgl/createRollGeometry'
import useRollState from '@/hooks/useRollState'
import useRollTimeline from '@/hooks/useRollTimeline'
import useRollEvents from '@/hooks/useRollEvents'

export default function Roll({ elRef }) {
  const { gl, scene } = useAppContext()
  const meshRef = useRef(null)

  useEffect(() => {
    if (!gl || !elRef?.current) return

    const { mesh } = createRollGeometry(gl, elRef.current)
    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, scene, elRef])

  useRollState({ meshRef })
  useRollTimeline({ meshRef })
  useRollEvents({ meshRef })

  return null
}