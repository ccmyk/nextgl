// src/hooks/useFooterState.js

import { useRef, useEffect } from 'react'
import { clamp, lerp } from '@/lib/utils/math'

export default function useFooterState({
  elRef,
  renderer,
  camera,
  scene,
  screen,
  viewport,
  post,
  canvasRef,
}) {
  const ctr = useRef({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0,
  })

  const bound = useRef([0, 0, 0, 0])
  const norm = useRef(0)
  const end = useRef(0)
  const lerpVal = useRef(0.6)

  useEffect(() => {
    const el = elRef.current
    const rect = el.parentNode.querySelector('.cCover').getBoundingClientRect()
    bound.current = [rect.x, rect.y, rect.width, rect.height]

    ctr.current.start = parseInt(rect.y + window.scrollY + rect.height * 0.5)
    ctr.current.limit = parseInt(el.clientHeight + rect.height * 0.5)

    renderer.setSize(rect.width, rect.height)

    camera.perspective({
      aspect: renderer.gl.canvas.clientWidth / renderer.gl.canvas.clientHeight,
    })
    camera.fov = 45
    camera.position.set(0, 0, 7)

    const fov = camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * camera.position.z
    const width = height * camera.aspect

    viewport[0] = width
    viewport[1] = height
    post.render({ scene, camera })
  }, [elRef, renderer, camera, post, viewport])

  return { ctr, norm, end, lerpVal }
}