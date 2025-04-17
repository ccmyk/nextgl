// src/lib/webgl/createPgGeometry.js

import { Plane, Program, Mesh, Vec2, Texture } from 'ogl'
import frag from '@/components/webgl/Pg/shaders/main.frag.glsl'
import vert from '@/components/webgl/Pg/shaders/main.vert.glsl'

export default function createPgGeometry(gl) {
  const geometry = new Plane(gl, {
    heightSegments: 1,
    widthSegments: 1,
  })

  const texture = new Texture(gl, {
    generateMipmaps: false,
  })

  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uTime: { value: 0 },
      uStart: { value: 0 },
      uStart1: { value: 0.5 },
      tMap: { value: texture },
      uCover: { value: new Vec2(0, 0) },
      uTextureSize: { value: new Vec2(0, 0) },
      uMouse: { value: new Vec2(0, 0) },
      uLoad: { value: 0 },
    },
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { mesh }
}