// src/components/webgl/About/About.jsx

'use client'

import { useRef, useEffect } from 'react'
import { useAppContext } from '@/context/AppProvider'
import useAboutState from '@/hooks/useAboutState'
import useAboutTimeline from '@/hooks/useAboutTimeline'
import useAboutEvents from '@/hooks/useAboutEvents'
import createAboutGeometry from '@/lib/webgl/createAboutGeometry'

export default function About({ elRef }) {
  const { gl, scene, post, device, camera, renderer, screen, viewport } = useAppContext()
  const meshRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!gl || !elRef.current) return

    const { mesh, canvas } = createAboutGeometry({ gl, el: elRef.current, device })
    meshRef.current = mesh
    canvasRef.current = canvas
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, elRef, scene, device])

  useAboutState({ elRef, post, renderer, scene, camera, screen, viewport })
  useAboutTimeline({ post })
  useAboutEvents({ elRef, post, device })

  return null
}