// src/lib/webgl/els.js

import { Renderer, Vec2, Program, Mesh, Geometry, Text, Transform, Post } from 'ogl'
import { clamp } from '@/lib/utils/math'
import { useAppContext } from '@/context/AppProvider'

import createFooterGeometry from './createFooterGeometry'
import createSlidesGeometry from './createSlidesGeometry'

export async function createEls(el, temp = 'base') {
  const app = useAppContext()
  const pos = el.dataset.oi

  if (temp === 'foot') {
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.max(window.devicePixelRatio, 2),
      width: el.offsetWidth,
      height: el.offsetHeight,
    })

    const { gl } = renderer
    gl.canvas.classList.add('glF')
    el.parentNode.querySelector('.cCover')?.appendChild(gl.canvas)

    const cam = app.gl.current?.createCamera?.(gl)

    const { mesh, text, program } = await createFooterGeometry(gl, el)

    const post = new Post(gl)
    post.addPass({
      fragment: await import('@/components/webgl/Footer/shaders/frag.parent.glsl?raw').then(m => m.default),
      uniforms: {
        uTime: { value: 0 },
        uStart: { value: 0 },
        uMouseT: { value: 0 },
        uMouse: { value: 0 },
        uOut: { value: 1.0 },
      },
    })

    mesh.position.y = text.height * 0.58

    return {
      name: 'Footer',
      el,
      pos,
      renderer,
      mesh,
      text,
      post,
      scene: new Transform(),
      camera: cam,
      canvas: gl.canvas,
    }
  }

  if (temp === 'slider') {
    const { meshes, textures, post } = await createSlidesGeometry({
      el,
      dataset: el.dataset,
      gl: app.gl.current,
      camera: app.camera.current,
      post: null,
    })

    return {
      name: 'Slides',
      el,
      pos,
      meshes,
      textures,
      post,
      dev: app.main.current.device,
    }
  }

  return null
}