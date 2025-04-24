"use client";
"use client"import { Geometry, Text } from 'ogl'

/**
 * Create an MSDF text geometry for a Title.
 *
 * @param {WebGLRenderingContext} gl
 * @param {MSDFFont} fontMSDF  — loaded font
 * @param {string} textString
 * @param {{ letterSpacing?: number, size?: number, lineHeight?: number }} options
 */
export function createTitleGeometry(gl, fontMSDF, textString, options = {}) {
  const {
    letterSpacing = 0,
    size = 1,
    lineHeight = 1,
    align = 'center',
  } = options

  // Build the text mesh buffers
  const text = new Text({
    font: fontMSDF,
    text: textString,
    align,
    letterSpacing,
    size,
    lineHeight,
  })

  // Pack into an OGL Geometry
  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv:       { size: 2, data: text.buffers.uv },
    id:       { size: 1, data: text.buffers.id },
    index:    { data: text.buffers.index },
  })
  geometry.computeBoundingBox()

  return { geometry, text }
}