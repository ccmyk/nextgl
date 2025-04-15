// lib/webgl/context.js
export const createWebGLContext = (canvas) => {
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) {
    throw new Error('WebGL not supported');
  }
  return gl;
};