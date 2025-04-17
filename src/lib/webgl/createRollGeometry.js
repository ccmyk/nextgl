// src/lib/webgl/createRollGeometry.js

import { Triangle, Program, Mesh, Texture, Vec2 } from 'ogl'
import frag from '@/components/webgl/Roll/shaders/single.frag.glsl'
import vert from '@/components/webgl/Roll/shaders/single.vert.glsl'

export default function createRollGeometry(gl, el) {
  const geometry = new Triangle(gl)

  const textures = []
  const medias = el.querySelectorAll('video, img')

  for (const media of medias) {
    const texture = new Texture(gl, { generateMipmaps: false })
    texture.image = media
    textures.push(texture)
  }

  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uStart: { value: 0 },
      uEnd: { value: 0 },
      uPos: { value: 0 },
      uChange: { value: 0 },
      tMap: { value: textures[0] || null },
      tMap2: { value: textures[1] || null },
      uCover: { value: new Vec2(0, 0) },
      uTextureSize: { value: new Vec2(0, 0) },
      uTextureSize2: { value: new Vec2(0, 0) },
    },
  })

  const mesh = new Mesh(gl, { geometry, program })

  return { mesh }
}