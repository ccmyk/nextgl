// src/lib/webgl/createFooterGeometry.js

import { Geometry, Program, Mesh } from 'ogl'
import fragment from '@/components/webgl/Footer/shaders/parent.frag.glsl'
import vertex from '@/components/webgl/Footer/shaders/msdf.glsl'

export default function createFooterGeometry({ gl }) {
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
      uStart: { value: 0 },
      uOut: { value: 0 },
      uMouseT: { value: 0 },
      uMouse: { value: 0 },
    },
    transparent: true,
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { geometry, program, mesh }
}
