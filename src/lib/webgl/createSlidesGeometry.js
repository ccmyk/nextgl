// src/lib/webgl/createSlidesGeometry.js

import { Geometry, Program, Mesh } from 'ogl'
import fragMain from '@/components/webgl/Slides/shaders/main.frag.glsl'
import vertMain from '@/components/webgl/Slides/shaders/main.vert.glsl'
import fragParent from '@/components/webgl/Slides/shaders/parent.frag.glsl'

export default function createSlidesGeometry({ gl, textures = [], useParent = false }) {
  const geometry = new Geometry(gl, {
    position: {
      size: 3,
      data: new Float32Array([
        -1, -1, 0,
         1, -1, 0,
         1,  1, 0,
        -1,  1, 0
      ])
    },
    uv: {
      size: 2,
      data: new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ])
    },
    index: {
      data: new Uint16Array([
        0, 1, 2,
        2, 3, 0
      ])
    }
  })

  const program = new Program(gl, {
    vertex: vertMain,
    fragment: useParent ? fragParent : fragMain,
    uniforms: {
      uTime: { value: 0 },
      uStart: { value: 1.5 },
      uHover: { value: 0 },
      uTexture: { value: null },
      uTextureSize: { value: [1, 1] },
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      uCover: { value: [1, 1] },
    },
    transparent: true
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { geometry, program, mesh }
}