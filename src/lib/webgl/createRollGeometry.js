// src/lib/webgl/createRollGeometry.js

import { Geometry, Program, Mesh } from 'ogl'
import fragment from '@/components/webgl/Roll/shaders/single.frag.glsl'
import vertex from '@/components/webgl/Roll/shaders/single.vert.glsl'

export default function createRollGeometry({ gl, uniforms = {} }) {
  const geometry = new Geometry(gl, {
    position: {
      size: 3,
      data: new Float32Array([
        -1, -1, 0,
         3, -1, 0,
        -1,  3, 0
      ]),
    },
    uv: {
      size: 2,
      data: new Float32Array([
        0, 0,
        2, 0,
        0, 2
      ]),
    },
  })

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      ...uniforms
    },
    transparent: true,
  })

  const mesh = new Mesh(gl, { geometry, program })
  return { geometry, program, mesh }
}