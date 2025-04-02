"use client";

import { Camera, Transform } from "ogl";

export async function create(texs = [], canvasRef) {
  await this.createAssets(texs);

  const loader = document.createElement("div");
  loader.dataset.temp = "loader";
  this.loader = await this.createEls(loader, "loader", canvasRef);

  await this.onResize();
  this.isVisible = true;
}

export function createCamera() {
  const camera = new Camera(this.gl);
  camera.position.z = 45;
  return camera;
}

export function createScene() {
  this.scene = new Transform();
}

export async function cleanTemp() {
  this.iosmap.forEach((element) => {
    element.removeEvents();
    element.renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
  });
}

export default {
  create,
  createCamera,
  createScene,
};