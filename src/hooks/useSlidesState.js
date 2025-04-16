// src/hooks/useSlidesState.js

import { useRef, useState, useCallback } from 'react'
import { clamp, lerp } from '@/lib/utils/math'

export default function useSlidesState({ el, gl, camera, scene, post, main, dev, index, canvasRef }) {
  const state = useRef(0)
  const active = useRef(-1)
  const oldpos = useRef(0)
  const meshes = []
  const textures = []
  const posmeshes = []

  const ctr = useRef({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0,
  })

  const objpos = useRef({ x: 0, target: 0, timer: 0 })
  const viewport = useRef([0, 0])
  const screen = useRef([0, 0])

  const slideanim = useRef(
    gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat: () => {
        resetMeshes()
        state.current = 0
      },
    }).fromTo(objpos.current, { x: 0 }, { x: 1, duration: 42, ease: 'none' })
  )

  const updateX = useCallback(() => {
    const statepos = (objpos.current.x * totalpos.current) / 1
    meshes.forEach((mesh, i) => {
      let x = posmeshes[i] - statepos
      if (x <= minpos.current) {
        posmeshes[i] = statepos + maxpos.current + space.current
      }
      mesh.position.x =
        -(viewport.current[0] / 2) +
        mesh.scale.x / 2 +
        (x / screen.current[0]) * viewport.current[0]
    })
  }, [])

  const updateY = useCallback((y = 0) => {
    if (ctr.current.stop !== 1) {
      ctr.current.current = y - ctr.current.start
      ctr.current.current = clamp(0, ctr.current.limit, ctr.current.current)
    }
  }, [])

  const updateAnim = useCallback(() => {
    ctr.current.progt = (ctr.current.current / ctr.current.limit).toFixed(3)
    ctr.current.prog =
      active.current === -2
        ? ctr.current.progt
        : lerp(ctr.current.prog, ctr.current.progt, 0.015)
    animctr.current?.progress(ctr.current.prog)
  }, [])

  const updateScale = useCallback(() => {
    let w = screen.current[0] * (dev < 3 ? 0.322 : 0.75)
    let h = el.getBoundingClientRect().height
    meshes.forEach((mesh) => {
      mesh.scale.x = (viewport.current[0] * w) / screen.current[0]
      mesh.scale.y = (viewport.current[1] * h) / screen.current[1]
    })
  }, [])

  const resetMeshes = useCallback(() => {
    meshes.forEach((mesh, i) => {
      posmeshes[i] = (wEl.current + space.current) * i
      mesh.position.x =
        -(viewport.current[0] / 2) +
        mesh.scale.x / 2 +
        (posmeshes[i] / screen.current[0]) * viewport.current[0]
    })
  }, [])

  const start = () => {
    active.current = 1
    slideanim.current.play()
  }

  const stop = () => {
    active.current = 0
    slideanim.current.pause()
  }

  return {
    ctr: ctr.current,
    state: state.current,
    viewport: viewport.current,
    screen: screen.current,
    meshes,
    textures,
    objpos: objpos.current,
    slideanim: slideanim.current,
    resetMeshes,
    updateX,
    updateY,
    updateAnim,
    updateScale,
    start,
    stop,
  }
}
