// src/components/webgl/Title/Title.jsx

'use client'

import { useRef, useEffect } from 'react'
import { useAppContext } from '@/context/AppProvider'
import useTitleAnimation from '@/hooks/useTitleAnimation'
import createTitleGeometry from '@/lib/webgl/createTitleGeometry'

export default function Title({ elRef }) {
  const { gl, scene, fontMSDF, fontTex } = useAppContext()
  const meshRef = useRef(null)
  const programRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!gl || !elRef.current) return

    const { mesh, program } = createTitleGeometry({
      gl,
      font: fontMSDF.current,
      texture: fontTex.current,
      el: elRef.current,
    })

    meshRef.current = mesh
    programRef.current = program
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, elRef, scene])

  useTitleAnimation({
    elRef,
    meshRef,
    programRef,
    canvasRef,
    sceneRef: scene,
    cameraRef: null,
    device: 1,
  })

  return null
}