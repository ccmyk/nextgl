// src/components/webgl/Pg/Pg.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import createPgGeometry from '@/lib/webgl/createPgGeometry'
import usePgState from '@/hooks/usePgState'
import usePgTimeline from '@/hooks/usePgTimeline'
import usePgEvents from '@/hooks/usePgEvents'

export default function Pg({ elRef }) {
  const { gl, scene, camera } = useAppContext()
  const meshRef = useRef(null)

  useEffect(() => {
    if (!gl || !elRef?.current) return

    const { mesh } = createPgGeometry(gl)
    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, scene, elRef])

  usePgState({ meshRef, elRef, camera })
  usePgTimeline({ meshRef })
  usePgEvents({ meshRef })

  return null
}