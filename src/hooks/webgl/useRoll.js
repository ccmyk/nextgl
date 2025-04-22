'use client'

import { useRef, useEffect } from 'react'
import { Renderer, Triangle, Texture, Program, Mesh } from 'ogl'
import Roll from '@/webgl/components/Roll'
import vertexShader from '@/webgl/components/Roll/shaders/single.vert.glsl'
import fragmentShader from '@/webgl/components/Roll/shaders/single.frag.glsl'

export function useRoll({ pos = 0, touch = 0 } = {}) {
  const containerRef = useRef(null)
  const rollRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // 1) setup renderer + canvas
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
      width: el.offsetWidth,
      height: el.offsetHeight,
    })
    const { gl } = renderer
    gl.canvas.classList.add('glRoll')
    el.parentNode.appendChild(gl.canvas)

    // 2) base geometry
    const geometry = new Triangle(gl)

    // 3) gather media elements & make textures
    const medias = el.parentNode.querySelectorAll('video,img')
    const textures = Array.from(medias).map((m) => {
      const tex = new Texture(gl, { generateMipmaps: false })
      tex.image = m
      return tex
    })

    // 4) shader program
    const program = new Program(gl, {
      vertex:   vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uStart:        { value: 0 },
        uEnd:          { value: 0 },
        uChange:       { value: 0 },
        tMap:          { value: textures[0] },
        tMap2:         { value: textures[1] },
        uCover:        { value: [el.offsetWidth, el.offsetHeight] },
        uTextureSize:  { value: [textures[0].image.width,  textures[0].image.height] },
        uTextureSize2: { value: [textures[1].image.width,  textures[1].image.height] },
      },
    })

    // 5) mesh
    const mesh = new Mesh(gl, { geometry, program })

    // 6) instantiate your Roll class
    rollRef.current = new Roll({
      el,
      pos,
      renderer,
      mesh,
      scene: mesh,       // Roll only uses renderer.render({ scene: mesh })
      medias,
      textures,
      canvas: gl.canvas,
      touch,
    })

    // initial size
    rollRef.current.onResize(
      { w: window.innerWidth,  h: window.innerHeight },
      { w: window.innerWidth,  h: window.innerHeight }
    )

    // 7) resize handling
    const handleResize = () =>
      rollRef.current.onResize(
        { w: window.innerWidth,  h: window.innerHeight },
        { w: window.innerWidth,  h: window.innerHeight }
      )
    window.addEventListener('resize', handleResize)

    // 8) intersection observer
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((entry) => rollRef.current.check(entry)),
      { threshold: 0.1 }
    )
    obs.observe(el)

    // 9) render loop
    let frameId
    const loop = (t) => {
      rollRef.current.update(t, null, pos)
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)

    // cleanup
    return () => {
      obs.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      rollRef.current.removeEvents()
    }
  }, [pos, touch])

  return { containerRef }
}