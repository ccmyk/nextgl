// src/lib/webgl/createBaseGeometry.js

import { Plane, Program, Mesh, Vec2 } from 'ogl'
import frag from '@/components/webgl/Base/shaders/main.frag.glsl'
import vert from '@/components/webgl/Base/shaders/main.vert.glsl'

export default function createBaseGeometry(gl) {
  const geometry = new Plane(gl)

  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uTime: { value: 0 },
      uStart: { value: 0 },
      uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
    },
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { mesh }
}