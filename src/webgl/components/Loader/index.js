// src/webgl/components/Loader/index.js

import { createLoaderGeometry } from './geometry';
import fragShader from './shaders/main.frag.glsl';
import vertShader from './shaders/main.vert.glsl';

export function setupLoaderScene(gl) {
  if (!gl) return;

  const geometry = createLoaderGeometry(gl);

  // Shader setup
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShader);

  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);
  // Other setup (buffer binding, attribute setup, etc.)
}
