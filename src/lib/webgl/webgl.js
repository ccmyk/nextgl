import { Renderer, Camera, Transform } from 'ogl';

export function initWebGL(canvas) {
  const renderer = new Renderer({ canvas, alpha: true });
  const gl = renderer.gl;
  const camera = new Camera(gl);
  const scene = new Transform();
  return { gl, renderer, camera, scene };
}
