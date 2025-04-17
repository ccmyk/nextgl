// src/lib/webgl/createTitleGeometry.js

import { Geometry, Mesh, Program, Text, Texture, Vec2 } from 'ogl'
import msdfFrag from '@/components/webgl/Title/shaders/msdf.frag.glsl'
import msdfVert from '@/components/webgl/Title/shaders/msdf.vert.glsl'

export default function createTitleGeometry({ gl, font, texture, el }) {
  const text = new Text({
    font,
    text: el.dataset.text,
    align: 'center',
    letterSpacing: el.dataset.l || 0,
    size: parseFloat(el.dataset.m),
    lineHeight: 1,
  })

  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  })

  const map = new Texture(gl, { image: texture, generateMipmaps: false })

  const program = new Program(gl, {
    vertex: msdfVert,
    fragment: msdfFrag,
    uniforms: {
      uTime: { value: 0 },
      uKey: { value: -2 },
      uPower: { value: 1 },
      uPowers: { value: [] },
      uWidth: { value: [] },
      uHeight: { value: [] },
      uCols: { value: 1.5 },
      uStart: { value: 1 },
      uColor: { value: 0 },
      uMouse: { value: new Vec2(0, 0) },
      tMap: { value: map },
    },
    transparent: true,
    cullFace: null,
    depthWrite: false,
  })

  const mesh = new Mesh(gl, { geometry, program })
  mesh.position.y = text.height * 0.58

  return { mesh, program }
}