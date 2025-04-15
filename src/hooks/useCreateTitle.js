// src/hooks/useCreateTitle.js

'use client'

import { useEffect, useRef } from 'react'
import { Vec2, Renderer, Camera, Transform, Mesh } from 'ogl'
import gsap from 'gsap'

import Title from '@/components/webgl/Title/Title.jsx'
import createTextGeometry from '@/lib/webgl/createTextGeometry'

export default function useCreateTitle({ el }) {
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!el || !el.dataset?.text) return

    const canvas = document.createElement('canvas')
    canvas.classList.add('webgl-title-canvas')
    el.appendChild(canvas)

    const cnt = el.parentNode.querySelector('.cCover')
    const tt = el.parentNode.querySelector('.Oiel')
    if (!cnt || !tt) return

    const pos = new Vec2()
    const scene = new Transform()
    const camera = new Camera()
    const touch = window.matchMedia('(hover: none)').matches ? 1 : 0
    const renderer = new Renderer({ canvas, alpha: true, dpr: 2 })
    renderer.setSize(cnt.clientWidth, cnt.clientHeight)

    const { geometry, program, text } = createTextGeometry({
      text: el.dataset.text,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
        uPowers: { value: [] },
        uPower: { value: 0 },
        uKey: { value: -2 },
        uWidth: { value: [] },
        uHeight: { value: [] },
      },
    })

    const mesh = new Mesh(renderer.gl, { geometry, program })
    mesh.setParent(scene)

    const title = new Title({
      el,
      cnt,
      tt,
      pos,
      canvas,
      renderer,
      camera,
      scene,
      mesh,
      text,
      touch,
    })

    title.onResize()
    title.check()
    title.start()

    const handleResize = () => title.onResize()
    window.addEventListener('resize', handleResize)

    instanceRef.current = title

    return () => {
      title.removeEvents()
      window.removeEventListener('resize', handleResize)
    }
  }, [el])

  return instanceRef
}