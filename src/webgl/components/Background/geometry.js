'use client'

export function createBackgroundGeometry(gl) {
  return new Geometry(gl, {
    position: {
      size: 2,
      // full‐screen triangle (covers viewport)
      data: new Float32Array([
        -1, -1,
         3, -1,
        -1,  3,
      ]),
    },
    uv: {
      size: 2,
      data: new Float32Array([
        0, 0,
        2, 0,
        0, 2,
      ]),
    },
  });
}