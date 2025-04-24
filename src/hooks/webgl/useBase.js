'use client'
import { useRef, useEffect } from 'react'
import { Renderer, Geometry, Texture, Program, Mesh, Transform, Camera } from 'ogl'
import { useWebGL } from '@/webgl/core/WebGLContext'
import Base from '@/webgl/components/Base'
import vert from '@/webgl/components/Base/shaders/main.vert.glsl'
import frag from '@/webgl/components/Base/shaders/main.frag.glsl'

export function useBase() {
  const containerRef = useRef(null)
  const baseRef      = useRef(null)
  const { gl, scene, camera } = useWebGL()

  useEffect(() => {
    const el = containerRef.current
    if (!el || !gl || !scene) return

    // 1) Create OGL Renderer on shared canvas
    const renderer = new Renderer({
      canvas: gl.canvas,
      alpha:  true,
      dpr:    Math.min(window.devicePixelRatio, 2),
      antialias: true
    })
    const ogl = renderer.gl
    ogl.canvas.classList.add('glBase')
    el.parentNode.querySelector('.cCover').appendChild(ogl.canvas)

    // 2) Instantiate Base effect
    baseRef.current = new Base({
      gl:       ogl,
      scene,
      camera,
      renderer
    })

    // 3) Resize handling
    const onResize = () => {
      baseRef.current.onResize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', onResize)
    onResize()

    // 4) IntersectionObserver to auto-start/stop
    const obs = new IntersectionObserver(
      ([entry]) => baseRef.current.check(entry),
      { threshold: 0.1 }
    )
    obs.observe(el)

    // 5) Animation loop
    let raf = requestAnimationFrame(function loop(t) {
      baseRef.current.update(t)
      raf = requestAnimationFrame(loop)
    })

    return () => {
      obs.disconnect()
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      baseRef.current.removeEvents()
    }
  }, [gl, scene, camera])

  return { containerRef }
}