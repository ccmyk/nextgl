// src/webgl/components/Loader/geometry.js

import { Geometry } from 'ogl';
import { createPlaneVertices, createPlaneUVs } from './utils';

export function createLoaderGeometry(gl) {
  const positions = new Float32Array(createPlaneVertices());
  const uvs       = new Float32Array(createPlaneUVs());

  return new Geometry(gl, {
    position: { size: 2, data: positions },
    uv:       { size: 2, data: uvs },
  });
}