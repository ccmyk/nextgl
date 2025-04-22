import { Geometry } from 'ogl'

export function createGeometry(gl, text) {
  // Create geometry with same attributes as legacy
  const geometry = new Geometry(gl, {
    position: { size: 3, data: text.buffers.position },
    uv: { size: 2, data: text.buffers.uv },
    id: { size: 1, data: text.buffers.id },
    index: { data: text.buffers.index }
  })

  // Compute bounding box the same way as legacy
  geometry.computeBoundingBox()

  return geometry
}

// Helper to set up text with same line breaks as legacy
export function createText(Text, font, text, device) {
  let br = ' '
  let br2 = ' '
  let width = 6.2
  let letterSpacing = -0.01
  let lineHeight = 0.995

  // Match legacy responsive adjustments
  if (device < 2) {
    br = '\n'
    br2 = '\n'
    width = 13.1
    lineHeight = 1.035
  } else if (device === 2) {
    width = 7.5
    lineHeight = 1.01
    letterSpacing = -0.015
  }

  return new Text({
    font,
    text,
    width,
    align: 'center',
    letterSpacing,
    size: device === 2 ? 0.77 : 1,
    lineHeight
  })
}

export default { createGeometry, createText }
