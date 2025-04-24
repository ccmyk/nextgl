'use client'
import { useRef, useEffect } from 'react'
import { Renderer, Geometry, Texture, Program, Mesh, Transform, Post, Camera, Text } from 'ogl'
import gsap from 'gsap'
import About from '@/webgl/components/About'
import vertexShader   from '@/webgl/components/About/shaders/msdf.vert.glsl'
import fragmentShader from '@/webgl/components/About/shaders/msdf.frag.glsl'
import parentShader   from '@/webgl/components/About/shaders/parent.frag.glsl'
import { useWebGL }   from '@/webgl/core/WebGLContext'

export function useAbout({ pos = 0, touch = 0 } = {}) {
  const ref       = useRef(null)
  const aboutRef  = useRef(null)
  const { gl, scene, camera } = useWebGL()

  useEffect(() => {
    const el = ref.current
    if (!el || !gl || !scene) return

    // 1) Renderer & canvas
    const renderer = new Renderer({
      canvas: gl.canvas,
      alpha:  true,
      dpr:    Math.min(window.devicePixelRatio, 2),
      antialias: true,
    })
    const ogl = renderer.gl
    ogl.canvas.classList.add('glAbout')
    el.parentNode.querySelector('.cCover').appendChild(ogl.canvas)

    // 2) Camera & scene node
    const cam = new Camera(ogl)
    cam.position.z = 7
    const sceneNode = new Transform()

    // 3) Text geometry + MSDF atlas  
    const fontJSON = await fetch('@/assets/fonts/PPNeueMontreal-Medium.json').then(r => r.json())
    const fontImg  = new Image(); fontImg.src = '/fonts/PPNeueMontreal-Medium.png'
    await fontImg.decode()
    const text    = new Text({ font: fontJSON, text: el.dataset.text, align:'center', letterSpacing:+el.dataset.l, size:+el.dataset.m, lineHeight:1 })

    // 4) OGL Geometry
    const geometry = new Geometry(ogl, {
      position: { size: 3, data: text.buffers.position },
      uv:       { size: 2, data: text.buffers.uv },
      id:       { size: 1, data: text.buffers.id },
      index:    { data: text.buffers.index }
    })
    geometry.computeBoundingBox()

    // 5) Atlas Texture
    const atlasTex = new Texture(ogl, { generateMipmaps: false })
    atlasTex.image = fontImg

    // 6) Instantiate About effect
    aboutRef.current = new About({
      gl:       ogl,
      scene:    sceneNode,
      camera:   cam,
      element:  el,
      renderer,
      touch,
    })

    // Resize/observer/render loop
    aboutRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', () => aboutRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w:window.innerWidth, h: window.innerHeight }))
    const obs = new IntersectionObserver(entries => entries.forEach(e => aboutRef.current.check(e)), { threshold: 0.1 })
    obs.observe(el)

    let id = requestAnimationFrame(function loop(t) {
      aboutRef.current.update(t, null, pos)
      id = requestAnimationFrame(loop)
    })

    return () => {
      obs.disconnect()
      window.removeEventListener('resize', aboutRef.current.onResize)
      cancelAnimationFrame(id)
      aboutRef.current.removeEvents()
    }
  }, [gl, scene])

  return { containerRef: ref }
}