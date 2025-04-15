// src/components/webgl/Loader/Loader.jsx

'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Triangle, Program, Mesh, Vec2 } from 'ogl'
import gsap from 'gsap'

import vertexShader from './shaders/main.vert.glsl'
import fragmentShader from './shaders/main.frag.glsl'
import useLoaderAnimation from '@/hooks/useLoaderAnimation'

export default function Loader() {
  const canvasRef = useRef(null)
  const programRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    const gl = renderer.gl
    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uStart1: { value: 0.5 },
        uStart0: { value: 1 },
        uStart2: { value: 1 },
        uStartX: { value: 0 },
        uStartY: { value: 0.1 },
        uMultiX: { value: -0.4 },
        uMultiY: { value: 0.45 },
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    rendererRef.current = renderer
    programRef.current = program
    meshRef.current = mesh

    useLoaderAnimation({ program, renderer, mesh })

    return () => {
      if (gl.getExtension('WEBGL_lose_context')) {
        gl.getExtension('WEBGL_lose_context').loseContext()
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="webgl-loader-canvas fixed inset-0 z-50" />
}