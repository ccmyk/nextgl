// src/components/webgl/Footer/Footer.jsx

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAppContext } from '@/context/AppProvider'
import SplitType from 'split-type'
import gsap from 'gsap'
import createFooterGeometry from '@/lib/webgl/createFooterGeometry'
import { lerp, clamp } from '@/lib/utils/math'

export default function Footer({ elRef }) {
  const {
    gl,
    renderer,
    camera,
    post,
    scene,
    device,
    viewport,
    screen,
  } = useAppContext()

  const meshRef = useRef(null)
  const animctr = useRef(null)
  const animmouse = useRef(null)
  const canvasRef = useRef(null)

  const ctr = useRef({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0,
  })

  const boundRef = useRef([0, 0, 0, 0])
  const normRef = useRef(0)
  const endRef = useRef(0)
  const lerpVal = useRef(0.6)

  const handleMouseMove = useCallback((e) => {
    const bound = boundRef.current
    normRef.current = clamp(
      0,
      1,
      parseFloat(
        ((e.touches ? e.touches[0].pageX - bound[0] : e.layerY) / bound[3]).toFixed(3)
      )
    )
  }, [])

  const handleMouseEnter = () => {
    lerpVal.current = 0.02
  }

  const handleMouseLeave = (e) => {
    lerpVal.current = 0.01
    handleMouseMove(e)
  }

  useEffect(() => {
    if (!gl || !elRef.current) return

    const { mesh } = createFooterGeometry(gl)
    meshRef.current = mesh
    scene.addChild(mesh)

    const cnt = elRef.current.parentNode.querySelector('.cCover')
    const tt = elRef.current.parentNode.querySelector('.Oiel')
    canvasRef.current = gl.canvas

    new SplitType(tt, { types: 'chars,words' })

    if (device < 3) {
      tt.addEventListener('mouseenter', handleMouseEnter)
      tt.addEventListener('mousemove', handleMouseMove)
      tt.addEventListener('mouseleave', handleMouseLeave)
    }

    animctr.current = gsap.timeline({ paused: true })
      .fromTo(post.passes[0].program.uniforms.uTime, { value: 0 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0)
      .fromTo(post.passes[0].program.uniforms.uTime, { value: 2 }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(post.passes[0].program.uniforms.uStart, { value: 0.39 }, { value: 0.8, duration: 1, ease: 'power2.inOut' }, 0)

    animmouse.current = gsap.timeline({ paused: true })
      .fromTo(post.passes[0].program.uniforms.uMouseT, { value: 0.2 }, { value: 2, duration: 0.3, ease: 'power2.inOut' }, 0.1)
      .fromTo(post.passes[0].program.uniforms.uMouseT, { value: 2 }, { value: 0, duration: 0.3, ease: 'power2.inOut' }, 0.7)
      .fromTo(post.passes[0].program.uniforms.uMouse, { value: 0.39 }, { value: 0.8, duration: 0.9, ease: 'none' }, 0.1)

    return () => {
      scene.removeChild(mesh)
      tt.removeEventListener('mouseenter', handleMouseEnter)
      tt.removeEventListener('mousemove', handleMouseMove)
      tt.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [gl, elRef, scene, post, device, handleMouseMove])

  useEffect(() => {
    if (!meshRef.current || !post || !renderer) return

    const update = () => {
      endRef.current = lerp(endRef.current, normRef.current, lerpVal.current)
      animmouse.current?.progress(endRef.current)
      animctr.current?.progress(ctr.current.prog)
      post.render({ scene: meshRef.current })
    }

    const interval = setInterval(update, 16)
    return () => clearInterval(interval)
  }, [post, renderer])

  return null
}