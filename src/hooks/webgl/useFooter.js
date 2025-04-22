'use client'
import { useRef, useEffect } from 'react'
import {
  Renderer, Camera, Transform,
  Text, Geometry, Texture, Program,
  Mesh, Post
} from 'ogl'
import Footer from '@/webgl/components/Footer'
import vertexShader   from '@/webgl/components/Footer/shaders/msdf.vert.glsl'
import fragmentShader from '@/webgl/components/Footer/shaders/msdf.frag.glsl'
import parentShader   from '@/webgl/components/Footer/shaders/parent.frag.glsl'
import { useWebGL }   from '@/webgl/core/WebGLContext'

export function useFooter({ pos = 0, touch = 0 } = {}) {
  const containerRef = useRef(null)
  const footerRef    = useRef(null)
  const { gl, scene, camera } = useWebGL()

  useEffect(() => {
    if (!containerRef.current || !gl || !scene) return
    const el = containerRef.current

    // 1) Create ogl renderer
    const renderer = new Renderer({
      canvas: null,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2)
    })
    const ogl = renderer.gl
    ogl.canvas.classList.add('glFooter')
    el.parentNode.querySelector('.cCover').appendChild(ogl.canvas)

    // 2) Camera & scene branch
    const cam = new Camera(ogl)
    cam.position.z = 7
    const sceneNode = new Transform()

    // 3) MSDF text setup
    const fontJSON = await fetch('/fonts/PPNeueMontreal-Medium.json').then(r => r.json())
    const fontImg  = new Image()
    fontImg.src    = '/fonts/PPNeueMontreal-Medium.png'
    await fontImg.decode()

    const text = new Text(ogl, {
      font: fontJSON,
      text: el.dataset.text,
      align: 'center',
      letterSpacing: +el.dataset.l,
      size: +el.dataset.m,
      lineHeight: 1
    })

    const geometry = new Geometry(ogl, {
      position: { size: 3, data: text.buffers.position },
      uv:       { size: 2, data: text.buffers.uv },
      id:       { size: 1, data: text.buffers.id },
      index:    { data: text.buffers.index }
    })
    geometry.computeBoundingBox()

    const atlasTex = new Texture(ogl, { generateMipmaps: false })
    atlasTex.image = fontImg

    // 4) Shader Program
    const program = new Program(ogl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap:   { value: atlasTex },
        uColor: { value: 0 },
        uTime:  { value: 0 },
        uStart: { value: 0.8 }
      },
      transparent: true,
      cullFace:    null,
      depthWrite:  false
    })

    // 5) Mesh + Post
    const mesh = new Mesh(ogl, { geometry, program })
    mesh.setParent(sceneNode)

    const post = new Post(ogl)
    post.addPass({
      fragment: parentShader,
      uniforms: {
        uTime:   { value: 0 },
        uStart:  { value: 0.8 },
        uMouseT: { value: 0.2 },
        uMouse:  { value: 0.39 },
        uOut:    { value: 0 }
      }
    })

    // 6) Instantiate your class
    footerRef.current = new Footer({
      gl:       ogl,
      scene:    sceneNode,
      camera:   cam,
      element:  el,
      renderer,
      touch
    })

    // 7) Resize & observer & loop
    footerRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })
    const onResize = () => footerRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => footerRef.current.check(e)),
      { threshold: 0.1 }
    )
    obs.observe(el)

    let id = requestAnimationFrame(function renderLoop(t) {
      footerRef.current.update(t, null, pos)
      id = requestAnimationFrame(renderLoop)
    })

    return () => {
      obs.disconnect()
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(id)
      footerRef.current.removeEvents()
    }
  }, [gl, scene])

  return { containerRef }
}