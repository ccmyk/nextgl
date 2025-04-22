'use client'
import { useRef, useEffect } from 'react'
import {
  Renderer,
  Program,
  Mesh,
  Transform,
  Camera,
  Texture,
  Triangle,
  Vec2,
  Geometry
} from 'ogl'
import gsap from 'gsap'
import Pg from '@/webgl/components/Pg'
import vertexShader from '@/webgl/components/Pg/shaders/pg.vert.glsl'
import fragmentShader from '@/webgl/components/Pg/shaders/pg.frag.glsl'
import { useWebGL } from '@/webgl/core/WebGLContext'

export function usePg({ pos = 0, touch = 0 } = {}) {
  const ref = useRef(null)
  const pgRef = useRef(null)
  const { gl, scene, camera } = useWebGL()

  useEffect(() => {
    if (!ref.current || !gl || !scene) return
    const el = ref.current

    // 1) Setup renderer & canvas
    const renderer = new Renderer({
      canvas: document.createElement('canvas'),
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true
    })
    const { gl: ogl } = renderer
    ogl.canvas.classList.add('glPg')
    el.parentNode.appendChild(ogl.canvas)

    // 2) Camera & scene node
    const cam = new Camera(ogl)
    cam.position.z = 5
    const sceneNode = new Transform()

    // 3) Geometry (simple full‑screen triangle)
    const tri = new Triangle(ogl)

    // 4) Program
    const program = new Program(ogl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uZoom: { value: 1 },
        uMove: { value: 1 }
      }
    })

    // 5) Mesh
    const mesh = new Mesh(ogl, { geometry: tri, program })
    mesh.setParent(sceneNode)

    // 6) Instantiate effect
    pgRef.current = new Pg({ el, pos, renderer, mesh, scene: sceneNode, cam, touch, canvas: ogl.canvas })
    pgRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })

    // 7) Resize
    const handleResize = () => pgRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handleResize)

    // 8) Intersection Observer
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => pgRef.current.check(entry)),
      { threshold: 0.1 }
    )
    observer.observe(el)

    // 9) Render loop
    let frame
    const loop = t => {
      pgRef.current.update(t, null, pos)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    // Cleanup
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frame)
      pgRef.current.removeEvents()
    }
  }, [gl, scene])

  return { containerRef: ref }
}