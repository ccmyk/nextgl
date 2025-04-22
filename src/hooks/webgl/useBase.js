'use client'
import { useRef, useEffect } from 'react'
import { Texture, Program, Mesh, Geometry } from 'ogl'
import Base from '@/webgl/components/Base'
import vertex from '@/webgl/components/Base/shaders/main.vert.glsl'
import fragment from '@/webgl/components/Base/shaders/main.frag.glsl'
import { useWebGL } from '@/webgl/core/WebGLContext'

export function useBase({ pos = 0, touch = 0 } = {}) {
  const ref = useRef(null)
  const baseRef = useRef(null)
  const { gl, scene, camera, renderer } = useWebGL()

  useEffect(() => {
    if (!ref.current || !gl || !scene || !renderer) return

    const el = ref.current
    const media = el.querySelector('img,video')
    const canvas = gl.canvas

    // create texture and mesh
    const texture = new Texture(gl, { image: media })
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]) },
      uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) }
    })
    const program = new Program(gl, { vertex, fragment, uniforms: { uCover: { value: [0, 0] }, uTextureSize: { value: [media.width, media.height] }, uStart: { value: 0 }, uStart1: { value: 0 }, uTime: { value: 0 }, uMouse: { value: [0, 0] } }, transparent: true })
    const mesh = new Mesh(gl, { geometry, program })
    scene.addChild(mesh)

    baseRef.current = new Base({ el, pos, mesh, texture, renderer, touch, canvas })
    baseRef.current.load()

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => baseRef.current.check(entry))
    }, { threshold: 0.1 })
    observer.observe(el)

    const onResize = () => baseRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    onResize()

    let raf = requestAnimationFrame(function tick(t) {
      baseRef.current.update(t, null, pos)
      raf = requestAnimationFrame(tick)
    })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      baseRef.current.removeEvents()
    }
  }, [gl, scene, renderer])

  return { containerRef: ref }
}