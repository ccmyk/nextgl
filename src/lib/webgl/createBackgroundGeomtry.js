// src/lib/webgl/createBackgroundGeometry.js

import { Program, Geometry } from 'ogl'

export default function createBackgroundGeometry() {
  const geometry = new Geometry()

  const program = new Program(null, {
    vertex: `
      attribute vec2 uv;
      attribute vec3 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragment: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec3 color = 0.5 + 0.5 * cos(uTime + vUv.xyx + vec3(0,2,4));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
    },
    transparent: true,
    depthTest: false,
  })

  return { geometry, program }
}
