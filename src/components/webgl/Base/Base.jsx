// src/components/webgl/Base/Base.jsx

'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useAppContext } from '@/context/AppProvider'
import createBaseGeometry from '@/lib/webgl/createBaseGeometry'

export default function Base() {
  const { gl } = useAppContext()
  const meshRef = useRef(null)
  const programRef = useRef(null)
  const timelineRef = useRef(null)

  const [ctr, setCtr] = useState({
    actual: 0,
    current: 0,
    limit: 0,
    start: 0,
    prog: 0,
    progt: 0,
    stop: 0
  })

  useEffect(() => {
    if (!gl.current) return

    const { geometry, program, mesh } = createBaseGeometry({ gl: gl.current })
    meshRef.current = mesh
    programRef.current = program

    gl.current.scene?.addChild(mesh)

    // Legacy GSAP animation timeline
    timelineRef.current = gsap.timeline({
      paused: true,
      onUpdate: () => {
        gl.current.render({ scene: mesh })
      },
      onComplete: () => {
        // Legacy: this.active = 0
        // document.querySelector('#uStart0').parentNode.style.display ='flex'
      }
    })
      .fromTo(program.uniforms.uStart0, { value: 0 }, { value: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uStartX, { value: 0 }, { value: -0.1, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uMultiX, { value: -0.4 }, { value: 0.1, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uStartY, { value: 0.1 }, { value: 0.95, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uMultiY, { value: 0.45 }, { value: 0.3, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(program.uniforms.uStart2, { value: 1 }, { value: 0, duration: 1, ease: 'power2.inOut' }, 0.6)
      .fromTo('.home_about .cnt_tp', { opacity: 1 }, { opacity: 0, duration: 0.15 }, 0.9)
      .fromTo('.nav', {
        '--dark': '#F8F6F2',
        '--gray': '#8A8A8A',
        '--light': '#000'
      }, {
        '--dark': '#000',
        '--gray': '#8A8A8A',
        '--light': '#F8F6F2',
        duration: 0.5
      }, 0.1)

    /*
    // ALTERNATIVE 1: MUY LARGA Y DETALLADA
    // .fromTo(program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStartX,{value:0},{value:-.5,duration:3,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uMultiY,{value:0.45},{value:0.1,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},1.2)

    // ALTERNATIVE 2: OPCIÓN MONTAÑA
    // .fromTo(program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStartX,{value:0},{value:-.5,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uMultiY,{value:0.45},{value:0.1,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},.6)

    // ALTERNATIVE 3: CERO MONTAÑA (LÍNEA RECTA)
    // .fromTo(program.uniforms.uStart0,{value:0},{value:1,duration:.6,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStartX,{value:0},{value:-.1,duration:2,ease:'power2.inOut'},0)
    // .set(program.uniforms.uMultiX,{value:0.01},0)
    // .fromTo(program.uniforms.uStartY,{value:0.1},{value:0.95,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uMultiY,{value:0.45},{value:0.3,duration:2,ease:'power2.inOut'},0)
    // .fromTo(program.uniforms.uStart2,{value:1},{value:0,duration:1,ease:'power2.inOut'},.6)
    */

    return () => {
      timelineRef.current?.kill()
      mesh.setParent(null)
      geometry?.dispose?.()
    }
  }, [gl])

  return null
}
