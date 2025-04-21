'use client'

import { useRef, useEffect } from 'react'
import { useWebGL } from '@/context/WebGLContext'
import { Title } from '@/components/webgl/Title'

export function useNavTitle(ref, options = {}) {
  const { gl, scene, camera } = useWebGL()
  const titleRef = useRef(null)
  const uniformsRef = useRef({
    uPower: { value: 0 },
    uMouse: { value: [0, 0] },
    uTime: { value: 0 },
    uWidth: { value: [] },
    uHeight: { value: [] }
  })

  useEffect(() => {
    if (!gl || !ref.current) return

    const bounds = ref.current.getBoundingClientRect()
    const title = new Title({
      gl,
      scene,
      camera,
      element: ref.current,
      bounds,
      uniforms: uniformsRef.current
    })

    titleRef.current = title

    return () => {
      if (title.destroy) title.destroy()
    }
  }, [gl, scene, camera, ref])

  return {
    uniforms: uniformsRef.current,
    title: titleRef.current
  }
}
