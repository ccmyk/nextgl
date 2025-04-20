// src/components/webgl/Loader/Loader.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import createLoaderGeometry from '@/lib/webgl/createLoaderGeometry'
import useLoaderState from '@/hooks/useLoaderState'
import useLoaderTimeline from '@/hooks/useLoaderTimeline'
import useLoaderEvents from '@/hooks/useLoaderEvents'

export default function Loader() {
  const { gl, scene } = useAppContext()
  const meshRef = useRef(null)

  useEffect(() => {
    if (!gl) return

    const { mesh } = createLoaderGeometry(gl)
    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, scene])

  useLoaderState({ meshRef })
  useLoaderTimeline({ meshRef })
  useLoaderEvents({ meshRef })

  return null
}