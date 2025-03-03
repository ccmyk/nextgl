"use client";

// Add "use client" directive to the file

export function check(entry) {
  let vis = entry.isIntersecting;
  if (vis) this.start();
  else this.stop();
  return vis;
}

export function start() {
  if (this.active === 1) return false;
  this.active = 1;
  return true;
}

export function stop() {
  if (this.active === -1) return false;
  this.active = -1;
  return true;
}

export function updateX() {}

export function updateY(y = 0) {
  this.mesh.program.uniforms.uMouse.value.y = y;
}

export function updateAnim() {
  this.mesh.program.uniforms.uTime.value += 0.01;
}

export function updateScale() {}