'use client'
import { useRef, useEffect } from 'react'
import { Renderer, Mesh, Transform, Post, Camera, Texture, Geometry, Program } from 'ogl'
import Slides from '@/webgl/components/Slides'
import vertexShader   from '@/webgl/components/Slides/shaders/main.vert.glsl'
import fragmentShader from '@/webgl/components/Slides/shaders/main.frag.glsl'
import parentShader   from '@/webgl/components/Slides/shaders/parent.frag.glsl'
import { useWebGL }   from '@/webgl/core/WebGLContext'

export function useSlides({ ids = 0, touch = 0 } = {}) {
  const ref      = useRef(null)
  const slideRef = useRef(null)
  const { gl, scene, camera } = useWebGL()

  useEffect(() => {
    if (!ref.current || !gl) return
    const el = ref.current

    // 1) Renderer & canvas
    const renderer = new Renderer({
      canvas: gl.canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2),
      antialias: true
    })

    // 2) Build meshes & textures
    const medias   = Array.from(el.parentNode.querySelectorAll('video,img'))
    const textures = medias.map(media => {
      const tex = new Texture(gl, { generateMipmaps: false })
      tex.image = media
      return tex
    })
    const meshes = textures.map(tex => {
      const geo = new Geometry(gl, {
        position: { size: 3, data: /* your plane positions */ [] },
        uv:       { size: 2, data: /* your plane uvs */ [] },
        index:    { data: /* your plane indices */ [] }
      })
      const prog = new Program(gl, {
        vertex:   vertexShader,
        fragment: fragmentShader,
        uniforms:{
          tMap:      { value: tex },
          uTextureSize: { value: tex.image.tagName==='VIDEO'
            ? [media.width,media.height]
            : [tex.image.naturalWidth,tex.image.naturalHeight]
          },
          uCover:    { value: [0,0] },
          uHover:    { value: 0 },
          uStart:    { value: 1.5 },
        },
        transparent:true,
        depthWrite: false
      })
      const m = new Mesh(gl, { geometry: geo, program: prog })
      return m
    })

    // 3) Scene & camera
    const sceneNode = new Transform()
    meshes.forEach(m => m.setParent(sceneNode))

    // 4) Postprocess pass
    const post = new Post(gl)
    post.addPass({
      fragment: parentShader,
      uniforms:{
        uTime:  { value: 0 },
        uStart:{ value: 1.5 },
        uHover:{ value: 0 }
      }
    })

    // 5) Instantiate
    slideRef.current = new Slides({
      gl,
      scene: sceneNode,
      camera,
      element: el,
      meshes,
      medias,
      textures,
      post,
      canvas: gl.canvas,
      device: window.innerWidth < 768 ? 1 : 3
    })

    // register with manager
    webgl.registerComponent(`Slides-${ids}`, slideRef.current)

    // Intersection, resize, render loop all come from the core

    return () => {
      webgl.unregisterComponent(`Slides-${ids}`)
      slideRef.current.removeEvents()
    }
  }, [gl, scene, camera])

  return { containerRef: ref }
}