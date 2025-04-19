// src/components/webgl/createWebGLContext.js

'use client'

import { Renderer } from 'ogl'

export function createWebGLContext({ canvas, dpr = 1.5, alpha = true }) {
  const gl = new Renderer({
    canvas,
    dpr,
    alpha,
    antialias: true,
    powerPreference: 'high-performance',
  }).gl

  gl.clearColor(0, 0, 0, 0)
  gl.canvas.style.position = 'absolute'
  gl.canvas.style.top = 0
  gl.canvas.style.left = 0
  gl.canvas.style.width = '100%'
  gl.canvas.style.height = '100%'
  gl.canvas.classList.add('webgl-canvas')

  return gl
}