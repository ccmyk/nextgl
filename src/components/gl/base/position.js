// 🖼 src/components/gl/base/position.js

export function check(entry) {
  let vis = entry.isIntersecting;
  if (vis) this.start();
  else this.stop();
  return vis;
}

export function start() {
  if (this.active === 1) return false;
  if (this.isVideo) this.tex.image.play();
  this.active = 1;
  this.updateX();
  this.updateY();
  this.updateScale();
}

export function stop() {
  if (this.active <= 0) return false;
  if (this.isVideo) this.media.pause();
  this.active = 0;
}

export function updateX() {}

export function updateY(y = 0) {
  if (this.ctr.stop !== 1) {
    this.ctr.current = Math.max(0, Math.min(this.ctr.limit, y - this.ctr.start));
  }
}

export function updateAnim() {
  this.ctr.progt = (this.ctr.current / this.ctr.limit).toFixed(3);
  this.ctr.prog = this.lerp(this.ctr.prog, this.ctr.progt, this.ctr.lerp);
  this.animCtrl.progress(this.ctr.prog);
}

export function updateScale() {}