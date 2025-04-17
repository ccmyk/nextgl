// src/lib/webgl/createSlidesGeometry.js
import { Plane, Mesh, Program, Texture } from 'ogl'
import frag from '@/components/webgl/Slides/shaders/main.frag.glsl'
import vert from '@/components/webgl/Slides/shaders/main.vert.glsl'

export default function createSlidesGeometry({ gl, el, dataset, camera, post }) {
  const geometry = new Plane(gl)
  const texture = new Texture(gl, { generateMipmaps: false })
  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uStart: { value: 0 },
      uTime: { value: 0 },
      tMap: { value: texture },
    },
    transparent: true,
  })

  const mesh = new Mesh(gl, { geometry, program })
  return {
    meshes: [mesh],
    textures: [texture],
  }
}