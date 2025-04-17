// src/lib/webgl/createAboutGeometry.js

import { Text, Texture, Program, Geometry, Mesh, Renderer, Post, Vec2, Transform } from 'ogl'
import msdfFrag from '@/components/webgl/About/shaders/msdf.frag.glsl'
import vert from '@/components/webgl/About/shaders/msdf.vert.glsl'
import postFrag from '@/components/webgl/About/shaders/parent.frag.glsl'
import fontJSON from '@/public/assets/fonts/PPNeueMontreal-Medium.json'
import fontPNG from '@/public/assets/fonts/PPNeueMontreal-Medium.png'

export default function createAboutGeometry({ gl, el, device }) {
  const size = parseFloat(el.dataset.m)
  const letterSpacing = parseFloat(el.dataset.l)
  const text = new Text({
    font: fontJSON,
    text: el.dataset.text,
    width: 7.5,
    align: 'center',
    letterSpacing,
    size: device === 2 ? size * 0.77 : size,
    lineHeight: device === 2 ? 1.01 : 1.035,
  })

  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index },
  })
  geometry.computeBoundingBox()

  const texture = new Texture(gl, { image: fontPNG })
  const program = new Program(gl, {
    vertex: vert,
    fragment: msdfFrag,
    uniforms: {
      uTime: { value: 0 },
      uStart: { value: -1 },
      uColor: { value: 0 },
      tMap: { value: texture },
    },
    transparent: true,
    cullFace: null,
    depthWrite: false,
  })

  const mesh = new Mesh(gl, { geometry, program })
  mesh.position.y = text.height * 0.58

  const scene = new Transform()
  mesh.setParent(scene)

  const post = new Post(gl)
  post.addPass({
    fragment: postFrag,
    uniforms: {
      uTime: { value: 0.4 },
      uStart: { value: -1 },
      uMouseT: { value: 0.4 },
      uMouse: { value: -1 },
    },
  })

  return {
    mesh,
    canvas: gl.canvas,
    scene,
    post,
  }
}