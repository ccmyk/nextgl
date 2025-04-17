// src/lib/webgl/createLoaderGeometry.js

import { Triangle, Program, Mesh, Vec2 } from 'ogl'
import frag from '@/components/webgl/Loader/shaders/main.frag.glsl'
import vert from '@/components/webgl/Loader/shaders/main.vert.glsl'

export default function createLoaderGeometry(gl) {
  const geometry = new Triangle(gl)

  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uTime: { value: 0 },
      uStart0: { value: 1 },
      uStart1: { value: 0.5 },
      uStart2: { value: 1 },
      uStartX: { value: 0 },
      uStartY: { value: 0.1 },
      uMultiX: { value: -0.4 },
      uMultiY: { value: 0.45 },
      uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
    },
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { mesh }
}