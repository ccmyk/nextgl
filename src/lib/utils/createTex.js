// src/lib/utils/createTex.js
export function createTex(gl, options = {}) {
  if (!gl) throw new Error("WebGL context required!");

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Default configurations
  const {
    level = 0,
    internalFormat = gl.RGBA,
    width = 512,
    height = 512,
    border = 0,
    srcFormat = gl.RGBA,
    srcType = gl.UNSIGNED_BYTE,
  } = options;

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, null);

  // Texture parameters (could be extended)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return texture; // Return texture for further usage
}