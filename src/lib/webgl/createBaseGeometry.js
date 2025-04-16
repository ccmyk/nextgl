// src/lib/webgl/createBaseGeometry.js

import { Geometry, Program, Mesh } from 'ogl'
import fragment from '@/components/webgl/Base/shaders/single.frag.glsl'
import vertex from '@/components/webgl/Base/shaders/single.vert.glsl'
import { lerp, clamp } from '@/lib/utils/math'

export default function createBaseGeometry({ gl }) {
  const geometry = new Geometry(gl, {
    position: {
      size: 3,
      data: new Float32Array([
        -1, -1, 0,
         3, -1, 0,
        -1,  3, 0,
      ]),
    },
    uv: {
      size: 2,
      data: new Float32Array([
        0, 0,
        2, 0,
        0, 2,
      ]),
    },
  })

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uStart0: { value: 0 },
      uStartX: { value: 0 },
      uStartY: { value: 0 },
      uMultiX: { value: 0 },
      uMultiY: { value: 0 },
      uStart2: { value: 1 },
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
    },
    transparent: true,
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { geometry, program, mesh }
}