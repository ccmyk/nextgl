// src/components/webgl/Footer/Footer.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/useAppContext'
import useFooterState from '@/hooks/useFooterState'
import useFooterTimeline from '@/hooks/useFooterTimeline'
import useFooterEvents from '@/hooks/useFooterEvents'
import createFooterGeometry from '@/lib/webgl/createFooterGeometry'

export default function Footer({ elRef }) {
  const {
    gl,
    scene,
    camera,
    renderer,
    viewport,
    screen,
    device,
    post,
  } = useAppContext()

  const meshRef = useRef(null)
  const canvasRef = useRef(null)

  const { ctr, norm, end, lerpVal } = useFooterState({
    elRef,
    camera,
    renderer,
    scene,
    screen,
    viewport,
    post,
    canvasRef,
  })

  const animmouse = useFooterTimeline({ post })
  useFooterEvents({
    elRef,
    isTouch: device < 3,
    norm,
    lerpVal,
    animmouse,
    canvasRef,
  })

  useEffect(() => {
    if (!gl || !elRef.current) return

    const { mesh } = createFooterGeometry(gl, elRef.current)
    meshRef.current = mesh
    scene.addChild(mesh)

    return () => {
      scene.removeChild(mesh)
    }
  }, [gl, scene, elRef])

  useEffect(() => {
    if (!renderer || !post || !meshRef.current) return

    const renderLoop = () => {
      end.current = lerp(end.current, norm.current, lerpVal.current)
      animmouse.current?.progress(end.current)
      post.render({ scene: meshRef.current, camera })
    }

    const frame = () => {
      renderLoop()
      requestAnimationFrame(frame)
    }

    frame()
    return () => cancelAnimationFrame(frame)
  }, [renderer, post, camera])

  return null
}