// src/components/webgl/Slides/Slides.jsx

'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/context/AppProvider'
import createSlidesGeometry from '@/lib/webgl/createSlidesGeometry'
import useSlidesState from '@/hooks/useSlidesState'
import useSlidesTimeline from '@/hooks/useSlidesTimeline'
import useSlidesEvents from '@/hooks/useSlidesEvents'

export default function Slides({ elRef, dataset }) {
  const {
    gl,
    camera,
    renderer,
    post,
    canvas,
    scroll,
    viewport,
    screen,
    device,
  } = useAppContext()

  const meshesRef = useRef([])
  const texturesRef = useRef([])
  const slideAnimRef = useRef(null)
  const objPos = useRef({ x: 0, target: 0, timer: 0 })
  const ctrRef = useRef({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0,
  })

  // Geometry setup (returns meshes, textures, etc)
  useEffect(() => {
    if (!gl || !camera || !post || !canvas) return

    const { meshes, textures } = createSlidesGeometry({
      gl,
      el: elRef.current,
      dataset,
      camera,
      post,
    })

    meshesRef.current = meshes
    texturesRef.current = textures
  }, [gl, camera, post, canvas, elRef, dataset])

  // Scroll & Resize Logic
  useSlidesState({
    elRef,
    ctrRef,
    canvas,
    post,
    meshesRef,
    texturesRef,
    renderer,
    device,
    viewport,
    screen,
    dataset,
    objPos,
    slideAnimRef,
  })

  // GSAP Timelines (animin, animctr, animsinglectr)
  useSlidesTimeline({
    canvas,
    dataset,
    objPos,
    texturesRef,
    slideAnimRef,
    post,
  })

  // DOM events (hover, visibilitychange, video updates)
  useSlidesEvents({
    elRef,
    slideAnimRef,
    texturesRef,
    meshesRef,
    canvas,
    post,
    renderer,
    device,
  })

  return null
}