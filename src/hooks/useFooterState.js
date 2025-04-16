// src/hooks/useFooterState.js

import { useEffect, useRef } from 'react'
import { clamp, lerp } from '@/lib/utils/math'
import SplitType from 'split-type'
import gsap from 'gsap'

export default function useFooterState({ elRef, meshRef, post, canvasRef, renderer, screen, scene, camera, isTouch }) {
  const ctr = useRef({ actual: 0, current: 0, limit: 0, start: 0, prog: 0, progt: 0, stop: 0 })
  const norm = useRef(0)
  const end = useRef(0)
  const lerpVal = useRef(0.6)

  const animmouse = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const el = elRef.current
    const bound = el.getBoundingClientRect()

    const anim = gsap.timeline({ paused: true })
      .fromTo(post.passes[0].program.uniforms.uMouseT, { value: 0.2 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0.1)
      .fromTo(post.passes[0].program.uniforms.uMouseT, { value: 2 }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(post.passes[0].program.uniforms.uMouse, { value: 0.39 }, { value: 0.8, duration: 0.9, ease: 'none' }, 0.1)

    anim.progress(0)
    animmouse.current = anim

    const tt = el.parentNode.querySelector('.Oiel')
    if (tt) new SplitType(tt, { types: 'chars,words' })

    const inFn = () => {
      ctr.current.stop = 0
      lerpVal.current = 0.02
    }

    const mvFn = (e) => {
      let n = isTouch ? (e.touches?.[0]?.pageX - bound.x) / bound.height : e.layerY / bound.height
      norm.current = clamp(0, 1, parseFloat(n.toFixed(3)))
    }

    const lvFn = (e) => {
      lerpVal.current = 0.01
      let n = isTouch ? (e.touches?.[0]?.pageX - bound.x) / bound.height : e.layerY / bound.height
      norm.current = clamp(0, 1, parseFloat(n.toFixed(3)))
    }

    if (!isTouch && tt) {
      tt.onmouseenter = inFn
      tt.onmousemove = mvFn
      tt.onmouseleave = lvFn
    }

    return () => {
      if (!isTouch && tt) {
        tt.onmouseenter = null
        tt.onmousemove = null
        tt.onmouseleave = null
      }
    }
  }, [elRef, post, canvasRef, isTouch])

  const update = (time, speed, pos) => {
    if (!renderer || ctr.current.stop === 1) return

    if (ctr.current.actual !== pos) {
      ctr.current.actual = pos
      ctr.current.current = clamp(0, ctr.current.limit, pos - ctr.current.start)
    }

    ctr.current.progt = parseFloat(ctr.current.current / ctr.current.limit).toFixed(3)
    ctr.current.prog = lerp(ctr.current.prog, ctr.current.progt, 0.015)

    end.current = lerp(end.current, norm.current, lerpVal.current)
    animmouse.current?.progress(end.current)

    post.render({ scene, camera })
  }

  return { ctr, update }
}
