'use client'

import { Geometry } from 'ogl'

/**
 * Full-screen quad geometry for Loader.
 */
export function createLoaderGeometry(gl) {
  return new Geometry(gl, {
    position: {
      size: 3,
      data: new Float32Array([
        -1, -1, 0,
         1, -1, 0,
        -1,  1, 0,
         1,  1, 0,
      ]),
    },
    uv: {
      size: 2,
      data: new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        1, 1,
      ]),
    },
    index: {
      data: new Uint16Array([0, 2, 1, 1, 2, 3]),
    },
  });
}