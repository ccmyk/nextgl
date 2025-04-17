// src/lib/webgl/createFooterGeometry.js

import { Text, Geometry, Program, Mesh, Texture, Vec2 } from 'ogl'
import msdfFrag from '@/components/webgl/Footer/shaders/frag.msdf.glsl'
import msdfVert from '@/components/webgl/Title/shaders/msdf.vert.glsl'

export default function createFooterGeometry(gl, el) {
  const tt = el.parentNode.querySelector('.Oiel')
  const fontData = JSON.parse(document.getElementById('font-json').textContent)
  const fontImage = document.getElementById('font-image')

  const texture = new Texture(gl, { image: fontImage })
  const text = new Text({
    font: fontData,
    text: el.dataset.text,
    align: 'center',
    letterSpacing: el.dataset.l,
    size: el.dataset.m,
    lineHeight: 1,
  })

  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  })

  const program = new Program(gl, {
    vertex: msdfVert,
    fragment: msdfFrag,
    uniforms: {
      uColor: { value: 0 },
      uMouse: { value: 0 },
      uMouseT: { value: 0 },
      uTime: { value: 0 },
      uStart: { value: 0 },
      uOut: { value: 1 },
      tMap: { value: texture },
    },
    transparent: true,
    cullFace: null,
    depthWrite: false,
  })

  const mesh = new Mesh(gl, { geometry, program })
  mesh.position.y = text.height * 0.58

  return { mesh }
}