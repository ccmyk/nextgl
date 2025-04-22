'use client'
import { useRef, useEffect } from 'react'
import { Renderer, Geometry, Texture, Program, Mesh, Transform, Post, Camera, Text } from 'ogl'
import gsap from 'gsap'
import About from '@/webgl/components/About'
import vertexShader from '@/webgl/components/About/shaders/msdf.vert.glsl'
import fragmentShader from '@/webgl/components/About/shaders/msdf.frag.glsl'
import parentShader from '@/webgl/components/About/shaders/parent.frag.glsl'
import { useWebGL } from '@/webgl/core/WebGLContext'

export function useAbout({ pos = 0, touch = 0 } = {}) {
  const ref = useRef(null)
  const aboutRef = useRef(null)
  const { gl, scene, camera } = useWebGL()

  useEffect(() => {
    if (!ref.current || !gl || !scene) return
    const el = ref.current

    // 1) Setup renderer & canvas
    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2), width: el.offsetWidth, height: el.offsetHeight })
    const { gl: ogl } = renderer
    ogl.canvas.classList.add('glAbout')
    el.parentNode.querySelector('.cCover').appendChild(ogl.canvas)

    // 2) Camera & scene
    const cam = new Camera(ogl)
    cam.position.z = 7
    const sceneNode = new Transform()

    // 3) Text geometry & atlas texture
    const fontJSON = await fetch('/fonts/PPNeueMontreal-Medium.json').then(r => r.json())
    const fontImg = new Image(); fontImg.src = '/fonts/PPNeueMontreal-Medium.png'
    await fontImg.decode()

    const textMesh = new Text(ogl, { font: fontJSON, text: el.dataset.text, align: 'center', letterSpacing: +el.dataset.l, size: +el.dataset.m, lineHeight: 1 })

    // 4) BufferGeometry
    const geometry = new Geometry(ogl, {
      position: { size: 3, data: textMesh.buffers.position },
      uv:       { size: 2, data: textMesh.buffers.uv },
      id:       { size: 1, data: textMesh.buffers.id },
      index:    { data: textMesh.buffers.index }
    })

    // 5) Font texture
    const atlasTex = new Texture(ogl, { generateMipmaps: false })
    atlasTex.image = fontImg

    // 6) Shader program
    let frag = fragmentShader.replace(/PITO/g, el.parentNode.querySelector('.Oiel').innerHTML.length)
    const program = new Program(ogl, {
      vertex:   vertexShader,
      fragment: frag,
      uniforms: { uTime: { value: 0 }, uStart: { value: 1 }, uColor: { value: 0 }, tMap: { value: atlasTex } },
      transparent: true,
      cullFace:    null,
      depthWrite:  false
    })

    // 7) Mesh & Post
    const mesh = new Mesh(ogl, { geometry, program })
    mesh.setParent(sceneNode)
    mesh.position.y = textMesh.height * 0.58
    if (el.dataset.white) program.uniforms.uColor.value = 1

    const post = new Post(ogl)
    post.addPass({ fragment: parentShader, uniforms: { uTime: { value: 0.4 }, uStart: { value: -1 }, uMouseT: { value: 0.4 }, uMouse: { value: -1 } } })

    // 8) Instantiate effect
    aboutRef.current = new About({ el, pos, renderer, mesh, post, scene: sceneNode, cam, touch, canvas: ogl.canvas })
    aboutRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })

    // 9) Resize handling
    const handleResize = () => aboutRef.current.onResize({ w: window.innerWidth, h: window.innerHeight }, { w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handleResize)

    // 10) Intersection observer
    const observer = new IntersectionObserver(entries => entries.forEach(entry => aboutRef.current.check(entry)), { threshold: 0.1 })
    observer.observe(el)

    // 11) Render loop
    let frameId
    const updateLoop = t => {
      aboutRef.current.update(t, null, pos)
      frameId = requestAnimationFrame(updateLoop)
    }
    frameId = requestAnimationFrame(updateLoop)

    // Cleanup
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      aboutRef.current.removeEvents()
    }
  }, [gl, scene])

  return { containerRef: ref }
}