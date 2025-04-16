// src/components/webgl/Roll/Roll.jsx

'use client'

import { useRef, useEffect } from 'react'
import { Vec2, Renderer, Camera, Transform, Mesh } from 'ogl'
import createRollGeometry from '@/lib/webgl/createRollGeometry'
import fragment from './shaders/single.frag.glsl'
import vertex from './shaders/single.vert.glsl'

export default function Roll() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rafId = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const renderer = new Renderer({ dpr: 2, canvas: canvasRef.current, alpha: true })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    const scene = new Transform()
    const camera = new Camera(gl)
    camera.position.z = 5

    const pos = new Vec2()
    const geometry = createRollGeometry(gl)

    const program = renderer.program({
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
    mesh.setParent(scene)

    const resize = () => {
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }

    const update = (t) => {
      program.uniforms.uTime.value = t * 0.001
      program.uniforms.uMouse.value = [pos.x, pos.y]
      renderer.render({ scene, camera })
      rafId.current = requestAnimationFrame(update)
    }

    const onMouseMove = (e) => {
      pos.x = (e.clientX / window.innerWidth) * 2 - 1
      pos.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    resize()
    update(0)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      program?.dispose?.()
      geometry?.dispose?.()
    }
  }, [])

  return (
    <div ref={containerRef} className="webgl-roll-container">
      <canvas ref={canvasRef} className="webgl-roll-canvas" />
    </div>
  )
}
